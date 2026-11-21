import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import CompanyBranchDialog from '../CompanyBranchDialog';

const saveCompanyBranch = vi.fn();
let companyBranchFormResponse: { form: { id: string; name: string; address: string } } | undefined;

vi.mock('src/app/requests/company-branches/useMutationSaveCompanyBranch', () => ({
	useMutationSaveCompanyBranch: () => ({ mutateAsync: saveCompanyBranch, isLoading: false })
}));
vi.mock('src/app/requests/company-branches/useQueryGetCompanyBranchForm', () => ({
	useQueryGetCompanyBranchForm: () => ({ data: companyBranchFormResponse, isLoading: false })
}));
vi.mock('src/app/shared/hooks/useQueryInvalidator', () => ({ default: () => ({ invalidate: vi.fn() }) }));
vi.mock('app/core/feedback/toast', () => ({ displayToast: vi.fn() }));

describe('CompanyBranchDialog', () => {
	const onClose = vi.fn();

	beforeEach(() => {
		saveCompanyBranch.mockReset().mockResolvedValue({ id: 'branch-1' });
		onClose.mockReset();
		companyBranchFormResponse = undefined;
	});

	it('requires name and address before saving', async () => {
		render(<CompanyBranchDialog open companyBranchId="" onClose={onClose} />);

		fireEvent.click(screen.getByRole('button', { name: 'Crear sucursal' }));

		expect(await screen.findAllByText('Este campo es requerido')).toHaveLength(2);
		expect(saveCompanyBranch).not.toHaveBeenCalled();
	});

	it('creates a branch with the typed name and address', async () => {
		render(<CompanyBranchDialog open companyBranchId="" onClose={onClose} />);

		fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Centro' } });
		fireEvent.change(screen.getByLabelText('Dirección'), { target: { value: 'Av. Juárez 120' } });
		fireEvent.click(screen.getByRole('button', { name: 'Crear sucursal' }));

		await waitFor(() => expect(onClose).toHaveBeenCalled());
		expect(saveCompanyBranch).toHaveBeenCalledWith(expect.objectContaining({ name: 'Centro', address: 'Av. Juárez 120' }));
	});

	it('sends the loaded form back with its id when editing', async () => {
		companyBranchFormResponse = { form: { id: 'branch-1', name: 'Centro', address: 'Av. Juárez 120' } };
		render(<CompanyBranchDialog open companyBranchId="branch-1" onClose={onClose} />);

		await waitFor(() => expect(screen.getByLabelText('Nombre')).toHaveValue('Centro'));
		fireEvent.change(screen.getByLabelText('Dirección'), { target: { value: 'Calle 5' } });
		fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

		await waitFor(() =>
			expect(saveCompanyBranch).toHaveBeenCalledWith({ id: 'branch-1', name: 'Centro', address: 'Calle 5' })
		);
	});
});

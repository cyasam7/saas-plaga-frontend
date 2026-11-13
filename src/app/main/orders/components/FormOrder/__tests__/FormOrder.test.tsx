import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from 'react-query';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import FormOrder from '../FormOrder';

dayjs.extend(utc);
dayjs.extend(timezone);
import { EClientType, IFormCreatePest } from '../FormOrderProps';
import { defaultValuesOrder } from '../defaultValues';

// Mocks
// La búsqueda por teléfono se dispara con `refetch` del hook al salir del campo.
const getClientInfoByPhone = vi.fn();
vi.mock('src/app/requests/orders/useQueryClientDataByPhone', () => ({
	useQueryClientDataByPhone: () => ({
		refetch: async () => ({ data: await getClientInfoByPhone() })
	})
}));

const openDialog = vi.fn();
vi.mock('app/shared/components/GlobalDialog/GlobalDialogContext', () => ({
	useGlobalDialog: () => ({ openDialog: (...args: unknown[]) => openDialog(...args) })
}));

// Business form data (request hooks)
vi.mock('src/app/requests/clients/useQueryClients', () => ({
	useQueryClients: () => ({ data: [], isLoading: false })
}));
vi.mock('src/app/requests/branches/useQueryBranches', () => ({
	useQueryBranches: () => ({ data: [], isLoading: false, refetch: vi.fn() })
}));

const CLIENT_FOUND = {
	clientId: 'client-1',
	clientName: 'Jane Doe',
	clientAddress: 'Av. Juarez 123',
	clientType: EClientType.INDIVIDUAL
};

function Harness({ clientType }: { clientType: EClientType }) {
	const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	const formHandler = useForm<IFormCreatePest>({
		defaultValues: {
			...defaultValuesOrder,
			clientType,
			clientPhone: '+5215555555555'
		}
	});
	return (
		<QueryClientProvider client={queryClient}>
			<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
				<FormOrder formHandler={formHandler} />
			</LocalizationProvider>
		</QueryClientProvider>
	);
}

function getPhoneInput(): HTMLInputElement {
	const input = document.querySelector('input[type="tel"]');
	if (!input) throw new Error('phone input not found');
	return input as HTMLInputElement;
}

describe('FormOrder', () => {
	beforeEach(() => {
		getClientInfoByPhone.mockReset();
		openDialog.mockReset();
	});

	it('renders the "Tipo de cliente" selector with both options', () => {
		render(<Harness clientType={EClientType.INDIVIDUAL} />);

		expect(screen.getByText('Tipo de cliente')).toBeInTheDocument();
		expect(screen.getByLabelText('Empresas (B2B)')).toBeInTheDocument();
		expect(screen.getByLabelText('Residencial')).toBeInTheDocument();
	});

	it('selects the client type via keyboard on the accessible radio cards', () => {
		render(<Harness clientType={EClientType.INDIVIDUAL} />);

		const residential = screen.getByLabelText('Residencial');
		const business = screen.getByLabelText('Empresas (B2B)');

		// Cards expose radio semantics and current selection state.
		expect(residential).toHaveAttribute('role', 'radio');
		expect(residential).toHaveAttribute('aria-checked', 'true');
		expect(business).toHaveAttribute('aria-checked', 'false');

		// Activating with the keyboard switches the selected option.
		business.focus();
		fireEvent.keyDown(business, { key: 'Enter' });

		expect(screen.getByLabelText('Empresas (B2B)')).toHaveAttribute('aria-checked', 'true');
		expect(screen.getByLabelText('Residencial')).toHaveAttribute('aria-checked', 'false');
	});

	it('opens the confirmation dialog and autocompletes when a residential client is found', async () => {
		getClientInfoByPhone.mockResolvedValue(CLIENT_FOUND);
		render(<Harness clientType={EClientType.INDIVIDUAL} />);

		fireEvent.blur(getPhoneInput());

		await waitFor(() => expect(openDialog).toHaveBeenCalledTimes(1));
		expect(getClientInfoByPhone).toHaveBeenCalledTimes(1);

		// Execute the dialog's onAccept and verify the form gets filled
		const dialogArgs = openDialog.mock.calls[0][0];
		dialogArgs.onAccept();

		await waitFor(() =>
			expect((screen.getByLabelText(/Nombre completo/i) as HTMLInputElement).value).toBe('Jane Doe')
		);
	});

	it('renders the business flow (existing/new toggle) instead of the phone autocomplete', async () => {
		render(<Harness clientType={EClientType.BUSINESS} />);

		// Business flow shows the existing/new client toggle, not the residential phone lookup.
		expect(screen.getByLabelText('Cliente existente')).toBeInTheDocument();
		expect(screen.getByLabelText('Nuevo cliente')).toBeInTheDocument();

		await new Promise((r) => setTimeout(r, 0));
		expect(getClientInfoByPhone).not.toHaveBeenCalled();
		expect(openDialog).not.toHaveBeenCalled();
	});
});

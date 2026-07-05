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
const getClientInfoByPhone = vi.fn();
vi.mock('src/app/shared/services/OrderService', () => ({
	OrderService: {
		getClientInfoByPhone: (...args: unknown[]) => getClientInfoByPhone(...args)
	}
}));

const openDialog = vi.fn();
vi.mock('app/shared-components/GlobalDialog/openDialog', () => ({
	openDialog: (...args: unknown[]) => openDialog(...args)
}));

// Business form data services
vi.mock('src/app/shared/services/ClientService', () => ({
	ClientService: {
		getByQuery: vi.fn().mockResolvedValue([])
	}
}));
vi.mock('src/app/shared/services/BranchService', () => ({
	BranchService: {
		byQuery: vi.fn().mockResolvedValue([])
	}
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

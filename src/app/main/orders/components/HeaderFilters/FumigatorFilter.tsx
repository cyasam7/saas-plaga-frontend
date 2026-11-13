import { MenuItem, TextField } from '@mui/material';
import { useQueryFumigatorsToAssignOrder } from 'src/app/requests/orders/useQueryFumigatorsToAssignOrder';

interface FumigatorFilterProps {
	/** Cadena vacía = todos los fumigadores. */
	value: string;
	onChange: (fumigatorId: string) => void;
	fullWidth?: boolean;
}

const ALL_FUMIGATORS = '';

export function FumigatorFilter({ value, onChange, fullWidth }: FumigatorFilterProps) {
	const { data: fumigators = [], isLoading } = useQueryFumigatorsToAssignOrder();

	return (
		<TextField
			select
			size="small"
			label="Fumigador"
			value={value}
			disabled={isLoading}
			onChange={(e) => onChange(e.target.value)}
			sx={{ minWidth: 200 }}
			fullWidth={fullWidth}
		>
			<MenuItem value={ALL_FUMIGATORS}>Todos</MenuItem>
			{fumigators.map((fumigator) => (
				<MenuItem
					key={fumigator.userId}
					value={fumigator.userId}
				>
					{fumigator.name}
				</MenuItem>
			))}
		</TextField>
	);
}

export default FumigatorFilter;

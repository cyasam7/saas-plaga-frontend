import { InputAdornment, TextField } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { Search } from '@mui/icons-material';

interface SearchFieldProps {
	placeholder: string;
	/** Accessible name; the field has no visible label. */
	ariaLabel: string;
	onChange: (search: string) => void;
	/** Omit to leave the field uncontrolled. */
	value?: string;
	sx?: SxProps<Theme>;
}

/** Search input used in every list page's filter bar. */
function SearchField({ placeholder, ariaLabel, onChange, value, sx }: SearchFieldProps) {
	return (
		<TextField
			size="small"
			type="search"
			placeholder={placeholder}
			value={value}
			onChange={(event) => onChange(event.target.value)}
			inputProps={{ 'aria-label': ariaLabel }}
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<Search fontSize="small" />
					</InputAdornment>
				)
			}}
			sx={sx}
		/>
	);
}

export default SearchField;

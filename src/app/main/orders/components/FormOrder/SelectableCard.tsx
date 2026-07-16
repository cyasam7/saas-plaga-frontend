import { KeyboardEvent, ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

interface ISelectableCardProps {
	icon: ReactNode;
	label: string;
	description: string;
	/** Accessible name announced to screen readers (usually a concise version of the label). */
	ariaLabel: string;
	selected: boolean;
	disabled?: boolean;
	onSelect: () => void;
}

/**
 * Radio-style option card used by the order form's client-type and business-mode selectors.
 * Keyboard-operable (Enter/Space) and exposed to assistive tech as `role="radio"`.
 */
function SelectableCard(props: ISelectableCardProps) {
	const { icon, label, description, ariaLabel, selected, disabled = false, onSelect } = props;

	function handleSelect(): void {
		if (!disabled) {
			onSelect();
		}
	}

	function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
		if (disabled) {
			return;
		}
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onSelect();
		}
	}

	return (
		<Box
			role="radio"
			aria-checked={selected}
			aria-label={ariaLabel}
			aria-disabled={disabled || undefined}
			tabIndex={disabled ? -1 : 0}
			onClick={handleSelect}
			onKeyDown={handleKeyDown}
			sx={{
				flex: 1,
				display: 'flex',
				alignItems: 'center',
				gap: 1.5,
				p: 2,
				borderRadius: 2,
				border: 2,
				borderColor: selected ? 'primary.main' : 'divider',
				bgcolor: selected ? 'action.selected' : 'background.paper',
				cursor: disabled ? 'default' : 'pointer',
				opacity: disabled ? 0.6 : 1,
				transition: 'border-color 0.2s, background-color 0.2s',
				outline: 'none',
				'&:hover': {
					borderColor: disabled ? undefined : 'primary.light'
				},
				'&:focus-visible': {
					borderColor: 'primary.main',
					boxShadow: (theme) => `0 0 0 3px ${theme.palette.primary.main}33`
				}
			}}
		>
			<Box
				sx={{
					color: selected ? 'primary.main' : 'text.secondary',
					transition: 'color 0.2s',
					display: 'flex'
				}}
			>
				{icon}
			</Box>
			<Box>
				<Typography
					variant="body2"
					sx={{ fontWeight: 600, lineHeight: 1.3 }}
				>
					{label}
				</Typography>
				<Typography
					variant="caption"
					color="text.secondary"
				>
					{description}
				</Typography>
			</Box>
		</Box>
	);
}

export default SelectableCard;

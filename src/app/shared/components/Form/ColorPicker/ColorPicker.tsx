import React, { useState } from 'react';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import { SketchPicker } from 'react-color';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { IColorPickerProps } from './ColorPickerProps';

export default function ColorPicker(props: IColorPickerProps) {
	const { onChangeColor } = props;

	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const open = Boolean(anchorEl);
	const id = open ? 'color-popover' : undefined;

	function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
		setAnchorEl(event.currentTarget);
	}

	function handleClose(): void {
		setAnchorEl(null);
	}

	function handleChangeComplete(color: { hex: string }): void {
		onChangeColor(color.hex);
	}

	return (
		<div>
			<Button
				aria-describedby={id}
				variant="contained"
				onClick={handleClick}
				startIcon={<ColorLensIcon />}
				color="primary"
			>
				Selecciona el color
			</Button>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left'
				}}
			>
				<SketchPicker onChangeComplete={handleChangeComplete} />
			</Popover>
		</div>
	);
}

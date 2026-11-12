import { Button } from '@mui/material';
import React, { useRef } from 'react';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { IFileChooserProps } from './IFileChooserProps';

function FileChooser(props: IFileChooserProps) {
	const { onChangeFile } = props;
	const ref = useRef(null);

	function handleOpenFile(): void {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		ref?.current?.click();
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
		onChangeFile(e.target.files);
	}

	return (
		<div>
			<Button
				variant="contained"
				onClick={handleOpenFile}
				color="primary"
				startIcon={<InsertDriveFileIcon />}
			>
				Selecciona el archivo
			</Button>
			<input
				hidden
				ref={ref}
				type="file"
				onChange={handleChange}
			/>
		</div>
	);
}

export default FileChooser;

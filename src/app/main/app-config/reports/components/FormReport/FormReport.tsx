import { Button, Divider, Stack, TextField, Typography } from '@mui/material';
import ColorPicker from 'app/shared-components/Form/ColorPicker/ColorPicker';
import FileChooser from 'app/shared-components/Form/FileChooser/FileChooser';
import SignaturaCanvas from 'app/shared-components/SignatureCanvas/SignaturaCanvas';

import React from 'react';

function FormReport() {
	return (
		<>
			<Stack>
				<Typography
					variant="h5"
					className="font-600"
				>
					Configurar reporte
				</Typography>
				<Typography variant="body2">Actualiza el color, logo y firma de tu reporte</Typography>
			</Stack>
			<Stack
				spacing={2}
				mt={3}
			>
				<TextField
					fullWidth
					placeholder="Nombre de la empresa"
				/>
				<Stack
					direction="row"
					spacing={2}
					flexWrap="wrap"
					justifyContent="flex-end"
				>
					<SignaturaCanvas />
					<ColorPicker />
				</Stack>
				<FileChooser />
				<Divider />
				<Stack
					direction="row"
					spacing={2}
					justifyContent="flex-end"
				>
					<Button
						color="info"
						variant="contained"
					>
						Guardar
					</Button>
					<Button
						color="primary"
						variant="contained"
					>
						Previzualizar
					</Button>
				</Stack>
			</Stack>
		</>
	);
}

export default FormReport;

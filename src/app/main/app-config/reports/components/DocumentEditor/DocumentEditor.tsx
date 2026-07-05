import { Grid, Paper } from '@mui/material';
import React from 'react';
import DocumentCanvas from './DocumentCanvas/DocumentCanvas';
import DocumentOptions from './DocumentOptions/DocumentOptions';

function DocumentEditor() {
	return (
		<Paper sx={{ p: 2 }}>
			<Grid container>
				<Grid
					item
					md={8}
				>
					<DocumentCanvas />
				</Grid>
				<Grid
					item
					md={4}
				>
					<DocumentOptions />
				</Grid>
			</Grid>
		</Paper>
	);
}

export default DocumentEditor;

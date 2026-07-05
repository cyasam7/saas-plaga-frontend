import { Box, Typography, Button, Stack } from '@mui/material'
import React from 'react'

interface SimpleHeaderProps {
	title: string
	subtitle: string
	actions?: React.ReactNode
}

const SimpleHeader = ({ title, subtitle, actions }: SimpleHeaderProps) => {
	return (
		<Box sx={{ px: 3, pt: 2, pb: 2 }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
				<Box>
					<Typography variant="h6" component="h5">
						{title}
					</Typography>
					<Typography variant="caption" color="text.secondary">
						{subtitle}
					</Typography>
				</Box>
				{actions && (
					<Box>
						{actions}
					</Box>
				)}
			</Stack>
		</Box>
	)
}

export default SimpleHeader
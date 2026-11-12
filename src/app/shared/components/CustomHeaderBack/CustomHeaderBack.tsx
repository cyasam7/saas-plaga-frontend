import { Box, IconButton, Skeleton, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import clsx from 'clsx';
import { ICustomHeaderBackProps } from './ICustomHeaderBackProps';

function CustomHeaderBack(props: ICustomHeaderBackProps) {
	const { backText, title, subtitle, rightComponent } = props;
	const navigate = useNavigate();
	return (
		<div className="px-16 py-36 flex w-full">
			<Stack width="100%">
				<div className="w-full">
					<Box
						component="div"
						onClick={() => navigate(-1)}
						className="flex items-center space-x-8 cursor-pointer"
					>
						<IconButton size="small">
							<ArrowBackIcon sx={{ fontSize: '1.4rem', color: 'black' }} />
						</IconButton>
						<Typography className={clsx('font-medium')}>{backText}</Typography>
					</Box>
				</div>
				<Stack
					direction="row"
					width="100%"
					mt="16px"
					justifyContent="space-between"
				>
					<Stack spacing={0.5}>
						{title ? (
							<Typography
								variant="body1"
								className={clsx('font-medium text-16 sm:text-20')}
							>
								{title}
							</Typography>
						) : (
							<Skeleton
								variant="rectangular"
								width={210}
								height={50}
							/>
						)}

						{subtitle ? (
							<Typography
								className={clsx('font-medium')}
								variant="caption"
							>
								{subtitle}
							</Typography>
						) : (
							<Skeleton
								variant="rectangular"
								width={210}
								height={50}
							/>
						)}
					</Stack>
					{rightComponent}
				</Stack>
			</Stack>
		</div>
	);
}

export default CustomHeaderBack;

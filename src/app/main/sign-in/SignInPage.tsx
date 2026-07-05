import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import CardContent from '@mui/material/CardContent';
import LoginInformation from 'app/shared-components/LoginInformation/LoginInformation';
import JwtLoginTab from './tabs/JwtSignInTab';

const tabs = [
	{
		id: 'jwt',
		title: 'JWT',
		logo: 'assets/images/logo/jwt.svg',
		logoClass: 'h-40 p-4 bg-black rounded-12'
	},
	{
		id: 'firebase',
		title: 'Firebase',
		logo: 'assets/images/logo/firebase.svg',
		logoClass: 'h-40'
	}
];

/**
 * The sign in page.
 */
function SignInPage() {
	return (
		<div className="flex min-w-0 flex-1 flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<Paper className="h-full w-full px-16 py-8 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow md:flex md:h-full md:w-1/2 md:items-center md:justify-end md:rounded-none md:p-64 md:shadow-none">
				<CardContent className="mx-auto w-full max-w-320 sm:mx-0 sm:w-384">
					<img
						className="w-48"
						src="assets/images/logo/logo.svg"
						alt="logo"
					/>

					<Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
						Iniciar sesión
					</Typography>
					{/* <div className="mt-2 flex items-baseline font-medium">
						<Typography>¿Aun no tienes cuenta?</Typography>
						<Link
							className="ml-4"
							to="/sign-up"
						>
							Regístrate
						</Link>
					</div> */}

					<JwtLoginTab />

					{/* <div className="mt-32 flex items-center">
						<div className="mt-px flex-auto border-t" />
						<Typography
							className="mx-8"
							color="text.secondary"
						>
							Or continue with
						</Typography>
						<div className="mt-px flex-auto border-t" />
					</div> */}

					{/* 	<div className="mt-32 flex items-center space-x-16">
						<Button
							variant="outlined"
							className="flex-auto"
						>
							<FuseSvgIcon
								size={20}
								color="action"
							>
								feather:facebook
							</FuseSvgIcon>
						</Button>
						<Button
							variant="outlined"
							className="flex-auto"
						>
							<FuseSvgIcon
								size={20}
								color="action"
							>
								feather:twitter
							</FuseSvgIcon>
						</Button>
						<Button
							variant="outlined"
							className="flex-auto"
						>
							<FuseSvgIcon
								size={20}
								color="action"
							>
								feather:github
							</FuseSvgIcon>
						</Button>
					</div> */}
				</CardContent>
			</Paper>

			<LoginInformation />
		</div>
	);
}

export default SignInPage;

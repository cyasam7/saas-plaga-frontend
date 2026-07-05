import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import LoginInformation from 'app/shared-components/LoginInformation/LoginInformation';
import JwtSignUpTab from './tabs/JwSignUpTab';

/**
 * The sign up page.
 */
function SignUpPage() {
	return (
		<div className="flex min-w-0 flex-1 flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<Paper className="h-full w-full px-16 py-8 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow md:flex md:h-full md:w-1/2 md:items-center md:justify-end md:rounded-none md:p-64 md:shadow-none">
				<div className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
					<img
						className="w-48"
						src="assets/images/logo/logo.svg"
						alt="logo"
					/>

					<Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
						Regístrate
					</Typography>
					<div className="mt-2 flex items-baseline font-medium">
						<Typography>¿Ya tienes una cuenta?</Typography>
						<Link
							className="ml-4"
							to="/sign-in"
						>
							Inicia sesión
						</Link>
					</div>

					<JwtSignUpTab />
				</div>
			</Paper>

			<LoginInformation />
		</div>
	);
}

export default SignUpPage;

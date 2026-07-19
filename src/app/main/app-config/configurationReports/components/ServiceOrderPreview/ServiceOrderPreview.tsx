import { Box, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';
import PreviewPage from '../PreviewPage/PreviewPage';
import { safeColor } from '../../utils/safeColor';
import { IReportPreviewProps } from '../../entities/ReportPreview';

/** Datos de una orden ficticia: la configuración no los define, sólo dan contexto al preview. */
const SAMPLE = {
	number: 'N° 00001',
	date: '15 DE JULIO DEL 2026',
	clientName: 'Comercializadora del Valle S.A.',
	clientAddress: 'Dirección: Av. Reforma 1234, Col. Centro',
	clientPhone: 'Teléfono: +52 (618) 324 0572',
	pests: 'ARAÑAS, CUCARACHAS, GARRAPATAS, ETC..',
	services: 'INSPECCIÓN PROFESIONAL, MANEJO INTEGRAL DE PLAGAS, ETC...',
	systems: 'TRAMPAS MECÁNICAS, TRAMPAS DE GOMA, ETC...',
	actionPlan:
		'Se aplicará manejo integral de plagas en todas las áreas indicadas, con seguimiento programado y reporte de resultados al finalizar cada visita.',
	total: '$4,500.00'
};

function Category({ title, color, children }: { title: string; color: string; children: ReactNode }) {
	return (
		<Box>
			<Box sx={{ backgroundColor: color, height: 35, display: 'flex', alignItems: 'center', px: '8px' }}>
				<Typography sx={{ color: '#fff', fontSize: 12 }}>{title}</Typography>
			</Box>
			<Box sx={{ py: '8px', px: '4px' }}>{children}</Box>
		</Box>
	);
}

function ConceptRow({ label, value }: { label: string; value: string }) {
	return (
		<Stack
			direction="row"
			spacing={1}
			sx={{ py: '4px', borderBottom: '1px solid #E5E7EB' }}
		>
			<Typography sx={{ fontSize: 10, flex: 1 }}>{label}</Typography>
			<Typography sx={{ fontSize: 10, flex: 2 }}>{value}</Typography>
		</Stack>
	);
}

function InputValue({ displayName, value, color }: { displayName: string; value: string; color: string }) {
	return (
		<Stack
			direction="row"
			justifyContent="space-between"
			spacing={1.5}
		>
			<Typography sx={{ fontSize: 10, color }}>{displayName}:</Typography>
			<Typography sx={{ fontSize: 10 }}>{value}</Typography>
		</Stack>
	);
}

function ServiceOrderPreview({ name, address, licenseSanitary, primaryColor, logoUrl }: IReportPreviewProps) {
	const primary = safeColor(primaryColor);

	return (
		<PreviewPage>
			<Box sx={{ backgroundColor: primary, py: '12px', px: '32px' }}>
				<Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>ORDEN DE SERVICIO</Typography>
			</Box>

			<Box sx={{ px: '32px', pt: '20px' }}>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="flex-start"
				>
					<Stack
						justifyContent="space-between"
						spacing={2}
					>
						<Box>
							<Typography sx={{ fontSize: 14, color: primary, fontWeight: 700 }}>
								{name || '[Nombre de la empresa]'}
							</Typography>
							<Typography sx={{ fontSize: 10, mt: '8px' }}>
								{address || '[Dirección de la empresa]'}
							</Typography>
							<Typography sx={{ fontSize: 10, mt: '4px', color: '#4B5563' }}>
								Licencia Sanitaria: {licenseSanitary || '[Número de Licencia]'}
							</Typography>
						</Box>
						<Box>
							<Typography sx={{ fontSize: 10 }}>{SAMPLE.number}</Typography>
							<Typography sx={{ fontSize: 10, mt: '2px' }}>{SAMPLE.date}</Typography>
						</Box>
					</Stack>
					{logoUrl ? (
						<Box
							component="img"
							src={logoUrl}
							alt=""
							sx={{ width: 200, height: 80, objectFit: 'contain' }}
						/>
					) : (
						<Box
							sx={{
								width: 200,
								height: 80,
								border: '1px dashed #D1D5DB',
								borderRadius: 1,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							<Typography sx={{ fontSize: 9, color: '#9CA3AF' }}>Sin logo</Typography>
						</Box>
					)}
				</Stack>

				<Box sx={{ mt: '24px' }}>
					<Typography sx={{ fontSize: 14, color: primary }}>{SAMPLE.clientName}</Typography>
					<Typography sx={{ fontSize: 10, mt: '8px' }}>{SAMPLE.clientAddress}</Typography>
					<Typography sx={{ fontSize: 10, mt: '4px' }}>{SAMPLE.clientPhone}</Typography>
				</Box>

				<Stack
					direction="row"
					justifyContent="flex-end"
					sx={{ my: '18px' }}
				>
					<Typography sx={{ fontSize: 14, color: primary, fontWeight: 700 }}>DATOS DE SERVICIO</Typography>
				</Stack>

				<Stack spacing={1.5}>
					<Category
						title="CONCEPTO"
						color={primary}
					>
						<ConceptRow
							label="PLAGAS DETECTADAS"
							value={SAMPLE.pests}
						/>
						<ConceptRow
							label="TIPOS DE SERVICIOS"
							value={SAMPLE.services}
						/>
						<ConceptRow
							label="SISTEMAS DE APLICACIÓN"
							value={SAMPLE.systems}
						/>
					</Category>

					<Category
						title="PLAN DE ACCIÓN"
						color={primary}
					>
						<Typography sx={{ fontSize: 10, lineHeight: 1.4, letterSpacing: '0.5px' }}>
							{SAMPLE.actionPlan}
						</Typography>
					</Category>

					<Category
						title="INSTRUCCIONES FINALES"
						color={primary}
					>
						<Stack
							direction="row"
							spacing={2}
						>
							<Stack
								spacing={1}
								flex={1}
							>
								<InputValue
									color={primary}
									displayName="¿CERTIFICADO INCLUIDO?"
									value="SI"
								/>
								<InputValue
									color={primary}
									displayName="¿BRINDAR SEGUIMIENTO?"
									value="NO"
								/>
								<InputValue
									color={primary}
									displayName="DIAS"
									value="10 DIAS"
								/>
							</Stack>
							<Stack
								spacing={1}
								flex={1}
							>
								<InputValue
									color={primary}
									displayName="GARANTÍA"
									value="30 DIAS"
								/>
								<InputValue
									color={primary}
									displayName="PRÓXIMA VISITA"
									value="15/08/2026"
								/>
							</Stack>
						</Stack>
					</Category>

					<Category
						title="PRESUPUESTO GENERAL"
						color={primary}
					>
						<Stack
							direction="row"
							justifyContent="space-between"
						>
							<Typography sx={{ fontSize: 10, color: primary }}>TOTAL:</Typography>
							<Typography sx={{ fontSize: 10, fontWeight: 700 }}>{SAMPLE.total}</Typography>
						</Stack>
					</Category>
				</Stack>
			</Box>
		</PreviewPage>
	);
}

export default ServiceOrderPreview;

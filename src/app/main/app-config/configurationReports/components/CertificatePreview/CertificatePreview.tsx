import { Box, Stack, Typography } from '@mui/material';
import PreviewPage from '../PreviewPage/PreviewPage';
import { safeColor } from '../../utils/safeColor';
import { IReportPreviewProps } from '../../entities/ReportPreview';

/** Datos de una orden ficticia: la configuración no los define, sólo dan contexto al preview. */
const SAMPLE = {
	certificateNumber: 'CERT-2026-0184',
	date: '15 de julio de 2026',
	validUntil: '15 de octubre de 2026',
	clientName: 'Comercializadora del Valle S.A.',
	clientAddress: 'Av. Reforma 1234, Col. Centro',
	serviceType: 'Fumigación general',
	targetPests: 'Cucarachas, roedores',
	treatedAreas: 'Almacén, cocina, oficinas',
	chemicals: 'Cipermetrina 10%',
	applicationMethod: 'Aspersión',
	dosage: '20 ml / L'
};

function Field({ label, value }: { label: string; value: string }) {
	return (
		<Box>
			<Typography
				sx={{ fontSize: 9, color: '#6B7280' }}
				noWrap
			>
				{label}
			</Typography>
			<Typography sx={{ fontSize: 11, color: '#111827', wordBreak: 'break-word' }}>{value}</Typography>
		</Box>
	);
}

function SectionTitle({ children, color }: { children: string; color: string }) {
	return <Typography sx={{ fontSize: 13, fontWeight: 700, color, mb: 1 }}>{children}</Typography>;
}

function CertificatePreview({
	name,
	address,
	licenseSanitary,
	primaryColor,
	secondaryColor,
	logoUrl
}: IReportPreviewProps) {
	const primary = safeColor(primaryColor);
	const secondary = safeColor(secondaryColor);

	return (
		<PreviewPage>
			<Box sx={{ p: '30px' }}>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="flex-start"
					sx={{ borderTop: `8px solid ${primary}`, pt: '15px', mb: '15px' }}
				>
					<Box sx={{ width: 120 }}>
						{logoUrl ? (
							<Box
								component="img"
								src={logoUrl}
								alt=""
								sx={{ width: 100, height: 50, objectFit: 'contain' }}
							/>
						) : (
							<Box
								sx={{
									width: 100,
									height: 50,
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
					</Box>
					<Box sx={{ textAlign: 'right' }}>
						<Typography sx={{ fontSize: 20, fontWeight: 700, color: primary }}>
							Certificado de Fumigación
						</Typography>
						<Typography sx={{ fontSize: 10, color: '#4B5563', mt: '4px' }}>
							No. {SAMPLE.certificateNumber}
						</Typography>
						<Typography sx={{ fontSize: 9, color: '#4B5563' }}>Fecha de emisión: {SAMPLE.date}</Typography>
						<Typography sx={{ fontSize: 9, color: '#4B5563' }}>Válido hasta: {SAMPLE.validUntil}</Typography>
					</Box>
				</Stack>

				<Box sx={{ mb: '15px' }}>
					<SectionTitle color={secondary}>Información General</SectionTitle>
					<Stack
						direction="row"
						spacing={3}
					>
						<Stack
							spacing={1}
							flex={1}
						>
							<Field
								label="Empresa:"
								value={name || '[Nombre de la empresa]'}
							/>
							<Field
								label="Dirección de la empresa:"
								value={address || '[Dirección de la empresa]'}
							/>
							<Field
								label="Licencia Sanitaria:"
								value={licenseSanitary || '[Número de Licencia]'}
							/>
						</Stack>
						<Stack
							spacing={1}
							flex={1}
						>
							<Field
								label="Cliente:"
								value={SAMPLE.clientName}
							/>
							<Field
								label="Dirección del cliente:"
								value={SAMPLE.clientAddress}
							/>
						</Stack>
					</Stack>
				</Box>

				<Box sx={{ mb: '15px' }}>
					<SectionTitle color={secondary}>Detalles del Servicio</SectionTitle>
					<Stack
						direction="row"
						spacing={3}
					>
						<Box flex={1}>
							<Field
								label="Tipo de Servicio:"
								value={SAMPLE.serviceType}
							/>
						</Box>
						<Box flex={1}>
							<Field
								label="Plagas Objetivo:"
								value={SAMPLE.targetPests}
							/>
						</Box>
						<Box flex={1}>
							<Field
								label="Áreas Tratadas:"
								value={SAMPLE.treatedAreas}
							/>
						</Box>
					</Stack>
				</Box>

				<Box sx={{ mb: '15px' }}>
					<SectionTitle color={secondary}>Productos y Aplicación</SectionTitle>
					<Stack
						direction="row"
						spacing={3}
					>
						<Box flex={1}>
							<Field
								label="Productos Utilizados:"
								value={SAMPLE.chemicals}
							/>
						</Box>
						<Box flex={1}>
							<Field
								label="Método de Aplicación:"
								value={SAMPLE.applicationMethod}
							/>
						</Box>
						<Box flex={1}>
							<Field
								label="Dosis:"
								value={SAMPLE.dosage}
							/>
						</Box>
					</Stack>
				</Box>

				<Box>
					<SectionTitle color={secondary}>Firmas de Autorización</SectionTitle>
					<Box sx={{ width: 200 }}>
						<Box sx={{ height: 40, borderBottom: '1px solid #9CA3AF' }} />
						<Typography sx={{ fontSize: 9, color: '#4B5563', mt: '4px', textAlign: 'center' }}>
							Firma del Responsable Sanitario
						</Typography>
					</Box>
				</Box>
			</Box>
		</PreviewPage>
	);
}

export default CertificatePreview;

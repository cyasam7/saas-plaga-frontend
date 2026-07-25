import { Box, Stack, Typography } from '@mui/material';
import PreviewPage from '../PreviewPage/PreviewPage';
import ReportSection from '../ReportSection/ReportSection';
import { safeColor } from '../../utils/safeColor';
import { IReportPreviewProps } from '../../entities/ReportPreview';

/** Datos de una orden ficticia: la configuración no los define, sólo dan contexto al preview. */
const SAMPLE = {
	orderNumber: 'OS-2026-0431',
	date: '15 de julio de 2026',
	clientName: 'Comercializadora del Valle S.A.',
	clientAddress: 'Av. Reforma 1234, Col. Centro',
	clientPhone: '+52 (618) 324 0572',
	areaInfestations: 'Almacén: alta, Cocina: media, Oficinas: baja',
	plagues: 'Cucarachas, roedores',
	services: 'Fumigación general, control de roedores',
	observations:
		'Se aplicará manejo integral de plagas en todas las áreas indicadas, con seguimiento programado y reporte de resultados al finalizar cada visita.',
	includeCertificate: 'Sí',
	scheduleFollowUp: 'Sí',
	daysFollowUp: '10 días',
	servicePrice: '$4,500.00'
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

function SignatureBox({ label }: { label: string }) {
	return (
		<Box sx={{ flex: 1, textAlign: 'center' }}>
			<Box
				sx={{
					height: 45,
					border: '1px solid #d1d5db',
					borderRadius: '4px',
					backgroundColor: '#ffffff'
				}}
			/>
			<Typography sx={{ fontSize: 9, color: '#4B5563', mt: '4px' }}>{label}</Typography>
		</Box>
	);
}

function ServiceOrderPreview({ name, address, primaryColor, secondaryColor, logoUrl }: IReportPreviewProps) {
	const primary = safeColor(primaryColor);
	const secondary = safeColor(secondaryColor);

	return (
		<PreviewPage>
			<Box sx={{ p: '25px' }}>
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
						<Typography sx={{ fontSize: 18, fontWeight: 700, color: primary }}>Orden de Servicio</Typography>
						<Typography sx={{ fontSize: 10, color: '#4B5563', mt: '4px' }}>No. {SAMPLE.orderNumber}</Typography>
						<Typography sx={{ fontSize: 9, color: '#4B5563' }}>Fecha de emisión: {SAMPLE.date}</Typography>
					</Box>
				</Stack>

				<Stack spacing="10px">
					<ReportSection
						title="Información General"
						color={secondary}
						titleFontSize={12}
					>
						<Stack
							direction="row"
							flexWrap="wrap"
							useFlexGap
							spacing={2}
						>
							<Box sx={{ width: '45%' }}>
								<Field
									label="Empresa:"
									value={name || '[Nombre de la empresa]'}
								/>
							</Box>
							<Box sx={{ width: '45%' }}>
								<Field
									label="Dirección de la empresa:"
									value={address || '[Dirección de la empresa]'}
								/>
							</Box>
							<Box sx={{ width: '45%' }}>
								<Field
									label="Cliente:"
									value={SAMPLE.clientName}
								/>
							</Box>
							<Box sx={{ width: '45%' }}>
								<Field
									label="Dirección del cliente:"
									value={SAMPLE.clientAddress}
								/>
							</Box>
							<Box sx={{ width: '45%' }}>
								<Field
									label="Teléfono:"
									value={SAMPLE.clientPhone}
								/>
							</Box>
						</Stack>
					</ReportSection>

					<ReportSection
						title="Detalles del Servicio"
						color={secondary}
						titleFontSize={12}
					>
						<Stack
							direction="row"
							spacing={3}
						>
							<Box flex={1}>
								<Field
									label="Áreas revisadas y nivel de infestación:"
									value={SAMPLE.areaInfestations}
								/>
							</Box>
							<Box flex={1}>
								<Field
									label="Plagas encontradas:"
									value={SAMPLE.plagues}
								/>
							</Box>
							<Box flex={1}>
								<Field
									label="Servicios a realizar:"
									value={SAMPLE.services}
								/>
							</Box>
						</Stack>
					</ReportSection>

					<ReportSection
						title="Plan de Acción y Observaciones"
						color={secondary}
						titleFontSize={12}
					>
						<Typography sx={{ fontSize: 11, color: '#111827' }}>{SAMPLE.observations}</Typography>
					</ReportSection>

					<ReportSection
						title="Instrucciones y Seguimiento"
						color={secondary}
						titleFontSize={12}
					>
						<Stack
							direction="row"
							spacing={3}
						>
							<Box flex={1}>
								<Field
									label="Incluir certificado:"
									value={SAMPLE.includeCertificate}
								/>
							</Box>
							<Box flex={1}>
								<Field
									label="Programar seguimiento:"
									value={SAMPLE.scheduleFollowUp}
								/>
							</Box>
							<Box flex={1}>
								<Field
									label="Días para seguimiento:"
									value={SAMPLE.daysFollowUp}
								/>
							</Box>
							<Box flex={1}>
								<Field
									label="Costo del servicio:"
									value={SAMPLE.servicePrice}
								/>
							</Box>
						</Stack>
					</ReportSection>

					<ReportSection
						title="Firmas de Autorización"
						color={secondary}
						titleFontSize={12}
					>
						<Stack
							direction="row"
							spacing={2}
						>
							<SignatureBox label="Firma del Técnico" />
							<SignatureBox label="Firma del Cliente" />
						</Stack>
					</ReportSection>

					<ReportSection
						title="Aviso de Privacidad"
						color={secondary}
						titleFontSize={12}
					>
						<Typography sx={{ fontSize: 9, color: '#4B5563' }}>
							La información personal recopilada en este reporte será utilizada únicamente para fines de
							prestación del servicio y no será compartida con terceros sin su consentimiento.
						</Typography>
					</ReportSection>
				</Stack>
			</Box>
		</PreviewPage>
	);
}

export default ServiceOrderPreview;

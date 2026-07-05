import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { ReactElement } from 'react';

// Register fonts
Font.register({
	family: 'Helvetica',
	fonts: [
		{
			src: '/fonts/Helvetica.ttf',
			fontWeight: 'normal'
		},
		{
			src: '/fonts/Helvetica-Bold.ttf',
			fontWeight: 'bold'
		}
	]
});

// Create styles
const styles = StyleSheet.create({
	page: {
		padding: 25,
		fontFamily: 'Helvetica',
		fontSize: 9
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
		borderTopWidth: 8,
		borderTopColor: '#1a5f7a',
		paddingTop: 10
	},
	headerLeft: {
		flexDirection: 'row',
		gap: 10,
		alignItems: 'center'
	},
	logo: {
		width: 80,
		height: 40,
		objectFit: 'contain'
	},
	titleContainer: {
		alignItems: 'flex-end'
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#1a5f7a'
	},
	certificateNumber: {
		fontSize: 10,
		color: '#4B5563',
		marginTop: 4,
		marginBottom: 2
	},
	dateInfo: {
		fontSize: 9,
		color: '#4B5563',
		marginTop: 2,
		textAlign: 'right'
	},
	section: {
		backgroundColor: '#f8fafc',
		padding: 10,
		borderRadius: 6,
		marginBottom: 8
	},
	sectionTitle: {
		fontSize: 12,
		fontWeight: 'bold',
		color: '#2d9cdb',
		marginBottom: 8
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12
	},
	gridItem: {
		width: '45%',
		marginBottom: 6
	},
	label: {
		fontSize: 8,
		color: '#4B5563',
		fontWeight: 'bold'
	},
	value: {
		fontSize: 9,
		marginTop: 1,
		color: '#1F2937'
	},
	list: {
		marginTop: 6
	},
	listItem: {
		fontSize: 9,
		color: '#1F2937',
		marginBottom: 2
	},
	signatureSection: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 20,
		marginTop: 6
	},
	signatureBox: {
		height: 45,
		width: '100%',
		borderWidth: 1,
		borderColor: '#d1d5db',
		borderRadius: 4,
		marginTop: 4,
		marginBottom: 2,
		backgroundColor: '#ffffff'
	},
	signatureLabel: {
		fontSize: 7,
		color: '#4B5563',
		fontWeight: 'bold',
		textAlign: 'center'
	}
});

export function getYesOrNo(value: boolean): string {
	return value ? 'Si' : 'No';
}

export interface IServiceOrderReport {
	report: {
		companyLogo: string;
		companyName: string;
		orderNumber: string;
		companyAddress: string;
		date: string;
		clientName: string;
		clientAddress: string;
		clientPhone: string;
		services: string[];
		observations: string;
		includeCertificate: boolean;
		scheduleFollowUp: boolean;
		daysFollowUp: number;
		servicePrice: string;
		infestationArea: string;
		infestationLvl: string;
		plagues: string;
		signFumigator: string;
		signClient: string;
	};
}

export function ServiceOrderReport(props: IServiceOrderReport): ReactElement {
	const { report } = props;
	return (
		<Document>
			<Page
				size="A4"
				style={styles.page}
			>
				<View style={styles.header}>
					<View style={styles.headerLeft}>
						<Image
							src={report.companyLogo}
							style={styles.logo}
						/>
					</View>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Orden de Servicio</Text>
						<Text style={styles.certificateNumber}>No. {report.orderNumber}</Text>
						<Text style={styles.dateInfo}>
							Fecha de emisión:{' '}
							{new Date(report.date).toLocaleDateString('es-ES', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Información General</Text>
					<View style={styles.grid}>
						<View style={styles.gridItem}>
							<Text style={styles.label}>Empresa:</Text>
							<Text style={styles.value}>{report.companyName}</Text>
						</View>
						<View style={styles.gridItem}>
							<Text style={styles.label}>Dirección de la empresa:</Text>
							<Text style={styles.value}>{report.companyAddress}</Text>
						</View>
						<View style={styles.gridItem}>
							<Text style={styles.label}>Cliente:</Text>
							<Text style={styles.value}>{report.clientName}</Text>
						</View>
						<View style={styles.gridItem}>
							<Text style={styles.label}>Dirección del cliente:</Text>
							<Text style={styles.value}>{report.clientAddress}</Text>
						</View>
						<View style={styles.gridItem}>
							<Text style={styles.label}>Teléfono:</Text>
							<Text style={styles.value}>{report.clientPhone}</Text>
						</View>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Detalles del Servicio</Text>
					<View style={styles.grid}>
						<View style={styles.gridItem}>
							<Text style={styles.label}>Áreas revisadas:</Text>
							<Text style={styles.value}>{report.infestationArea}</Text>
						</View>
						<View style={styles.gridItem}>
							<Text style={styles.label}>Nivel de infestación:</Text>
							<Text style={styles.value}>{report.infestationLvl}</Text>
						</View>
						<View style={styles.gridItem}>
							<Text style={styles.label}>Plagas encontradas:</Text>
							<Text style={styles.value}>{report.plagues}</Text>
						</View>
					</View>

					<View style={[styles.section, { backgroundColor: '#ffffff', marginTop: 15 }]}>
						<Text style={styles.sectionTitle}>Servicios a realizar</Text>
						<View style={styles.list}>
							<Text style={styles.listItem}>• {report.services.join(', ')}</Text>
						</View>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Plan de Acción y Observaciones</Text>
					<Text style={styles.value}>{report.observations}</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Instrucciones y Seguimiento</Text>
					<View style={styles.grid}>
						<View style={styles.gridItem}>
							<Text style={styles.label}>Incluir certificado:</Text>
							<Text style={styles.value}>{getYesOrNo(report.includeCertificate)}</Text>
						</View>
						<View style={styles.gridItem}>
							<Text style={styles.label}>Programar seguimiento:</Text>
							<Text style={styles.value}>{getYesOrNo(report.scheduleFollowUp)}</Text>
						</View>
						<View style={styles.gridItem}>
							<Text style={styles.label}>Días para seguimiento:</Text>
							<Text style={styles.value}>{`${report.daysFollowUp} días`}</Text>
						</View>
						<View style={styles.gridItem}>
							<Text style={styles.label}>Costo del servicio:</Text>
							<Text style={styles.value}>${report.servicePrice}</Text>
						</View>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Firmas de Autorización</Text>
					<View style={styles.signatureSection}>
						<View style={{ flex: 1, alignItems: 'center' }}>
							<Image
								src={
									report.signFumigator ||
									'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
								}
								style={styles.signatureBox}
							/>
							<Text style={styles.signatureLabel}>Firma del Técnico</Text>
						</View>
						<View style={{ flex: 1, alignItems: 'center' }}>
							<Image
								src={
									report.signClient ||
									'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
								}
								style={styles.signatureBox}
							/>
							<Text style={styles.signatureLabel}>Firma del Cliente</Text>
						</View>
					</View>
				</View>

				<View style={[styles.section, { marginBottom: 0 }]}>
					<Text style={styles.sectionTitle}>Aviso de Privacidad</Text>
					<Text style={styles.value}>
						La información personal recopilada en este reporte será utilizada únicamente para fines de
						prestación del servicio y no será compartida con terceros sin su consentimiento.
					</Text>
				</View>
			</Page>
		</Document>
	);
}

import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

// Register fonts
Font.register({
	family: 'Inter',
	src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
});

// Create styles
const styles = StyleSheet.create({
	page: {
		padding: 30,
		fontFamily: 'Inter'
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 15,
		borderTopWidth: 8,
		borderTopColor: '#1a5f7a',
		paddingTop: 15
	},
	logoContainer: {
		width: 120
	},
	logo: {
		width: 100,
		height: 50,
		objectFit: 'contain'
	},
	licenseNumber: {
		fontSize: 8,
		color: '#4B5563',
		marginTop: 4
	},
	titleContainer: {
		alignItems: 'flex-end'
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#1a5f7a'
	},
	certificateNumber: {
		fontSize: 12,
		color: '#4B5563',
		marginTop: 8,
		marginBottom: 4
	},
	dateInfo: {
		fontSize: 10,
		color: '#4B5563',
		marginTop: 2,
		textAlign: 'right'
	},
	companyName: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#2d9cdb',
		marginBottom: 15
	},
	infoSection: {
		backgroundColor: '#f8fafc',
		padding: 15,
		borderRadius: 6,
		marginBottom: 15
	},
	infoSectionTitle: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#2d9cdb',
		marginBottom: 15
	},
	infoGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 20
	},
	infoColumn: {
		flex: 1,
		minWidth: '45%'
	},
	infoRow: {
		marginBottom: 10
	},
	label: {
		fontSize: 9,
		color: '#4B5563',
		fontWeight: 'bold'
	},
	value: {
		fontSize: 10,
		marginTop: 2,
		color: '#1F2937'
	},
	serviceDetails: {
		backgroundColor: '#f8fafc',
		padding: 15,
		borderRadius: 6,
		marginBottom: 15
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#2d9cdb',
		marginBottom: 10
	},
	serviceGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	serviceItem: {
		width: '50%',
		marginBottom: 10
	},
	productsSection: {
		backgroundColor: '#ffffff',
		padding: 12,
		borderRadius: 4,
		marginTop: 15
	},
	signatureSection: {
		backgroundColor: '#f8fafc',
		padding: 15,
		borderRadius: 6,
		marginTop: 0
	},
	signatureTitle: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#2d9cdb',
		marginBottom: 15
	},
	signatureContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 20
	},
	signatureBox: {
		flex: 1,
		maxWidth: 200,
		alignItems: 'center'
	},
	signatureImage: {
		height: 80,
		width: '100%',
		borderWidth: 1,
		borderColor: '#d1d5db',
		borderRadius: 4,
		marginBottom: 8,
		backgroundColor: '#ffffff'
	},
	signatureLabel: {
		fontSize: 9,
		color: '#4B5563',
		fontWeight: 'bold',
		textAlign: 'center'
	}
});

export interface CertificateData {
	companyName: string;
	companyAddress: string;
	clientName: string;
	address: string;
	date: string;
	certificateNumber: string;
	validUntil: string;
	logoUrl: string;
	sanitaryLicense: string;
	serviceType: string;
	treatedAreas: string;
	chemicals: string;
	targetPests: string;
	applicationMethod: string;
	dosage: string;
	urlTechnicalSignature: string;
}

interface CertificatePDFProps {
	data: CertificateData;
	primaryColor: string;
	secondaryColor: string;
	showLogo?: boolean;
}

function Certificate({ data, primaryColor, secondaryColor, showLogo = true }: CertificatePDFProps): JSX.Element {
	return (
		<Document>
			<Page
				size="A4"
				style={styles.page}
			>
				<View style={[styles.header, { borderTopColor: primaryColor }]}>
					{showLogo && (
						<View style={styles.logoContainer}>
							<Image
								src={data.logoUrl}
								style={styles.logo}
							/>
						</View>
					)}
					<View style={styles.titleContainer}>
						<Text style={[styles.title, { color: primaryColor }]}>Certificado de Fumigación</Text>
						<Text style={styles.certificateNumber}>No. {data.certificateNumber}</Text>
						<Text style={styles.dateInfo}>
							Fecha de emisión:{' '}
							{new Date(data.date).toLocaleDateString('es-ES', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							}) || '[Fecha de emisión]'}
						</Text>
						<Text style={styles.dateInfo}>
							Válido hasta:{' '}
							{new Date(data.validUntil).toLocaleDateString('es-ES', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							}) || '[Fecha de validez]'}
						</Text>
					</View>
				</View>

				<View style={styles.infoSection}>
					<Text style={[styles.infoSectionTitle, { color: secondaryColor }]}>Información General</Text>
					<View style={styles.infoGrid}>
						<View style={styles.infoColumn}>
							<View style={styles.infoRow}>
								<Text style={styles.label}>Empresa:</Text>
								<Text style={styles.value}>{data.companyName}</Text>
							</View>
							<View style={styles.infoRow}>
								<Text style={styles.label}>Dirección de la empresa:</Text>
								<Text style={styles.value}>{data.companyAddress || '[Dirección de la empresa]'}</Text>
							</View>
							<View style={styles.infoRow}>
								<Text style={styles.label}>Licencia Sanitaria:</Text>
								<Text style={styles.value}>{data.sanitaryLicense || '[Número de Licencia]'}</Text>
							</View>
						</View>
						<View style={styles.infoColumn}>
							<View style={styles.infoRow}>
								<Text style={styles.label}>Cliente:</Text>
								<Text style={styles.value}>{data.clientName || '[Nombre del Cliente]'}</Text>
							</View>
							<View style={styles.infoRow}>
								<Text style={styles.label}>Dirección del cliente:</Text>
								<Text style={styles.value}>{data.address || '[Dirección]'}</Text>
							</View>
						</View>
					</View>
				</View>

				<View style={styles.serviceDetails}>
					<Text style={[styles.sectionTitle, { color: secondaryColor }]}>Detalles del Servicio</Text>

					<View style={styles.serviceGrid}>
						<View style={styles.serviceItem}>
							<Text style={styles.label}>Tipo de Servicio:</Text>
							<Text style={styles.value}>{data.serviceType || '[Tipo de Servicio]'}</Text>
						</View>

						<View style={styles.serviceItem}>
							<Text style={styles.label}>Plagas Objetivo:</Text>
							<Text style={styles.value}>{data.targetPests || '[Plagas Objetivo]'}</Text>
						</View>

						<View style={styles.serviceItem}>
							<Text style={styles.label}>Áreas Tratadas:</Text>
							<Text style={styles.value}>{data.treatedAreas || '[Áreas Tratadas]'}</Text>
						</View>
					</View>

					<View style={styles.productsSection}>
						<Text style={[styles.sectionTitle, { color: secondaryColor, fontSize: 14 }]}>
							Productos y Aplicación
						</Text>

						<View style={styles.serviceGrid}>
							<View style={styles.serviceItem}>
								<Text style={styles.label}>Productos Utilizados:</Text>
								<Text style={styles.value}>{data.chemicals || '[Productos Químicos]'}</Text>
							</View>

							<View style={styles.serviceItem}>
								<Text style={styles.label}>Método de Aplicación:</Text>
								<Text style={styles.value}>{data.applicationMethod || '[Método]'}</Text>
							</View>

							<View style={styles.serviceItem}>
								<Text style={styles.label}>Dosis:</Text>
								<Text style={styles.value}>{data.dosage || '[Dosis]'}</Text>
							</View>
						</View>
					</View>
				</View>

				<View style={styles.signatureSection}>
					<Text style={[styles.signatureTitle, { color: secondaryColor }]}>Firmas de Autorización</Text>
					<View style={styles.signatureContent}>
						<View style={styles.signatureBox}>
							<Image
								src={data.urlTechnicalSignature}
								style={styles.signatureImage}
							/>
							<Text style={styles.signatureLabel}>Firma del Responsable Sanitario</Text>
						</View>
					</View>
				</View>
			</Page>
		</Document>
	);
}

export default Certificate;

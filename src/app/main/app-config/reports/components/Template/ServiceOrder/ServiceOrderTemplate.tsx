import React, { ReactElement } from 'react';
import { Page, Document, StyleSheet, View, Text, Image, Font } from '@react-pdf/renderer';
import qrImg from '../images/qr.jpeg';
import MainLogo from '../images/logo.png';

import Category from './Category';
import InputValue from './InputValue';
import CustomText from './CustomText';

Font.register({
	family: 'Inter',
	fonts: [
		{
			src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf',
			fontWeight: 100
		},
		{
			src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfMZhrib2Bg-4.ttf',
			fontWeight: 200
		},
		{
			src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfMZhrib2Bg-4.ttf',
			fontWeight: 300
		},
		{
			src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf',
			fontWeight: 400
		},
		{
			src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf',
			fontWeight: 500
		},
		{
			src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf',
			fontWeight: 600
		},
		{
			src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf',
			fontWeight: 700
		},
		{
			src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyYMZhrib2Bg-4.ttf',
			fontWeight: 800
		},
		{
			src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWYMZhrib2Bg-4.ttf',
			fontWeight: 900
		}
	]
});

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		height: '35px',
		justifyContent: 'center',
		alignItems: 'center'
	},
	headerWrapper: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	container: {
		maxWidth: '475px',
		width: '100%'
	},
	conceptRow: {
		borderBottom: '1px solid gray',
		paddingVertical: '8px',
		flexDirection: 'row',
		alignItems: 'center'
	}
});

function ServiceOrderTemplate(props: { MainColor: string; companyName: string }): ReactElement {
	const { MainColor = 'red', companyName = 'Alexander' } = props;

	return (
		<Document>
			<Page size="A4">
				<View style={[styles.header, { backgroundColor: MainColor }]}>
					<View style={[styles.container, styles.headerWrapper]}>
						<CustomText style={{ color: '#fff', fontWeight: 'extrabold' }}>ORDEN DE SERVICIO</CustomText>
					</View>
				</View>
				<View style={{ marginTop: '20px', flexDirection: 'row', justifyContent: 'center' }}>
					<View style={styles.container}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
							<View style={{ justifyContent: 'space-between' }}>
								<View>
									<CustomText style={{ fontSize: '14px', color: MainColor, fontWeight: 'bold' }}>
										{companyName}
									</CustomText>
									<CustomText style={{ fontSize: '10px', marginTop: '8px' }}>
										RAMIREZ 416 ZONA CENTRO
									</CustomText>
								</View>
								<View>
									<CustomText style={{ fontSize: '10px' }}>N° 00001</CustomText>
									<CustomText style={{ fontSize: '10px', marginTop: '2px' }}>
										25 DE ABRIL DEL 2024
									</CustomText>
								</View>
							</View>
							<View>
								<Image
									source={MainLogo}
									style={{ width: '200px', height: '80px' }}
								/>
							</View>
						</View>
						<View style={{ marginTop: '24px' }}>
							<CustomText style={{ fontSize: '14px', color: MainColor }}>Alexander Serrano</CustomText>
							<CustomText style={{ fontSize: '10px', marginTop: '8px' }}>
								Dirección: Ramirez #416 Zona Centro
							</CustomText>
							<CustomText style={{ fontSize: '10px', marginTop: '4px' }}>
								Teléfono: +52 (618)3240572
							</CustomText>
						</View>
						<View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginVertical: '18px' }}>
							<CustomText style={{ fontSize: '14px', color: MainColor, fontWeight: 'bold' }}>
								DATOS DE SERVICIO
							</CustomText>
						</View>
						<Category
							title="CONCEPTO"
							color={MainColor}
							element={
								<View>
									<View style={styles.conceptRow}>
										<CustomText style={{ fontSize: '10px', flex: 1 }}>PLAGAS DETECTADAS</CustomText>
										<CustomText style={{ fontSize: '10px', flex: 2 }}>
											ARAÑAS, CUCARACHAS, GARRAPATAS, ECT..
										</CustomText>
									</View>
									<View style={styles.conceptRow}>
										<CustomText style={{ fontSize: '10px', flex: 1 }}>
											TIPOS DE SERVICIOS
										</CustomText>
										<Text style={{ fontSize: '10px', flex: 2 }}>
											INSPECCION PROFESIONAL, MANEJO INTEGRAL DE PLAGAS, ETC...
										</Text>
									</View>
									<View style={styles.conceptRow}>
										<CustomText style={{ fontSize: '10px', flex: 1 }}>
											SISTEMAS DE APLICACIÓN
										</CustomText>
										<CustomText style={{ fontSize: '10px', flex: 2 }}>
											TRAMPAS MECÁNICAS, TRAMPAS DE GOMA, ETC...
										</CustomText>
									</View>
								</View>
							}
						/>
						<Category
							title="PLAN DE ACCIÓN"
							color={MainColor}
							element={
								<View style={{ lineHeight: '1.4' }}>
									<CustomText style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
										Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de
										texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde
										el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta)
										desconocido usó una.
									</CustomText>
								</View>
							}
						/>
						<Category
							title="INSTRUCCIONES FINALES"
							color={MainColor}
							element={
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: '16px' }}>
									<View style={{ justifyContent: 'space-between', flex: 1 }}>
										<InputValue
											color={MainColor}
											displayName="¿CERTIFICADO INCLUIDO?"
											value="SI"
										/>
										<InputValue
											color={MainColor}
											displayName="¿BRINDAR SEGUIMIENTO?"
											value="NO"
										/>
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'space-between',
												gap: '8px'
											}}
										>
											<InputValue
												color={MainColor}
												displayName="DIAS"
												value="10 DIAS"
											/>
											<InputValue
												color={MainColor}
												displayName="COSTO"
												value="1,000$"
											/>
										</View>
									</View>
									<Image
										source={qrImg}
										style={{ width: '70px', height: '70px' }}
									/>
								</View>
							}
						/>
						<Category
							color={MainColor}
							title="PRESUPUESTO GENERAL"
							element={
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										alignItems: 'center'
									}}
								>
									<View style={{ gap: '16px', flex: 0.7 }}>
										<InputValue
											color={MainColor}
											displayName="TOTAL"
											value="1,000$"
										/>
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'space-between',
												gap: '8px'
											}}
										>
											<InputValue
												color={MainColor}
												displayName="ANTICIPO"
												value="9,000$"
											/>
											<InputValue
												color={MainColor}
												displayName="RESTAN"
												value="100$"
											/>
										</View>
									</View>
									<View style={{ alignItems: 'center', flex: 1, marginTop: '16px' }}>
										<CustomText
											style={{
												fontSize: '10px',
												borderTop: '1px solid black',
												paddingTop: '8px',
												paddingHorizontal: '22px'
											}}
										>
											Firma de Aceptación del Cliente
										</CustomText>
									</View>
								</View>
							}
						/>
						<Category
							color={MainColor}
							title="AVISO DE PRIVACIDAD"
							element={
								<View style={{ lineHeight: '1.4' }}>
									<CustomText style={{ fontSize: '10px' }}>
										En VEX Fumigaciones recopilamos información personal de nuestros clientes,
										incluyendo nombres, direcciones y detalles de contacto, exclusivamente con el
										propósito de proporcionar servicios de fumigación. Al firmar esta orden de
										servicio, usted está conforme con el servicio realizado así como la información
										brindada.
									</CustomText>
								</View>
							}
						/>
					</View>
				</View>
			</Page>
		</Document>
	);
}

export default ServiceOrderTemplate;

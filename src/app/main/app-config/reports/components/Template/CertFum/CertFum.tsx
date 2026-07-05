import React, { ReactElement } from 'react';
import { Page, Document, StyleSheet, View, Font } from '@react-pdf/renderer';

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
				<View style={[styles.header, { backgroundColor: MainColor }]} />
			</Page>
		</Document>
	);
}

export default ServiceOrderTemplate;

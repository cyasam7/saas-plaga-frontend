import { Box } from '@mui/material';
import { ReactNode, useEffect, useRef, useState } from 'react';

/** Medidas en px de una hoja A4 a 96dpi. La hoja se dibuja a este tamaño y se escala al contenedor. */
export const A4_WIDTH = 794;
export const A4_HEIGHT = 1123;

export interface IPreviewPageProps {
	children: ReactNode;
}

/** Hoja A4 que se escala para caber en el ancho disponible, conservando las proporciones del PDF. */
function PreviewPage({ children }: IPreviewPageProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);

	useEffect(() => {
		const el = containerRef.current;

		if (!el) {
			return undefined;
		}

		const observer = new ResizeObserver(([entry]) => {
			setScale(entry.contentRect.width / A4_WIDTH);
		});
		observer.observe(el);

		return () => observer.disconnect();
	}, []);

	return (
		<Box
			ref={containerRef}
			sx={{ width: '100%', height: A4_HEIGHT * scale, overflow: 'hidden' }}
		>
			<Box
				sx={{
					width: A4_WIDTH,
					height: A4_HEIGHT,
					transform: `scale(${scale})`,
					transformOrigin: 'top left',
					backgroundColor: '#FFFFFF',
					color: '#111827',
					boxShadow: 3,
					borderRadius: 1,
					overflow: 'hidden'
				}}
			>
				{children}
			</Box>
		</Box>
	);
}

export default PreviewPage;

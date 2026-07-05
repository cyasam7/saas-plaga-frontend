import { PDFDocument } from 'pdf-lib';
import React, { useMemo, useState } from 'react';

export interface IItemDraggable {
	id: string;
	title: string;
	x: number;
	y: number;
}

export interface IItemsDraggable {
	[key: string]: IItemDraggable;
}

interface ICanvas {
	width: number;
	height: number;
	pdf: PDFDocument | null;
	base64: string;
}

interface IContext {
	itemsDraggable: IItemsDraggable;
	canvas: ICanvas;
	setUpCanvas: (data: Blob) => Promise<void>;
	addItemToCanvas: (item: IItemDraggable) => void;
	downloadDocument(): Promise<void>;
}

const Context = React.createContext<IContext | null>(null);

export function DocumentCanvasProvider(props: { children: React.ReactElement }) {
	const { children } = props;
	const [canvas, setCanvas] = useState<ICanvas | null>(null);
	const [itemsDraggable, setItemsDraggable] = useState<IItemsDraggable>({});

	async function setUpCanvas(file: Blob): Promise<void> {
		const reader = new FileReader();
		reader.onload = async (e) => {
			const buffer = e.target.result;
			const pdfDoc = await PDFDocument.load(buffer);

			const page = pdfDoc.getPage(0);
			const sizePage = page.getSize();
			const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
			setCanvas({
				...sizePage,
				base64: pdfDataUri,
				pdf: pdfDoc
			});
		};

		reader.readAsArrayBuffer(file);
	}

	function addItemToCanvas(item: IItemDraggable): void {
		const copy = {
			...itemsDraggable,
			[item.id]: item
		};
		setItemsDraggable(copy);
	}

	async function downloadDocument(): Promise<void> {
		const pages = canvas.pdf.getPages();
		const page = pages[0];

		const arrayItemsDraggable = Object.values(itemsDraggable);

		arrayItemsDraggable.forEach((item) => {
			page.drawText(item.title, {
				x: item.x,
				y: item.y,
				size: 16
			});
		});

		const pdfBytes = await canvas.pdf.saveAsBase64();

		const pdfUrl = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));

		// Crea un enlace de descarga
		const link = document.createElement('a');
		link.href = pdfUrl;
		link.download = 'documento.pdf';

		// Simula un clic en el enlace para iniciar la descarga
		link.click();

		// Limpia el objeto de URL una vez finalizada la descarga
		URL.revokeObjectURL(pdfUrl);
	}

	const value = useMemo((): IContext => {
		return {
			itemsDraggable,
			canvas,
			setUpCanvas,
			addItemToCanvas,
			downloadDocument
		};
	}, [canvas, itemsDraggable]);

	return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useDocumentCanvas(): IContext | null {
	const context = React.useContext(Context);
	if (!context) {
		throw new Error('No esta dentro de document canvas provider');
	}
	return context;
}

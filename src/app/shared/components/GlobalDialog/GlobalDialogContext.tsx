import React, { createContext, useContext, useMemo, useState } from 'react';
import GlobalDialog from './GlobalDialog';

export interface IGlobalDialogOptions {
	title: string;
	text: React.ReactNode;
	onAccept: () => Promise<void> | void;
	onCancel?: () => Promise<void> | void;
	textCancel?: string;
	textAccept?: string;
}

interface IGlobalDialogContextValue {
	openDialog: (dialogOptions: IGlobalDialogOptions) => void;
}

const GlobalDialogContext = createContext<IGlobalDialogContextValue | null>(null);

type GlobalDialogProviderProps = {
	children: React.ReactNode;
};

export function GlobalDialogProvider({ children }: GlobalDialogProviderProps) {
	const [openedDialogOptions, setOpenedDialogOptions] = useState<IGlobalDialogOptions | null>(null);

	const contextValue = useMemo<IGlobalDialogContextValue>(
		() => ({ openDialog: (dialogOptions) => setOpenedDialogOptions(dialogOptions) }),
		[]
	);

	return (
		<GlobalDialogContext.Provider value={contextValue}>
			{children}
			<GlobalDialog
				dialogOptions={openedDialogOptions}
				onClose={() => setOpenedDialogOptions(null)}
			/>
		</GlobalDialogContext.Provider>
	);
}

export function useGlobalDialog(): IGlobalDialogContextValue {
	const context = useContext(GlobalDialogContext);
	if (!context) {
		throw new Error('useGlobalDialog must be used within a GlobalDialogProvider');
	}
	return context;
}

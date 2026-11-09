import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface ILayoutContextValue {
	/** Desktop sidebar expanded. */
	isNavbarOpen: boolean;
	/** Mobile drawer shown. */
	isMobileNavbarOpen: boolean;
	setIsNavbarOpen: (isNavbarOpen: boolean) => void;
	setIsMobileNavbarOpen: (isMobileNavbarOpen: boolean) => void;
}

const LayoutContext = createContext<ILayoutContextValue | null>(null);

type LayoutProviderProps = {
	children: ReactNode;
};

export function LayoutProvider(props: LayoutProviderProps) {
	const { children } = props;
	const [isNavbarOpen, setIsNavbarOpen] = useState(true);
	const [isMobileNavbarOpen, setIsMobileNavbarOpen] = useState(false);

	const layoutContextValue = useMemo(
		() => ({ isNavbarOpen, isMobileNavbarOpen, setIsNavbarOpen, setIsMobileNavbarOpen }),
		[isNavbarOpen, isMobileNavbarOpen]
	);

	return <LayoutContext.Provider value={layoutContextValue}>{children}</LayoutContext.Provider>;
}

export function useLayout(): ILayoutContextValue {
	const layoutContextValue = useContext(LayoutContext);

	if (!layoutContextValue) {
		throw new Error('useLayout must be used within a LayoutProvider');
	}

	return layoutContextValue;
}

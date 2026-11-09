import { ReactNode } from 'react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface IToastOptions {
  message: ReactNode;
  variant: ToastVariant;
  anchorOrigin: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  autoHideDuration: number | null;
}

export interface IToastState {
  isOpen: boolean;
  options: IToastOptions;
}

const defaultToastOptions: IToastOptions = {
  message: '',
  variant: 'info',
  anchorOrigin: { vertical: 'top', horizontal: 'center' },
  autoHideDuration: 2000
};

let toastState: IToastState = { isOpen: false, options: defaultToastOptions };
const toastListeners = new Set<() => void>();

function setToastState(nextToastState: IToastState) {
  toastState = nextToastState;
  toastListeners.forEach((notifyListener) => notifyListener());
}

/**
 * Shows a toast from anywhere (components, services, axios fetchers).
 * Rendered by <Toaster />, which subscribes through useSyncExternalStore.
 */
export function displayToast(toastOptions: Partial<IToastOptions>): void {
  setToastState({ isOpen: true, options: { ...defaultToastOptions, ...toastOptions } });
}

export function hideToast(): void {
  setToastState({ ...toastState, isOpen: false });
}

export function subscribeToToast(listener: () => void): () => void {
  toastListeners.add(listener);
  return () => toastListeners.delete(listener);
}

export function getToastState(): IToastState {
  return toastState;
}

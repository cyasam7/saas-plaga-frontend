import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Toaster from '../Toaster';
import { displayToast, getToastState, hideToast } from '../toast';

describe('Toaster', () => {
  it('shows the message passed to displayToast', () => {
    render(<Toaster />);
    expect(screen.queryByText('Orden guardada')).toBeNull();

    act(() => displayToast({ message: 'Orden guardada', variant: 'success' }));
    expect(screen.getByText('Orden guardada')).toBeTruthy();
  });

  it('merges options with defaults and closes with hideToast', () => {
    displayToast({ message: 'Error', variant: 'error' });
    expect(getToastState()).toMatchObject({
      isOpen: true,
      options: { message: 'Error', variant: 'error', autoHideDuration: 2000 }
    });

    hideToast();
    expect(getToastState().isOpen).toBe(false);
  });
});

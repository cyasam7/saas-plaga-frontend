import store from 'app/store/store';
import { ShowToast, showMessage } from './store/fuseMessageSlice';

export function displayToast(data: Partial<ShowToast>): void {
	store.dispatch(showMessage(data));
}

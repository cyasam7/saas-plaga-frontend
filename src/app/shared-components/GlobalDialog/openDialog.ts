import store from 'app/store/store';
import { OpenDialog, openModal } from '../../auth/user/store/dialogSlice';

export function openDialog(data: OpenDialog): void {
	store.dispatch(openModal(data));
}

import axios from 'axios';
import { IMapsAutocompleteOption, IMapsAutocompleteResponse } from '../entities/GoogleMaps';

export class GoogleMapsService {
	static async getOptionsAutocomplete(input: string): Promise<IMapsAutocompleteOption[]> {
		const instance = axios.create();

		const params = {
			input,
			inputtype: 'textquery',
			fields: 'name,formatted_address,geometry',
			key: import.meta.env.VITE_GOOGLE_API
		};

		const { data } = await instance<IMapsAutocompleteResponse>({
			method: 'POST',
			url: 'http://maps.googleapis.com/maps/api/place/findplacefromtext/json',
			params
		});
		return data.candidates.map((i) => ({
			address: i.formatted_address,
			latitude: i.geometry.location.lat,
			longitude: i.geometry.location.lng
		}));
	}
}

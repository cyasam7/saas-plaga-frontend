import { TextFieldProps } from '@mui/material';

export interface AutocompleteMapsProps {
	onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
	onChangeAddress: (value: string) => void;
	propsInput?: TextFieldProps;
}

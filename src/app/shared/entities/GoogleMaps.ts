export interface IMapsAutocompleteResponse {
	candidates: Candidate[];
	status: string;
}

export interface IMapsAutocompleteOption {
	address: string;
	latitude: number;
	longitude: number;
}

export interface Candidate {
	formatted_address: string;
	geometry: Geometry;
	name: string;
}

export interface Geometry {
	location: Location;
	viewport: Viewport;
}

export interface Location {
	lat: number;
	lng: number;
}

export interface Viewport {
	northeast: Northeast;
	southwest: Southwest;
}

export interface Northeast {
	lat: number;
	lng: number;
}

export interface Southwest {
	lat: number;
	lng: number;
}

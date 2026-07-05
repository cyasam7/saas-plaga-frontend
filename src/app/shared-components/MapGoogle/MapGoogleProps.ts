export interface ILocationMaps {
	latitude: number;
	longitude: number;
}
export interface IMapGoogleProps {
	height?: string;
	location?: ILocationMaps;
	zoom?: number;
}

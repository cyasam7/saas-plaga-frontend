import React, { useEffect, useState } from 'react';
import useGeolocation from 'src/app/shared-hooks/useGeolocation';

import { Map, Marker, useMarkerRef } from '@vis.gl/react-google-maps';
import { Skeleton } from '@mui/material';
import { IMapGoogleProps } from './MapGoogleProps';

function MapGoogle(props: IMapGoogleProps) {
	const [markerRef, marker] = useMarkerRef();
	const { height, location: propsLocation, zoom } = props;
	const location = useGeolocation();
	const [locationAddress, setLocationAddress] = useState<{ lat: number; lng: number } | null>(null);

	useEffect(() => {
		if (propsLocation?.latitude && propsLocation?.longitude) {
			setLocationAddress({
				lat: propsLocation?.latitude,
				lng: propsLocation?.longitude
			});
		}
	}, [propsLocation?.latitude, propsLocation?.longitude]);

	if (!location) {
		return (
			<Skeleton
				width="100%"
				height={height ?? '400px'}
			/>
		);
	}

	return (
		<Map
			style={{ width: '100%', height: height ?? '400px' }}
			defaultCenter={{ lat: location.latitude, lng: location.longitude }}
			center={locationAddress}
			defaultZoom={locationAddress ? 16 : zoom}
		>
			{locationAddress && (
				<Marker
					ref={markerRef}
					position={locationAddress}
				/>
			)}
		</Map>
	);
}

export default MapGoogle;

import { useEffect, useState } from 'react';

interface IUseGeoLocation {
	longitude: number;
	latitude: number;
}

const useGeolocation = (): IUseGeoLocation => {
	const [location, setLocation] = useState<IUseGeoLocation | null>(null);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition((position) => {
			setLocation({ longitude: position.coords.longitude, latitude: position.coords.latitude });
		});
	}, []);

	return location;
};

export default useGeolocation;

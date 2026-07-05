import React, { useEffect, useState, useCallback } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Autocomplete, Box, Grid, TextField, Typography } from '@mui/material';
import useDebounce from 'src/app/shared-hooks/useDebounce';
import { LocationOn } from '@mui/icons-material';
import parse from 'autosuggest-highlight/parse';
import { AutocompleteMapsProps } from './AutocompleteMapsProps';

export function AutocompleteMaps(props: AutocompleteMapsProps) {
	const { onPlaceSelect, onChangeAddress, propsInput } = props;
	const map = useMap();
	const places = useMapsLibrary('places');

	const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken>();
	const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
	const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);

	const [predictionResults, setPredictionResults] = useState<Array<google.maps.places.AutocompletePrediction>>([]);

	const [inputValue, setInputValue] = useState<string>('');
	const { debounceValue, loading } = useDebounce<string | null>(inputValue, 2000);

	useEffect(() => {
		if (props?.propsInput.value) setInputValue((props?.propsInput.value as string) ?? '');
	}, [props?.propsInput.value]);

	useEffect(() => {
		if (!places || !map) return;
		setAutocompleteService(new places.AutocompleteService());
		setPlacesService(new places.PlacesService(map));
		setSessionToken(new places.AutocompleteSessionToken());

		// eslint-disable-next-line consistent-return
		return () => {
			setAutocompleteService(null);
		};
	}, [map, places]);

	useEffect(() => {
		if (debounceValue) onInputChange(debounceValue);
	}, [debounceValue]);

	const handleChangeInput = (value: string) => {
		setInputValue(value);
		onChangeAddress(value);
	};

	const fetchPredictions = useCallback(
		async (inputValue: string) => {
			if (!autocompleteService || !inputValue) {
				setPredictionResults([]);
				return;
			}

			const request = {
				input: inputValue,
				sessionToken,
				componentRestrictions: { country: 'mx' },
				fields: ['ALL']
			};
			const response = await autocompleteService.getPlacePredictions(request);
			setPredictionResults(response.predictions);
		},
		[autocompleteService, sessionToken]
	);

	const onInputChange = useCallback(
		(value: string) => {
			handleChangeInput(value);
			fetchPredictions(value);
		},
		[fetchPredictions]
	);

	const handleSuggestionClick = useCallback(
		(placeId: string) => {
			if (!places) return;

			const detailRequestOptions = {
				placeId,
				fields: ['geometry', 'name', 'formatted_address'],
				sessionToken,
				strictBounds: false
			};

			const detailsRequestCallback = (placeDetails: google.maps.places.PlaceResult | null) => {
				onPlaceSelect(placeDetails);
				handleChangeInput(placeDetails?.formatted_address ?? '');
				setSessionToken(new places.AutocompleteSessionToken());
			};

			placesService?.getDetails(detailRequestOptions, detailsRequestCallback);
		},
		[onPlaceSelect, places, placesService, sessionToken]
	);

	return (
		<Autocomplete
			freeSolo
			inputValue={inputValue}
			disableClearable
			disabled={propsInput?.disabled}
			onInputChange={(_, newInputValue: string) => handleChangeInput(newInputValue)}
			getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
			options={predictionResults}
			loading={loading}
			renderInput={(params) => (
				<TextField
					{...params}
					{...propsInput}
				/>
			)}
			renderOption={(props, option) => {
				const matches = option.structured_formatting.main_text_matched_substrings || [];

				const parts = parse(
					option.structured_formatting.main_text,
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
					matches.map((match: any) => [match.offset, match.offset + match.length])
				);

				return (
					// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
					<li
						{...props}
						onClick={() => handleSuggestionClick(option.place_id)}
					>
						<Grid
							container
							alignItems="center"
						>
							<Grid
								item
								sx={{ display: 'flex', width: 44 }}
							>
								<LocationOn sx={{ color: 'text.secondary' }} />
							</Grid>
							<Grid
								item
								sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}
							>
								{parts.map((part, index) => (
									<Box
										key={index}
										component="span"
										sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
									>
										{part.text}
									</Box>
								))}
								<Typography
									variant="body2"
									color="text.secondary"
								>
									{option.structured_formatting.secondary_text}
								</Typography>
							</Grid>
						</Grid>
					</li>
				);
			}}
		/>
	);
}

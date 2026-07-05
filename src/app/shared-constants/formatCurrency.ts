import BigNumber from 'bignumber.js';

interface IConfigCurrency {
	decimalPlaces: number;
	mode: BigNumber.RoundingMode;
	format?: BigNumber.Format;
}

export const formatCurrency = (value: number | string, config?: IConfigCurrency): string => {
	const { decimalPlaces = 2, mode = 4, format } = config ?? {};
	const bigNumber = BigNumber(value);
	return bigNumber.toFormat(decimalPlaces, mode, format);
};

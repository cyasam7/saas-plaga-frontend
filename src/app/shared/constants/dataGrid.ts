/** DataGrid look shared by every list page: no own border (the PageContentCard has one), bold headers, compact cell padding. */
export const LIST_DATA_GRID_SX = {
	border: 0,
	'& .MuiDataGrid-columnHeaderTitle': { fontWeight: 600 },
	'& .MuiDataGrid-cell': { py: 1, px: 1, wordBreak: 'break-word' }
} as const;

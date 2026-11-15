export interface IHeaderGridProps {
	isActive: boolean | null;
	onClickCreate: () => void;
	onChangeIsActive: (isActive: boolean | null) => void;
	onChangeSearch: (search: string) => void;
}

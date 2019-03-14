import {
    ITableColumn as VSSUI_ITableColumn, ITableProps as VSSUI_ITableProps
} from "azure-devops-ui/Components/Table/Table.Props";

export interface ITableProps<T> extends Partial<VSSUI_ITableProps<T>> {
    items: T[];
    columns: ITableColumn<T>[];
}

export interface ITableColumn<T> extends VSSUI_ITableColumn<T> {
    resizable?: boolean;
    isSorted?: boolean;
    isSortedDescending?: boolean;
}

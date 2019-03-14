import "./Table.scss";

import * as React from "react";
import { Table as VSSUI_Table } from "azure-devops-ui/Components/Table/Table";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import {
    ITableColumn as VSSUI_ITableColumn, ITableProps as VSSUI_ITableProps, SortOrder
} from "azure-devops-ui/Table";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { css } from "roosterjs-react";
import { ITableColumn, ITableProps } from "./Table.Props";

function mapColumns<T>(columns: ITableColumn<T>[]): VSSUI_ITableColumn<T>[] {
    const tableColumns = columns.map(column => {
        return {
            ...column,
            resizable: undefined,
            isSorted: undefined,
            isSortedDescending: undefined,
            width: typeof column.width === "number" ? new ObservableValue(column.width) : column.width,
            sortProps: {
                sortOrder: column.isSorted ? (column.isSortedDescending ? SortOrder.descending : SortOrder.ascending) : undefined
            },
            onSize: !column.resizable
                ? undefined
                : (_event: MouseEvent, index: number, width: number) => {
                      (tableColumns[index].width as ObservableValue<number>).value = width;
                  }
        };
    });

    return tableColumns;
}

export function Table<T>(props: ITableProps<T>) {
    const { items, columns } = props;
    const itemProvider = React.useMemo(() => new ArrayItemProvider<T>(items), [items]);
    const tableColumns = React.useMemo(() => mapColumns<T>(columns), [columns]);

    const tableProps: VSSUI_ITableProps<T> = {
        ...props,
        className: css(props.className, "table-container"),
        columns: tableColumns,
        itemProvider: itemProvider
    };
    return <VSSUI_Table<T> {...tableProps} />;
}

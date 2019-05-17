import { ITable, ITableColumn, ITableProps, SortOrder } from "azure-devops-ui/Components/Table/Table.Props";
import { cellFromEvent } from "azure-devops-ui/List";
import { KeyCode } from "azure-devops-ui/Util";
import { IBehavior } from "azure-devops-ui/Utilities/Behavior";
import { IEventDispatch } from "azure-devops-ui/Utilities/Dispatch";

/**
 * The ColumnSorting class is a behavior that can be used with the Table
 * component to provide column sorting. To use the ColumnSorting, create an
 * instance passing the sorting delegate to the constructor. Then supply
 * the created behavior to the table.
 */
export class ColumnSorting<T> implements IBehavior<Partial<ITableProps<T>>, Partial<ITable<T>>> {
    private onSort: (column: ITableColumn<T>, proposedSortOrder: SortOrder) => void;
    private props: Readonly<ITableProps<T>>;
    private eventDispatch: IEventDispatch;

    constructor(onSort: (column: ITableColumn<T>, proposedSortOrder: SortOrder) => void) {
        this.onSort = onSort;
    }

    public initialize = (props: Readonly<ITableProps<T>>, _: unknown, eventDispatch: IEventDispatch): void => {
        this.props = props;

        eventDispatch.addEventListener("click", this.onClick);
        eventDispatch.addEventListener("keydown", this.onKeyDown);
        this.eventDispatch = eventDispatch;
    };

    public componentDidUpdate(props: Readonly<ITableProps<T>>) {
        this.props = props;
    }

    public componentWillUnmount() {
        this.eventDispatch.removeEventListener("click", this.onClick);
        this.eventDispatch.removeEventListener("keydown", this.onKeyDown);
    }

    private onClick = (event: React.MouseEvent<HTMLElement>) => {
        if (!event.defaultPrevented) {
            this.processSortEvent(event);
        }
    };

    private onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (!event.defaultPrevented) {
            if (event.which === KeyCode.enter || event.which === KeyCode.space) {
                this.processSortEvent(event);
            }
        }
    };

    private processSortEvent(event: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>) {
        const clickedCell = cellFromEvent(event);

        if (clickedCell.rowIndex === -1) {
            const column = this.props.columns[clickedCell.cellIndex];

            // If the column is currently sorted ascending then we need to invert the sort.
            if (column && column.sortProps) {
                this.onSort(column, column.sortProps.sortOrder === SortOrder.ascending ? SortOrder.descending : SortOrder.ascending);
                event.preventDefault();
            }
        }
    }
}

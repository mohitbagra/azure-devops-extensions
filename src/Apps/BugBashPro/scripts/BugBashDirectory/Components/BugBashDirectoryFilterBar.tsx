import * as React from "react";
import { FilterBar as VSSUI_FilterBar } from "azure-devops-ui/FilterBar";
import { KeywordFilterBarItem } from "azure-devops-ui/TextFilterBarItem";
import { Filter, FILTER_CHANGE_EVENT } from "azure-devops-ui/Utilities/Filter";
import { BugBashFieldNames } from "../Constants";
import { useBugBashesFilter } from "../Hooks/useBugBashesFilter";

export function BugBashDirectoryFilterBar() {
    const { setFilter } = useBugBashesFilter();

    const filterRef = React.useRef<Filter>(
        new Filter({
            useApplyMode: false
        })
    );

    React.useEffect(() => {
        filterRef.current.subscribe(setFilter, FILTER_CHANGE_EVENT);
        return () => {
            filterRef.current.unsubscribe(setFilter, FILTER_CHANGE_EVENT);
        };
    }, []);

    return (
        <VSSUI_FilterBar filter={filterRef.current}>
            <KeywordFilterBarItem filterItemKey={BugBashFieldNames.Title} />
        </VSSUI_FilterBar>
    );
}

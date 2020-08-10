import * as React from "react";

import { WebApiTeam } from "azure-devops-extension-api/Core/Core";
import { ListSelection } from "azure-devops-ui/Components/List/ListSelection";
import { ConditionalChildren } from "azure-devops-ui/ConditionalChildren";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { DropdownFilterBarItem } from "azure-devops-ui/Dropdown";
import { FilterBar } from "azure-devops-ui/FilterBar";
import { HeaderCommandBarWithFilter } from "azure-devops-ui/HeaderCommandBar";
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";
import { KeywordFilterBarItem } from "azure-devops-ui/TextFilterBarItem";
import { Filter, FILTER_CHANGE_EVENT } from "azure-devops-ui/Utilities/Filter";
import { Resources } from "BugBashPro/Resources";
import { AppView } from "BugBashPro/Shared/Constants";
import { navigateToBugBashItemsBoard, navigateToBugBashItemsCharts, navigateToBugBashItemsList } from "BugBashPro/Shared/NavHelpers";
import { useTeams } from "Common/AzDev/Teams/Hooks/useTeams";
import { LoadStatus } from "Common/Contracts";
import { parseUniquefiedIdentityName } from "Common/Utilities/Identity";

import { BugBashItemFieldNames, BugBashItemKeyTypes, BugBashViewContext, BugBashViewPagePivotKeys, WorkItemFieldNames } from "../Constants";
import { useBugBashItemsFilter } from "../Hooks/useBugBashItemsFilter";
import { useBugBashViewMode } from "../Hooks/useBugBashViewMode";
import { useFilteredBugBashItems } from "../Hooks/useFilteredBugBashItems";
import { BugBashItemsFilterData, BugBashViewMode } from "../Redux/Contracts";

interface IBugBashViewTabsWithFilterProps {
    view: AppView;
}

export function BugBashViewTabsWithFilter(props: IBugBashViewTabsWithFilterProps) {
    const { view } = props;
    const bugBash = React.useContext(BugBashViewContext);
    const bugBashId = bugBash.id as string;

    const { teamsMap } = useTeams();
    const { status, filterData } = useFilteredBugBashItems(bugBashId);
    const { viewMode, setViewMode } = useBugBashViewMode();
    const { setFilter } = useBugBashItemsFilter();

    const filterRef = React.useRef<Filter>(
        new Filter({
            useApplyMode: false
        })
    );
    const filterToggledRef = React.useRef(new ObservableValue<boolean>(false));
    const onFilterChange = React.useCallback(() => {
        setFilter(filterRef.current.getState());
    }, []);

    React.useEffect(() => {
        filterRef.current.subscribe(onFilterChange, FILTER_CHANGE_EVENT);
        return () => {
            filterRef.current.unsubscribe(onFilterChange, FILTER_CHANGE_EVENT);
        };
    }, []);

    const setSelectedTab = React.useCallback(
        (newTabId: string) => {
            onTabSelect(newTabId, bugBashId);
        },
        [bugBashId]
    );

    const getViewMenuItem = React.useCallback(
        (id: BugBashViewMode) => {
            return {
                id: id,
                text: id,
                iconProps:
                    viewMode === id
                        ? {
                              iconName: "CheckMark"
                          }
                        : undefined,
                onActivate: () => {
                    setViewMode(id);
                }
            };
        },
        [viewMode]
    );

    const renderTabBarCommands = React.useCallback(
        () => (
            <HeaderCommandBarWithFilter
                filter={filterRef.current}
                filterToggled={filterToggledRef.current}
                items={
                    bugBash.autoAccept || view === AppView.ACTION_BOARD
                        ? []
                        : [
                              {
                                  subtle: true,
                                  id: "view-toggle",
                                  disabled: status !== LoadStatus.Ready,
                                  text: viewMode,
                                  subMenuProps: {
                                      id: "view-toggle-submenu",
                                      items: [
                                          getViewMenuItem(BugBashViewMode.All),
                                          getViewMenuItem(BugBashViewMode.Pending),
                                          getViewMenuItem(BugBashViewMode.Rejected),
                                          getViewMenuItem(BugBashViewMode.Accepted)
                                      ]
                                  }
                              }
                          ]
                }
            />
        ),
        [bugBash.autoAccept, status, viewMode, view]
    );

    const onFilterBarDismissClicked = React.useCallback(() => {
        filterToggledRef.current.value = !filterToggledRef.current.value;
    }, []);

    return (
        <>
            <TabBar
                className="bugbash-page-tabbar bugbash-view-page-tabbar"
                selectedTabId={view}
                tabSize={TabSize.Tall}
                onSelectedTabChanged={setSelectedTab}
                renderAdditionalContent={renderTabBarCommands}
            >
                <Tab name={Resources.List} id={BugBashViewPagePivotKeys.List} />
                <Tab name={Resources.Board} id={BugBashViewPagePivotKeys.Board} />
                <Tab name={Resources.Charts} id={BugBashViewPagePivotKeys.Charts} />
            </TabBar>
            <ConditionalChildren renderChildren={filterToggledRef.current}>
                <FilterBar filter={filterRef.current} onDismissClicked={onFilterBarDismissClicked}>
                    <KeywordFilterBarItem filterItemKey={BugBashItemFieldNames.Title} placeholder="Filter by title" />
                    {viewMode !== BugBashViewMode.Accepted &&
                        viewMode !== BugBashViewMode.All &&
                        getDropdownFilterBarItem("Team", BugBashItemFieldNames.TeamId, filterData, teamsMap)}
                    {getDropdownFilterBarItem("Created By", BugBashItemFieldNames.CreatedBy, filterData)}
                    {viewMode === BugBashViewMode.Rejected && getDropdownFilterBarItem("Rejected By", BugBashItemFieldNames.RejectedBy, filterData)}
                    {viewMode === BugBashViewMode.Accepted && getDropdownFilterBarItem("State", WorkItemFieldNames.State, filterData)}
                    {viewMode === BugBashViewMode.Accepted && getDropdownFilterBarItem("Assigned To", WorkItemFieldNames.AssignedTo, filterData)}
                    {viewMode === BugBashViewMode.Accepted && getDropdownFilterBarItem("Area Path", WorkItemFieldNames.AreaPath, filterData)}
                </FilterBar>
            </ConditionalChildren>
        </>
    );
}

function onTabSelect(newTabId: string, bugBashId: string) {
    if (newTabId === BugBashViewPagePivotKeys.List) {
        navigateToBugBashItemsList(bugBashId);
    } else if (newTabId === BugBashViewPagePivotKeys.Board) {
        navigateToBugBashItemsBoard(bugBashId);
    } else {
        navigateToBugBashItemsCharts(bugBashId);
    }
}

function getDropdownFilterBarItem(
    placeholder: string,
    filterItemKey: BugBashItemFieldNames | WorkItemFieldNames,
    filterData: BugBashItemsFilterData,
    teamsMap?: { [idOrName: string]: WebApiTeam }
): JSX.Element | null {
    if (!filterData || !filterData[filterItemKey]) {
        return null;
    }
    return (
        <DropdownFilterBarItem
            key={filterItemKey}
            filterItemKey={filterItemKey}
            selection={new ListSelection(true)}
            items={getDropdownItems(filterItemKey, filterData, teamsMap)}
            placeholder={placeholder}
            noItemsText="No items"
            showFilterBox={true}
            filterPlaceholderText="Search"
            // onRenderItemText={filterItemKey === BugBashItemFieldNames.TeamId ? onRenderTeam : undefined}
        />
    );
}

function getDropdownItems(
    key: BugBashItemFieldNames | WorkItemFieldNames,
    filterData: BugBashItemsFilterData,
    teamsMap?: { [idOrName: string]: WebApiTeam }
) {
    if (!filterData) {
        return [];
    }
    const itemKeys = Object.keys(filterData[key]);
    return itemKeys.map((value) => {
        const keyType = BugBashItemKeyTypes[key];

        if (keyType === "identityRef") {
            const identity = parseUniquefiedIdentityName(value);
            return {
                text: identity!.displayName,
                id: value
            };
        } else if (key === WorkItemFieldNames.AreaPath) {
            return {
                text: value.substr(value.lastIndexOf("\\") + 1),
                id: value
            };
        } else if (key === BugBashItemFieldNames.TeamId) {
            return {
                text: teamsMap && teamsMap[value.toLowerCase()] ? teamsMap[value.toLowerCase()].name : value,
                id: value
            };
        } else {
            return {
                text: value,
                id: value
            };
        }
    });
}

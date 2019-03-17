import { WebApiTeam } from "azure-devops-extension-api/Core/Core";
import { ConditionalChildren } from "azure-devops-ui/ConditionalChildren";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { FilterBar } from "azure-devops-ui/FilterBar";
import { HeaderCommandBarWithFilter } from "azure-devops-ui/HeaderCommandBar";
import { IPickListItem, PickListFilterBarItem } from "azure-devops-ui/PickList";
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";
import { KeywordFilterBarItem } from "azure-devops-ui/TextFilterBarItem";
import { Filter, FILTER_CHANGE_EVENT } from "azure-devops-ui/Utilities/Filter";
import { Resources } from "BugBashPro/Resources";
import { AppView } from "BugBashPro/Shared/Constants";
import { LoadStatus } from "BugBashPro/Shared/Contracts";
import { navigateToBugBashItemsBoard, navigateToBugBashItemsCharts, navigateToBugBashItemsList } from "BugBashPro/Shared/NavHelpers";
import { TeamView } from "Common/Components/AzDev/TeamPicker/TeamView";
import { useMappedState } from "Common/Hooks/Redux";
import { getTeamsMap, ITeamAwareState } from "Common/Redux/Teams";
import { parseUniquefiedIdentityName } from "Common/Utilities/Identity";
import { SelectionMode } from "office-ui-fabric-react/lib/utilities/selection/interfaces";
import * as React from "react";
import { BugBashItemFieldNames, BugBashItemKeyTypes, BugBashViewPagePivotKeys, WorkItemFieldNames } from "../Constants";
import { useBugBashItems } from "../Hooks/useBugBashItems";
import { useBugBashItemsFilter } from "../Hooks/useBugBashItemsFilter";
import { useBugBashViewMode } from "../Hooks/useBugBashViewMode";
import { IBugBashViewBaseProps } from "../Interfaces";
import { BugBashItemsFilterData, BugBashViewMode } from "../Redux";

interface IBugBashViewTabsWithFilterOwnProps extends IBugBashViewBaseProps {
    view: AppView;
}

interface IBugBashViewTabsWithFilterStateProps {
    teamsMap?: { [idOrName: string]: WebApiTeam };
}

function mapStateToProps(state: ITeamAwareState): IBugBashViewTabsWithFilterStateProps {
    return {
        teamsMap: getTeamsMap(state)
    };
}

export function BugBashViewTabsWithFilter(props: IBugBashViewTabsWithFilterOwnProps) {
    const { bugBash, view } = props;
    const { teamsMap } = useMappedState(mapStateToProps);
    const { status, filterData } = useBugBashItems(bugBash.id!);
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
            onTabSelect(newTabId, bugBash.id!);
        },
        [bugBash.id]
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
                    bugBash.autoAccept
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
        [bugBash.autoAccept, status, viewMode]
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
                        getPickListFilterBarItem("Team", BugBashItemFieldNames.TeamId, filterData, teamsMap)}
                    {getPickListFilterBarItem("Created By", BugBashItemFieldNames.CreatedBy, filterData)}
                    {viewMode === BugBashViewMode.Rejected && getPickListFilterBarItem("Rejected By", BugBashItemFieldNames.RejectedBy, filterData)}
                    {viewMode === BugBashViewMode.Accepted && getPickListFilterBarItem("State", WorkItemFieldNames.State, filterData)}
                    {viewMode === BugBashViewMode.Accepted && getPickListFilterBarItem("Assigned To", WorkItemFieldNames.AssignedTo, filterData)}
                    {viewMode === BugBashViewMode.Accepted && getPickListFilterBarItem("Area Path", WorkItemFieldNames.AreaPath, filterData)}
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

function getPickListFilterBarItem(
    placeholder: string,
    filterItemKey: BugBashItemFieldNames | WorkItemFieldNames,
    filterData: BugBashItemsFilterData,
    teamsMap?: { [idOrName: string]: WebApiTeam }
): JSX.Element | null {
    if (!filterData || !filterData[filterItemKey]) {
        return null;
    }
    return (
        <PickListFilterBarItem
            key={filterItemKey}
            filterItemKey={filterItemKey}
            selectionMode={SelectionMode.multiple}
            getPickListItems={getPicklistItems(filterItemKey, filterData)}
            getListItem={getListItem(filterItemKey, teamsMap)}
            onRenderItemText={filterItemKey === BugBashItemFieldNames.TeamId ? onRenderTeam : undefined}
            placeholder={placeholder}
            noItemsText="No items"
            showSelectAll={false}
            isSearchable={true}
            searchTextPlaceholder="Search"
            minItemsForSearchBox={8}
        />
    );
}

function getPicklistItems(key: BugBashItemFieldNames | WorkItemFieldNames, filterData: BugBashItemsFilterData) {
    return () => {
        if (!filterData) {
            return [];
        }
        return Object.keys(filterData[key]);
    };
}

function getListItem(key: BugBashItemFieldNames | WorkItemFieldNames, teamsMap?: { [idOrName: string]: WebApiTeam }): (v: string) => IPickListItem {
    return (value: string) => {
        const keyType = BugBashItemKeyTypes[key];

        if (keyType === "identityRef") {
            const identity = parseUniquefiedIdentityName(value);
            return {
                name: identity!.displayName,
                key: value
            };
        } else if (key === WorkItemFieldNames.AreaPath) {
            return {
                name: value.substr(value.lastIndexOf("\\") + 1),
                key: value
            };
        } else if (key === BugBashItemFieldNames.TeamId) {
            return {
                name: teamsMap && teamsMap[value.toLowerCase()] ? teamsMap[value.toLowerCase()].name : value,
                key: value
            };
        } else {
            return {
                name: value,
                key: value
            };
        }
    };
}

function onRenderTeam(item: IPickListItem): JSX.Element {
    return <TeamView teamId={item.key} />;
}

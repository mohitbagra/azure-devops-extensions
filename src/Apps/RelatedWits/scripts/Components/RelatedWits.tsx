import "./Root.scss";

import * as React from "react";

import { Card } from "azure-devops-ui/Card";
import { DropdownFilterBarItem } from "azure-devops-ui/Components/Dropdown/DropdownFilterBarItem";
import { ListSelection } from "azure-devops-ui/Components/List/ListSelection";
import { ConditionalChildren } from "azure-devops-ui/ConditionalChildren";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { FilterBar } from "azure-devops-ui/FilterBar";
import { CustomHeader, HeaderTitle, HeaderTitleArea, HeaderTitleRow, TitleSize } from "azure-devops-ui/Header";
import { HeaderCommandBarWithFilter } from "azure-devops-ui/HeaderCommandBar";
import { Page } from "azure-devops-ui/Page";
import { KeywordFilterBarItem } from "azure-devops-ui/TextFilterBarItem";
import { Filter, FILTER_CHANGE_EVENT } from "azure-devops-ui/Utilities/Filter";
import { ZeroData } from "azure-devops-ui/ZeroData";
import { AsyncComponent } from "Common/Components/AsyncComponent";
import { Loading } from "Common/Components/Loading";
import { emptyRenderer } from "Common/Components/Renderers";
import { CoreFieldRefNames } from "Common/Constants";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { parseUniquefiedIdentityName } from "Common/Utilities/Identity";
import { isNullOrEmpty } from "Common/Utilities/String";

import { KeyTypes, RelatedWitsContext } from "../Constants";
import { RelatedWorkItemActions, RelatedWorkItemSettingsActions } from "../Redux/Actions";
import { IRelatedWitsAwareState } from "../Redux/Contracts";
import { getFilteredRelatedWits, getRelatedWitsError, getRelatedWitsFilterData, getRelatedWitsStatus, isPanelOpen } from "../Redux/Selectors";
import { RelatedWorkItemsTable } from "./RelatedWorkItemsTable";
import * as SettingsPanel_Async from "./SettingsPanel";

const Actions = {
    loadRequested: RelatedWorkItemActions.loadRequested,
    applyFilter: RelatedWorkItemActions.applyFilter,
    openPanel: RelatedWorkItemSettingsActions.openPanel,
    closePanel: RelatedWorkItemSettingsActions.closePanel
};

const settingsPanelLoader = async () => import("./SettingsPanel");

function getDropdownItems(key: string, filterData: { [key: string]: { [subkey: string]: number } }) {
    if (!filterData) {
        return [];
    }
    const itemKeys = Object.keys(filterData[key]);
    return itemKeys.map((value) => {
        const keyType = KeyTypes[key];

        if (keyType === "identityRef") {
            const identity = parseUniquefiedIdentityName(value);
            return {
                text: identity!.displayName,
                id: value
            };
        } else if (key === CoreFieldRefNames.AreaPath) {
            return {
                text: value.substr(value.lastIndexOf("\\") + 1),
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

function getDropdownFilterBarItem(
    placeholder: string,
    filterItemKey: string,
    filterData: { [key: string]: { [subkey: string]: number } }
): JSX.Element | null {
    if (!filterData[filterItemKey]) {
        return null;
    }
    return (
        <DropdownFilterBarItem
            key={filterItemKey}
            filterItemKey={filterItemKey}
            selection={new ListSelection(true)}
            items={getDropdownItems(filterItemKey, filterData)}
            placeholder={placeholder}
            noItemsText="No items"
            showFilterBox={true}
            filterPlaceholderText="Search"
        />
    );
}

export function RelatedWits() {
    const workItemId = React.useContext(RelatedWitsContext);
    const filterRef = React.useRef(
        new Filter({
            useApplyMode: false
        })
    );
    const filterToggledRef = React.useRef(new ObservableValue<boolean>(false));
    const onFilterBarDismissClicked = React.useCallback(() => {
        filterToggledRef.current.value = !filterToggledRef.current.value;
    }, []);

    const mapState = React.useCallback(
        (state: IRelatedWitsAwareState) => {
            return {
                workItems: getFilteredRelatedWits(state, workItemId),
                status: getRelatedWitsStatus(state, workItemId),
                error: getRelatedWitsError(state, workItemId),
                filterData: getRelatedWitsFilterData(state, workItemId),
                panelOpen: isPanelOpen(state)
            };
        },
        [workItemId]
    );
    const { workItems, status, error, filterData, panelOpen } = useMappedState(mapState);
    const { loadRequested, openPanel, applyFilter, closePanel } = useActionCreators(Actions);

    const onFilterChange = React.useCallback(() => {
        applyFilter(filterRef.current.getState());
    }, []);

    React.useEffect(() => {
        filterRef.current.subscribe(onFilterChange, FILTER_CHANGE_EVENT);
        return () => {
            filterRef.current.unsubscribe(onFilterChange, FILTER_CHANGE_EVENT);
        };
    }, []);

    const isLoading = status === LoadStatus.NotLoaded || status === LoadStatus.Loading || !workItems;

    return (
        <Page className="related-wits-page flex-column flex-grow">
            {panelOpen && (
                <AsyncComponent loader={settingsPanelLoader} loadingComponent={emptyRenderer}>
                    {(m: typeof SettingsPanel_Async) => <m.SettingsPanel onDismiss={closePanel} />}
                </AsyncComponent>
            )}
            <div className="page-header flex-noshrink">
                <CustomHeader className="related-wits-header">
                    <HeaderTitleArea>
                        <HeaderTitleRow>
                            <HeaderTitle titleSize={TitleSize.Large}>Related work items</HeaderTitle>
                        </HeaderTitleRow>
                    </HeaderTitleArea>
                    <HeaderCommandBarWithFilter
                        filter={filterRef.current}
                        filterToggled={filterToggledRef.current}
                        items={[
                            {
                                id: "refresh",
                                important: true,
                                isPrimary: true,
                                text: "Refresh",
                                disabled: !isNullOrEmpty(error) || isLoading,
                                iconProps: { iconName: "Refresh" },
                                onActivate: () => {
                                    loadRequested(workItemId);
                                }
                            },
                            {
                                id: "settings",
                                important: true,
                                text: "Settings",
                                disabled: !isNullOrEmpty(error) || isLoading,
                                iconProps: { iconName: "Settings" },
                                onActivate: () => {
                                    openPanel();
                                }
                            }
                        ]}
                    />
                </CustomHeader>
                <ConditionalChildren renderChildren={filterToggledRef.current}>
                    <FilterBar filter={filterRef.current} className="related-wits-filter" onDismissClicked={onFilterBarDismissClicked}>
                        <KeywordFilterBarItem filterItemKey={"keyword"} placeholder="Filter by title" />
                        {getDropdownFilterBarItem("Work Item Type", CoreFieldRefNames.WorkItemType, filterData)}
                        {getDropdownFilterBarItem("State", CoreFieldRefNames.State, filterData)}
                        {getDropdownFilterBarItem("Assigned To", CoreFieldRefNames.AssignedTo, filterData)}
                        {getDropdownFilterBarItem("Area path", CoreFieldRefNames.AreaPath, filterData)}
                    </FilterBar>
                </ConditionalChildren>
            </div>
            <Card className="flex-grow bolt-card-no-vertical-padding flex-column related-wits-page-card" contentProps={{ contentPadding: false }}>
                {isLoading && <Loading />}
                {!isLoading && workItems && workItems.length === 0 && (
                    <ZeroData className="flex-grow" imagePath="../images/nodata.png" imageAltText="" primaryText="No results found" />
                )}
                {!isLoading && workItems && workItems.length > 0 && <RelatedWorkItemsTable workItems={workItems} />}
            </Card>
        </Page>
    );
}

import "./Root.scss";

import { Card } from "azure-devops-ui/Card";
import { ConditionalChildren } from "azure-devops-ui/ConditionalChildren";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { FilterBar } from "azure-devops-ui/FilterBar";
import { CustomHeader, HeaderTitle, HeaderTitleArea, HeaderTitleRow, TitleSize } from "azure-devops-ui/Header";
import { HeaderCommandBarWithFilter } from "azure-devops-ui/HeaderCommandBar";
import { Page } from "azure-devops-ui/Page";
import { KeywordFilterBarItem } from "azure-devops-ui/TextFilterBarItem";
import { Filter } from "azure-devops-ui/Utilities/Filter";
import { Loading } from "Common/Components/Loading";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { isNullOrEmpty } from "Common/Utilities/String";
import * as React from "react";
import { RelatedWitsContext } from "../Constants";
import { RelatedWorkItemActions, RelatedWorkItemSettingsActions } from "../Redux/Actions";
import { IRelatedWitsAwareState } from "../Redux/Contracts";
import { getRelatedWits, getRelatedWitsError, getRelatedWitsStatus } from "../Redux/Selectors";
import { RelatedWorkItemsTable } from "./RelatedWorkItemsTable";

const Actions = {
    loadRequested: RelatedWorkItemActions.loadRequested,
    openPanel: RelatedWorkItemSettingsActions.openPanel
};

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
                workItems: getRelatedWits(state, workItemId),
                status: getRelatedWitsStatus(state, workItemId),
                error: getRelatedWitsError(state, workItemId)
            };
        },
        [workItemId]
    );
    const { workItems, status, error } = useMappedState(mapState);
    const { loadRequested, openPanel } = useActionCreators(Actions);

    const isLoading = status === LoadStatus.NotLoaded || status === LoadStatus.Loading || !workItems;

    return (
        <Page className="related-wits-page flex-column flex-grow">
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
                        <KeywordFilterBarItem filterItemKey={"keyword"} />
                    </FilterBar>
                </ConditionalChildren>
            </div>
            <Card className="flex-grow bolt-card-no-vertical-padding flex-column related-wits-page-card" contentProps={{ contentPadding: false }}>
                {isLoading && <Loading />}
                {!isLoading && <RelatedWorkItemsTable workItems={workItems!} />}
            </Card>
        </Page>
    );
}

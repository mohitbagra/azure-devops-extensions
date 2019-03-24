import "./BugBashView.scss";

import { Card } from "azure-devops-ui/Card";
import { ConditionalChildren } from "azure-devops-ui/ConditionalChildren";
import { Page } from "azure-devops-ui/Page";
import { TabContent } from "azure-devops-ui/Tabs";
import { ZeroData, ZeroDataActionType } from "azure-devops-ui/ZeroData";
import * as BugBashItemsBoard_Async from "BugBashPro/Hubs/BugBashView/Pivots/Board";
import * as BugBashItemsCharts_Async from "BugBashPro/Hubs/BugBashView/Pivots/Charts";
import * as BugBashItemsTable_Async from "BugBashPro/Hubs/BugBashView/Pivots/List";
import * as BugBashEditorPortal_Async from "BugBashPro/Portals/BugBashEditorPortal";
import { getBugBashEditorPortalModule } from "BugBashPro/Portals/BugBashEditorPortal/Redux";
import * as BugBashItemEditorPortal_Async from "BugBashPro/Portals/BugBashItemEditorPortal";
import { getBugBashItemEditorPortalModule } from "BugBashPro/Portals/BugBashItemEditorPortal/Redux";
import { AppView } from "BugBashPro/Shared/Constants";
import { navigateToDirectory } from "BugBashPro/Shared/NavHelpers";
import { getBugBashesModule } from "BugBashPro/Shared/Redux/BugBashes";
import { getBugBashItemsModule } from "BugBashPro/Shared/Redux/BugBashItems";
import { AsyncComponent } from "Common/Components/AsyncComponent";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { Loading } from "Common/Components/Loading";
import { emptyRenderer } from "Common/Components/Renderers";
import { LoadStatus } from "Common/Contracts";
import { ErrorMessageBox } from "Common/Notifications/Components/ErrorMessageBox";
import { getKeyValuePairModule } from "Common/Notifications/Redux/Module";
import * as React from "react";
import { BugBashViewPageErrorKey } from "../Constants";
import { useBugBash } from "../Hooks/useBugBash";
import { IBugBashItemProviderParams } from "../Interfaces";
import { getBugBashViewModule } from "../Redux";
import { BugBashItemProvider } from "./BugBashItemsProvider";
import { BugBashViewHeader } from "./BugBashViewHeader";
import { BugBashViewTabsWithFilter } from "./BugBashViewTabsWithFilter";

interface IBugBashViewProps {
    bugBashId: string;
    view: AppView;
}

const bugBashEditorPortalLoader = async () => import("BugBashPro/Portals/BugBashEditorPortal");
const bugBashItemEditorPortalLoader = async () => import("BugBashPro/Portals/BugBashItemEditorPortal");
const chartsViewLoader = async () => import("BugBashPro/Hubs/BugBashView/Pivots/Charts");
const listViewLoader = async () => import("BugBashPro/Hubs/BugBashView/Pivots/List");
const boardViewLoader = async () => import("BugBashPro/Hubs/BugBashView/Pivots/Board");

function BugBashViewInternal(props: IBugBashViewProps): JSX.Element {
    const { bugBashId, view } = props;
    const { bugBash, bugBashStatus } = useBugBash(bugBashId);

    if (bugBashStatus === LoadStatus.LoadFailed) {
        return (
            <ZeroData
                imagePath="../images/servererror.png"
                imageAltText=""
                primaryText="Can not load bug bash"
                secondaryText={`Bug Bash "${bugBashId}" does not exist or it belongs to a different project.`}
                actionText="Go back to directory"
                onActionClick={navigateToDirectory}
                actionType={ZeroDataActionType.ctaButton}
            />
        );
    } else if (!bugBash || bugBashStatus === LoadStatus.Loading) {
        return <Loading />;
    }

    return (
        <Page className="bugbash-page bugbash-view-page flex-column flex-grow">
            <div className="flex-column flex-noshrink">
                <ErrorMessageBox errorKey={BugBashViewPageErrorKey} />
            </div>
            <AsyncComponent loader={bugBashItemEditorPortalLoader} loadingComponent={emptyRenderer}>
                {(m: typeof BugBashItemEditorPortal_Async) => <m.DynamicBugBashItemEditorPortal />}
            </AsyncComponent>
            <AsyncComponent loader={bugBashEditorPortalLoader} loadingComponent={emptyRenderer}>
                {(m: typeof BugBashEditorPortal_Async) => <m.DynamicBugBashEditorPortal />}
            </AsyncComponent>
            <BugBashViewHeader bugBash={bugBash} />
            <BugBashViewTabsWithFilter bugBash={bugBash} view={view} />
            <TabContent>
                <div className="bugbash-page-contents flex-grow flex-column">
                    <Card className="flex-grow bolt-card-no-vertical-padding flex-column bugbash-page-card" contentProps={{ contentPadding: false }}>
                        <BugBashItemProvider bugBash={bugBash}>
                            {(providerParams: IBugBashItemProviderParams) => {
                                const innerViewProps = { ...providerParams, bugBash };
                                return (
                                    <>
                                        <ConditionalChildren renderChildren={view === AppView.ACTION_LIST}>
                                            <AsyncComponent loader={listViewLoader}>
                                                {(m: typeof BugBashItemsTable_Async) => <m.BugBashItemsTable {...innerViewProps} />}
                                            </AsyncComponent>
                                        </ConditionalChildren>
                                        <ConditionalChildren renderChildren={view === AppView.ACTION_BOARD}>
                                            <AsyncComponent loader={boardViewLoader}>
                                                {(m: typeof BugBashItemsBoard_Async) => <m.BugBashItemsBoard {...innerViewProps} />}
                                            </AsyncComponent>
                                        </ConditionalChildren>
                                        <ConditionalChildren renderChildren={view === AppView.ACTION_CHARTS}>
                                            <AsyncComponent loader={chartsViewLoader}>
                                                {(m: typeof BugBashItemsCharts_Async) => <m.BugBashItemsCharts {...innerViewProps} />}
                                            </AsyncComponent>
                                        </ConditionalChildren>
                                    </>
                                );
                            }}
                        </BugBashItemProvider>
                    </Card>
                </div>
            </TabContent>
        </Page>
    );
}

export function BugBashView(props: IBugBashViewProps) {
    return (
        <DynamicModuleLoader
            modules={[
                getBugBashesModule(),
                getBugBashItemsModule(),
                getBugBashViewModule(),
                getBugBashEditorPortalModule(),
                getBugBashItemEditorPortalModule(),
                getKeyValuePairModule()
            ]}
            cleanOnUnmount={true}
        >
            <BugBashViewInternal {...props} />
        </DynamicModuleLoader>
    );
}

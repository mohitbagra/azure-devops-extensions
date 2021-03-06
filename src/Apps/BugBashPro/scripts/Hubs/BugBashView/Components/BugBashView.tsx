import "./BugBashView.scss";

import * as React from "react";

import { Card } from "azure-devops-ui/Card";
import { ConditionalChildren } from "azure-devops-ui/ConditionalChildren";
import { Page } from "azure-devops-ui/Page";
import { TabContent } from "azure-devops-ui/Tabs";
import { ZeroData, ZeroDataActionType } from "azure-devops-ui/ZeroData";
import * as BugBashItemsBoard_Async from "BugBashPro/Hubs/BugBashView/Pivots/Board";
import * as BugBashItemsCharts_Async from "BugBashPro/Hubs/BugBashView/Pivots/Charts";
import * as BugBashItemsTable_Async from "BugBashPro/Hubs/BugBashView/Pivots/List";
import { BugBashPortal } from "BugBashPro/Portals/BugBashPortal";
import { AppView } from "BugBashPro/Shared/Constants";
import { useBugBash } from "BugBashPro/Shared/Hooks/useBugBash";
import { navigateToDirectory } from "BugBashPro/Shared/NavHelpers";
import { getBugBashesModule } from "BugBashPro/Shared/Redux/BugBashes/Module";
import { getBugBashItemsModule } from "BugBashPro/Shared/Redux/BugBashItems/Module";
import { AsyncComponent } from "Common/Components/AsyncComponent";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { Loading } from "Common/Components/Loading";
import { LoadStatus } from "Common/Contracts";
import { ErrorMessageBox } from "Common/Notifications/Components/ErrorMessageBox";
import { getKeyValuePairModule } from "Common/Notifications/Redux/Module";

import { BugBashViewContext, BugBashViewPageErrorKey } from "../Constants";
import { IBugBashItemProviderParams } from "../Interfaces";
import { getBugBashViewModule } from "../Redux/Module";
import { BugBashItemProvider } from "./BugBashItemsProvider";
import { BugBashViewHeader } from "./BugBashViewHeader";
import { BugBashViewTabsWithFilter } from "./BugBashViewTabsWithFilter";

interface IBugBashViewProps {
    bugBashId: string;
    view: AppView;
    bugBashItemId?: string;
}

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
        <BugBashViewContext.Provider value={bugBash}>
            <Page className="bugbash-page bugbash-view-page flex-column flex-grow">
                <div className="flex-column flex-noshrink">
                    <ErrorMessageBox errorKey={BugBashViewPageErrorKey} />
                </div>
                <BugBashPortal />
                <BugBashViewHeader />
                <BugBashViewTabsWithFilter view={view} />
                <TabContent>
                    <div className="bugbash-page-contents flex-grow flex-column">
                        <Card
                            className="flex-grow bolt-card-no-vertical-padding flex-column bugbash-page-card"
                            contentProps={{ contentPadding: false }}
                        >
                            <BugBashItemProvider view={view}>
                                {(providerParams: IBugBashItemProviderParams) => {
                                    return (
                                        <>
                                            <ConditionalChildren renderChildren={view === AppView.ACTION_LIST}>
                                                <AsyncComponent loader={listViewLoader} key="bugbashitemslist">
                                                    {(m: typeof BugBashItemsTable_Async) => <m.BugBashItemsTable {...providerParams} />}
                                                </AsyncComponent>
                                            </ConditionalChildren>
                                            <ConditionalChildren renderChildren={view === AppView.ACTION_BOARD}>
                                                <AsyncComponent loader={boardViewLoader} key="bugbashitemsboard">
                                                    {(m: typeof BugBashItemsBoard_Async) => <m.BugBashItemsBoard {...providerParams} />}
                                                </AsyncComponent>
                                            </ConditionalChildren>
                                            <ConditionalChildren renderChildren={view === AppView.ACTION_CHARTS}>
                                                <AsyncComponent loader={chartsViewLoader} key="bugbashitemschart">
                                                    {(m: typeof BugBashItemsCharts_Async) => <m.BugBashItemsCharts {...providerParams} />}
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
        </BugBashViewContext.Provider>
    );
}

export function BugBashView(props: IBugBashViewProps) {
    return (
        <DynamicModuleLoader
            modules={[
                getBugBashesModule(),
                getBugBashItemsModule(),
                getBugBashViewModule(props.bugBashId, props.bugBashItemId),
                getKeyValuePairModule()
            ]}
            cleanOnUnmount={true}
        >
            <BugBashViewInternal {...props} />
        </DynamicModuleLoader>
    );
}

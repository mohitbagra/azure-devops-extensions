import "./BugBashView.scss";

import * as React from "react";
import { Card } from "azure-devops-ui/Card";
import { ConditionalChildren } from "azure-devops-ui/ConditionalChildren";
import { Page } from "azure-devops-ui/Page";
import { TabContent } from "azure-devops-ui/Tabs";
import { ZeroData, ZeroDataActionType } from "azure-devops-ui/ZeroData";
import * as BugBashEditorPanel_Async from "BugBashPro/BugBashEditor/Components";
import { getBugBashEditorPortalModule } from "BugBashPro/BugBashEditor/Redux/Portal";
import * as BugBashItemEditorPanel_Async from "BugBashPro/BugBashItemEditor/Components";
import { getBugBashItemEditorPortalModule } from "BugBashPro/BugBashItemEditor/Redux/Portal";
import { getBugBashesModule } from "BugBashPro/Redux/BugBashes";
import { getBugBashItemsModule } from "BugBashPro/Redux/BugBashItems";
import { AppView } from "BugBashPro/Shared/Constants";
import { LoadStatus } from "BugBashPro/Shared/Contracts";
import { navigateToDirectory } from "BugBashPro/Shared/NavHelpers";
import { AsyncComponent } from "Common/Components/AsyncComponent";
import { ErrorMessageBox } from "Common/Components/ConnectedNotifications/ErrorMessageBox";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { Loading } from "Common/Components/Loading";
import { emptyRenderer } from "Common/Components/Renderers";
import { getKeyValurPairModule } from "Common/Redux/KeyValuePair";
import { BugBashViewPageErrorKey } from "../Constants";
import { useBugBash } from "../Hooks/useBugBash";
import { getBugBashViewModule } from "../Redux";
import * as BugBashCharts_Async from "./BugBashCharts";
import * as BugBashItemsTable_Async from "./BugBashItemsTable";
import { BugBashViewHeader } from "./BugBashViewHeader";
import { BugBashViewTabsWithFilter } from "./BugBashViewTabsWithFilter";

interface IBugBashViewProps {
    bugBashId: string;
    view: AppView;
}

const bugBashEditorPanelLoader = async () => import("BugBashPro/BugBashEditor/Components");
const bugBashItemEditorPanelLoader = async () => import("BugBashPro/BugBashItemEditor/Components");
const chartsViewLoader = async () => import("./BugBashCharts");
const listViewLoader = async () => import("./BugBashItemsTable");

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
            <AsyncComponent loader={bugBashItemEditorPanelLoader} loadingComponent={emptyRenderer}>
                {(m: typeof BugBashItemEditorPanel_Async) => <m.DynamicBugBashItemEditorPortal />}
            </AsyncComponent>
            <AsyncComponent loader={bugBashEditorPanelLoader} loadingComponent={emptyRenderer}>
                {(m: typeof BugBashEditorPanel_Async) => <m.DynamicBugBashEditorPortal />}
            </AsyncComponent>
            <BugBashViewHeader bugBash={bugBash} />
            <BugBashViewTabsWithFilter bugBash={bugBash} view={view} />
            <TabContent>
                <div className="bugbash-page-contents flex-grow flex-column">
                    <Card className="flex-grow bolt-card-no-vertical-padding flex-column bugbash-page-card" contentProps={{ contentPadding: false }}>
                        <ConditionalChildren renderChildren={view === AppView.ACTION_LIST}>
                            <AsyncComponent loader={listViewLoader}>
                                {(m: typeof BugBashItemsTable_Async) => <m.BugBashItemsTable bugBash={bugBash} />}
                            </AsyncComponent>
                        </ConditionalChildren>
                        <ConditionalChildren renderChildren={view === AppView.ACTION_CHARTS}>
                            <AsyncComponent loader={chartsViewLoader}>
                                {(m: typeof BugBashCharts_Async) => <m.BugBashCharts bugBashId={bugBashId} />}
                            </AsyncComponent>
                        </ConditionalChildren>
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
                getKeyValurPairModule()
            ]}
            cleanOnUnmount={true}
        >
            <BugBashViewInternal {...props} />
        </DynamicModuleLoader>
    );
}

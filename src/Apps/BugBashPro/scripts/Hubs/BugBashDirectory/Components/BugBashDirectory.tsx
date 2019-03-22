import { Card } from "azure-devops-ui/Card";
import { Page } from "azure-devops-ui/Page";
import { TabContent } from "azure-devops-ui/Tabs";
import * as BugBashEditorPanel_Async from "BugBashPro/Editors/BugBashEditor";
import { getBugBashEditorPortalModule } from "BugBashPro/Editors/BugBashEditor/Redux/Portal";
import * as SettingsEditorPanel_Async from "BugBashPro/Editors/BugBashSettingsEditor/Components";
import { getBugBashSettingsPortalModule } from "BugBashPro/Editors/BugBashSettingsEditor/Redux/Portal";
import { getBugBashesModule } from "BugBashPro/Shared/Redux/BugBashes";
import { AsyncComponent } from "Common/Components/AsyncComponent";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { emptyRenderer } from "Common/Components/Renderers";
import { ErrorMessageBox } from "Common/Notifications/Components/ErrorMessageBox";
import { getKeyValuePairModule } from "Common/Notifications/Redux";
import * as React from "react";
import { DirectoryPageErrorKey } from "../Constants";
import { getBugBashDirectoryModule } from "../Redux";
import { BugBashDirectoryHeader } from "./BugBashDirectoryHeader";
import { BugBashDirectoryTable } from "./BugBashDirectoryTable";
import { BugBashDirectoryTabs } from "./BugBashDirectoryTabs";

const bugBashEditorPanelLoader = async () => import("BugBashPro/Editors/BugBashEditor");
const settingsEditorPanelLoader = async () => import("BugBashPro/Editors/BugBashSettingsEditor/Components");

function BugBashDirectoryInternal(): JSX.Element {
    return (
        <Page className="bugbash-page flex-column flex-grow">
            <div className="flex-column flex-noshrink">
                <ErrorMessageBox errorKey={DirectoryPageErrorKey} />
            </div>
            <AsyncComponent loader={bugBashEditorPanelLoader} loadingComponent={emptyRenderer}>
                {(m: typeof BugBashEditorPanel_Async) => <m.DynamicBugBashEditorPortal />}
            </AsyncComponent>
            <AsyncComponent loader={settingsEditorPanelLoader} loadingComponent={emptyRenderer}>
                {(m: typeof SettingsEditorPanel_Async) => <m.DynamicSettingsPortal />}
            </AsyncComponent>
            <BugBashDirectoryHeader />
            <BugBashDirectoryTabs />
            <TabContent>
                <div className="bugbash-page-contents flex-grow flex-column">
                    <Card className="flex-grow bolt-card-no-vertical-padding flex-column bugbash-page-card" contentProps={{ contentPadding: false }}>
                        <BugBashDirectoryTable />
                    </Card>
                </div>
            </TabContent>
        </Page>
    );
}

export function BugBashDirectory() {
    return (
        <DynamicModuleLoader
            modules={[
                getBugBashesModule(),
                getBugBashDirectoryModule(),
                getBugBashEditorPortalModule(),
                getBugBashSettingsPortalModule(),
                getKeyValuePairModule()
            ]}
            cleanOnUnmount={true}
        >
            <BugBashDirectoryInternal />
        </DynamicModuleLoader>
    );
}

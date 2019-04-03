import { Card } from "azure-devops-ui/Card";
import { Page } from "azure-devops-ui/Page";
import { TabContent } from "azure-devops-ui/Tabs";
import * as BugBashEditorPortal_Async from "BugBashPro/Portals/BugBashEditorPortal";
import { getBugBashEditorPortalModule } from "BugBashPro/Portals/BugBashEditorPortal/Redux";
import * as SettingsEditorPortal_Async from "BugBashPro/Portals/BugBashSettingsEditorPortal";
import { getBugBashSettingsPortalModule } from "BugBashPro/Portals/BugBashSettingsEditorPortal/Redux";
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

const bugBashEditorPortalLoader = async () => import("BugBashPro/Portals/BugBashEditorPortal");
const settingsEditorPortalLoader = async () => import("BugBashPro/Portals/BugBashSettingsEditorPortal");

function BugBashDirectoryInternal(): JSX.Element {
    return (
        <Page className="bugbash-page flex-column flex-grow">
            <div className="flex-column flex-noshrink">
                <ErrorMessageBox errorKey={DirectoryPageErrorKey} />
            </div>
            <AsyncComponent loader={bugBashEditorPortalLoader} loadingComponent={emptyRenderer}>
                {(m: typeof BugBashEditorPortal_Async) => <m.BugBashEditorPortal />}
            </AsyncComponent>
            <AsyncComponent loader={settingsEditorPortalLoader} loadingComponent={emptyRenderer}>
                {(m: typeof SettingsEditorPortal_Async) => <m.SettingsPortal />}
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

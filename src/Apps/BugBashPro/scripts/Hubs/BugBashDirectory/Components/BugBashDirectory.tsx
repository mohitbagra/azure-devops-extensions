import * as React from "react";

import { Card } from "azure-devops-ui/Card";
import { Page } from "azure-devops-ui/Page";
import { TabContent } from "azure-devops-ui/Tabs";
import { BugBashPortal } from "BugBashPro/Portals/BugBashPortal";
import { getBugBashesModule } from "BugBashPro/Shared/Redux/BugBashes/Module";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { ErrorMessageBox } from "Common/Notifications/Components/ErrorMessageBox";
import { getKeyValuePairModule } from "Common/Notifications/Redux/Module";

import { DirectoryPageErrorKey } from "../Constants";
import { getBugBashDirectoryModule } from "../Redux/Module";
import { BugBashDirectoryHeader } from "./BugBashDirectoryHeader";
import { BugBashDirectoryTable } from "./BugBashDirectoryTable";
import { BugBashDirectoryTabs } from "./BugBashDirectoryTabs";

function BugBashDirectoryInternal(): JSX.Element {
    return (
        <Page className="bugbash-page flex-column flex-grow">
            <div className="flex-column flex-noshrink">
                <ErrorMessageBox errorKey={DirectoryPageErrorKey} />
            </div>

            <BugBashPortal />
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
        <DynamicModuleLoader modules={[getBugBashesModule(), getBugBashDirectoryModule(), getKeyValuePairModule()]} cleanOnUnmount={true}>
            <BugBashDirectoryInternal />
        </DynamicModuleLoader>
    );
}

import "./Root.scss";

import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { Page } from "azure-devops-ui/Page";
import { WorkItemFormListener } from "Common/AzDev/WorkItemForm/Components/WorkItemFormListener";
import { useAutoResize } from "Common/AzDev/WorkItemForm/Hooks/useAutoResize";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import * as React from "react";
import { RelatedWitsContext } from "../Constants";
import { getRelatedWitsModule } from "../Redux/Module";

function RelatedWitsInternal() {
    useAutoResize();

    return (
        <WorkItemFormListener>
            {(activeWorkItemId: number, isNew: boolean) => (
                <Page className="related-wits-page">
                    {isNew && (
                        <MessageCard className="related-wits-message" severity={MessageCardSeverity.Info}>
                            Please save the work item to see related work items.
                        </MessageCard>
                    )}
                    {!isNew && (
                        <RelatedWitsContext.Provider value={activeWorkItemId}>
                            <div className="page-container">Loaded</div>
                        </RelatedWitsContext.Provider>
                    )}
                </Page>
            )}
        </WorkItemFormListener>
    );
}

export function RelatedWits() {
    return (
        <DynamicModuleLoader modules={[getRelatedWitsModule()]} cleanOnUnmount={true}>
            <RelatedWitsInternal />
        </DynamicModuleLoader>
    );
}

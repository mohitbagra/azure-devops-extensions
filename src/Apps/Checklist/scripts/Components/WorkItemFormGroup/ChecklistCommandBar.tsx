import { HeaderCommandBar } from "azure-devops-ui/HeaderCommandBar";
import { WorkItemChecklistContext } from "Checklist/Constants";
import { useWorkItemChecklist } from "Checklist/Hooks/useWorkItemChecklist";
import { WorkItemChecklistActions } from "Checklist/Redux/WorkItemChecklist/Actions";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { getMarketplaceUrl } from "Common/Utilities/UrlHelper";
import * as React from "react";

const Actions = {
    loadWorkItemChecklist: WorkItemChecklistActions.workItemChecklistLoadRequested
};

export function ChecklistCommandBar() {
    const workItemId = React.useContext(WorkItemChecklistContext);
    const { status } = useWorkItemChecklist(workItemId);
    const { loadWorkItemChecklist } = useActionCreators(Actions);

    const onRefresh = React.useCallback(() => {
        loadWorkItemChecklist(workItemId);
    }, [workItemId]);

    return (
        <HeaderCommandBar
            className="checklist-commandbar"
            items={[
                {
                    subtle: true,
                    className: "checklist-command-item",
                    id: "info",
                    href: getMarketplaceUrl(),
                    target: "_blank",
                    tooltipProps: { text: "How to use the extension" },
                    iconProps: {
                        iconName: "InfoSolid"
                    }
                },
                {
                    subtle: true,
                    className: "checklist-command-item",
                    id: "refresh",
                    onActivate: onRefresh,
                    tooltipProps: { text: "Refresh" },
                    disabled: status === LoadStatus.Loading || status === LoadStatus.NotLoaded || status === LoadStatus.Updating,
                    iconProps: {
                        iconName: "Refresh"
                    }
                },
                {
                    subtle: true,
                    className: "checklist-command-item",
                    id: "settings",
                    target: "_blank",
                    href: "",
                    tooltipProps: { text: "Configure default checklist" },
                    iconProps: {
                        iconName: "Settings"
                    }
                }
            ]}
        />
    );
}

import { HeaderCommandBar } from "azure-devops-ui/HeaderCommandBar";
import { ChecklistContext } from "Checklist/Constants";
import { useChecklist } from "Checklist/Hooks/useChecklist";
import { ChecklistType } from "Checklist/Interfaces";
import { ChecklistActions } from "Checklist/Redux/Actions";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { getMarketplaceUrl } from "Common/Utilities/UrlHelper";
import * as React from "react";

const Actions = {
    loadChecklist: ChecklistActions.checklistLoadRequested
};

export function ChecklistCommandBar() {
    const idOrType = React.useContext(ChecklistContext);
    const { status } = useChecklist(idOrType, ChecklistType.Personal, false);
    const { loadChecklist } = useActionCreators(Actions);

    const onRefresh = React.useCallback(() => {
        loadChecklist(idOrType);
    }, [idOrType]);

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

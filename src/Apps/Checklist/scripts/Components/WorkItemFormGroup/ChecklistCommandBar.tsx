import { HeaderCommandBar } from "azure-devops-ui/HeaderCommandBar";
import { getMarketplaceUrl } from "Common/Utilities/UrlHelper";
import * as React from "react";

export function ChecklistCommandBar() {
    return (
        <HeaderCommandBar
            className="checklist-commandbar"
            items={[
                {
                    subtle: true,
                    className: "checklist-command-item",
                    id: "info",
                    href: getMarketplaceUrl(),
                    iconProps: {
                        iconName: "InfoSolid"
                    }
                },
                {
                    subtle: true,
                    className: "checklist-command-item",
                    id: "refresh",
                    iconProps: {
                        iconName: "Refresh"
                    }
                },
                {
                    subtle: true,
                    className: "checklist-command-item",
                    id: "settings",
                    iconProps: {
                        iconName: "Settings"
                    }
                }
            ]}
        />
    );
}

import { getExtensionContext } from "azure-devops-extension-sdk";
import { HeaderCommandBar } from "azure-devops-ui/HeaderCommandBar";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { openNewWindow } from "Common/ServiceWrappers/HostNavigationService";
import { getContributionHubUrlAsync } from "Common/Utilities/UrlHelper";
import * as React from "react";
import { ChecklistContext } from "../../Constants";
import { useChecklistSettings } from "../../Hooks/useChecklistSettings";
import { useChecklistStatus } from "../../Hooks/useChecklistStatus";
import { ChecklistActions } from "../../Redux/Checklist/Actions";
import { ChecklistSettingsActions } from "../../Redux/Settings/Actions";

const Actions = {
    loadChecklist: ChecklistActions.checklistLoadRequested,
    toggleWordWrap: ChecklistSettingsActions.toggleWordWrap,
    toggleHideCompletedItems: ChecklistSettingsActions.toggleHideCompletedItems
};

export function ChecklistCommandBar() {
    const idOrType = React.useContext(ChecklistContext);
    const status = useChecklistStatus(idOrType);
    const { loadChecklist, toggleWordWrap, toggleHideCompletedItems } = useActionCreators(Actions);
    const { wordWrap, hideCompletedItems } = useChecklistSettings();

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
                    disabled: status === LoadStatus.Loading || status === LoadStatus.NotLoaded || status === LoadStatus.Updating,
                    iconProps: {
                        iconName: "Equalizer"
                    },
                    subMenuProps: {
                        id: "settings-submenu",
                        items: [
                            {
                                id: "open-settings-page",
                                text: "Configure",
                                iconProps: { iconName: "Settings" },
                                onActivate: () => {
                                    const { publisherId, extensionId } = getExtensionContext();
                                    const contributionId = `${publisherId}.${extensionId}.settings-hub`;
                                    getContributionHubUrlAsync(contributionId).then(url => openNewWindow(url));
                                }
                            },
                            {
                                id: "word-wrap",
                                text: "Word Wrap",
                                iconProps: wordWrap ? { iconName: "CheckMark" } : undefined,
                                onActivate: () => {
                                    toggleWordWrap();
                                }
                            },
                            {
                                id: "hide-completed",
                                text: "Hide completed items",
                                iconProps: hideCompletedItems ? { iconName: "CheckMark" } : undefined,
                                onActivate: () => {
                                    toggleHideCompletedItems();
                                }
                            }
                        ]
                    }
                }
            ]}
        />
    );
}

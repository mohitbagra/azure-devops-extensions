import { IHeaderCommandBarItem } from "azure-devops-ui/Components/HeaderCommandBar/HeaderCommandBar.Props";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { AsyncComponent } from "Common/Components/AsyncComponent";
import { emptyRenderer } from "Common/Components/Renderers";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import * as React from "react";
import { ChecklistContext } from "../../Constants";
import { useChecklistStatus } from "../../Hooks/useChecklistStatus";
import { ChecklistActions } from "../../Redux/Checklist/Actions";
import * as SecurityPanel_Async from "./SecurityPanel";

const securityPanelLoader = async () => import("./SecurityPanel");

const Actions = {
    loadChecklist: ChecklistActions.checklistLoadRequested
};

interface IChecklistSettingsHeaderProps {
    securityEnabled: boolean;
}

export function ChecklistSettingsHeader(props: IChecklistSettingsHeaderProps) {
    const { securityEnabled } = props;

    const selectedWorkItemType = React.useContext(ChecklistContext) as string;
    const status = useChecklistStatus(selectedWorkItemType);
    const { loadChecklist } = useActionCreators(Actions);
    const [panelOpen, setPanelOpen] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        loadChecklist(selectedWorkItemType);
    }, [selectedWorkItemType]);

    const closePanel = React.useCallback(() => {
        setPanelOpen(false);
    }, []);

    const openPanel = React.useCallback(() => {
        setPanelOpen(true);
    }, []);

    const commandBarItems = React.useMemo(() => {
        const items: IHeaderCommandBarItem[] = [
            {
                important: true,
                isPrimary: true,
                id: "refresh",
                text: "Refresh",
                iconProps: {
                    iconName: "Refresh"
                },
                onActivate: onRefresh,
                disabled: status === LoadStatus.Loading || status === LoadStatus.NotLoaded || status === LoadStatus.Updating
            }
        ];

        if (securityEnabled) {
            items.push({
                important: true,
                id: "security",
                text: "Security",
                iconProps: {
                    iconName: "Permissions"
                },
                onActivate: openPanel,
                disabled: status === LoadStatus.Loading || status === LoadStatus.NotLoaded || status === LoadStatus.Updating
            });
        }
        return items;
    }, [securityEnabled, status, onRefresh, openPanel]);

    return (
        <>
            {panelOpen && (
                <AsyncComponent loader={securityPanelLoader} loadingComponent={emptyRenderer}>
                    {(m: typeof SecurityPanel_Async) => <m.SecurityPanel onDismiss={closePanel} />}
                </AsyncComponent>
            )}
            <Header
                className="checklist-settings-header"
                title={`Default checklist items for "${selectedWorkItemType}"`}
                commandBarItems={commandBarItems}
                titleSize={TitleSize.Large}
            />
        </>
    );
}

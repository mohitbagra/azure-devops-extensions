import { Header, TitleSize } from "azure-devops-ui/Header";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import * as React from "react";
import { ChecklistContext } from "../../Constants";
import { useChecklistStatus } from "../../Hooks/useChecklistStatus";
import { ChecklistActions } from "../../Redux/Actions";

const Actions = {
    loadChecklist: ChecklistActions.checklistLoadRequested
};

export function ChecklistSettingsHeader() {
    const selectedWorkItemType = React.useContext(ChecklistContext) as string;
    const status = useChecklistStatus(selectedWorkItemType);
    const { loadChecklist } = useActionCreators(Actions);

    const onRefresh = React.useCallback(() => {
        loadChecklist(selectedWorkItemType);
    }, [selectedWorkItemType]);

    return (
        <Header
            className="checklist-settings-header"
            title={`Default checklist items for "${selectedWorkItemType}"`}
            commandBarItems={[
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
            ]}
            titleSize={TitleSize.Large}
        />
    );
}

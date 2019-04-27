import { Header, TitleSize } from "azure-devops-ui/Header";
import { ChecklistContext } from "Checklist/Constants";
import { useChecklist } from "Checklist/Hooks/useChecklist";
import { ChecklistType } from "Checklist/Interfaces";
import { ChecklistActions } from "Checklist/Redux/Actions";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import * as React from "react";

const Actions = {
    loadChecklist: ChecklistActions.checklistLoadRequested
};

export function ChecklistSettingsHeader() {
    const selectedWorkItemType = React.useContext(ChecklistContext) as string;
    const { status } = useChecklist(selectedWorkItemType, ChecklistType.WitDefault, false);
    const { loadChecklist } = useActionCreators(Actions);

    const onRefresh = React.useCallback(() => {
        loadChecklist(selectedWorkItemType);
    }, [selectedWorkItemType]);

    return (
        <Header
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

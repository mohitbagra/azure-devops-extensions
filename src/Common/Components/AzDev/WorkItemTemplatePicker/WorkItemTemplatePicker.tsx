import { WorkItemTemplateReference } from "azure-devops-extension-api/WorkItemTracking";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import {
    IPicklistPickerSharedProps, picklistRenderer
} from "Common/Components/Pickers/PicklistPicker";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import {
    getTeamTemplates, getWorkItemTemplateModule, ITeamTemplates, IWorkItemTemplateAwareState,
    TeamTemplatesActions
} from "Common/Redux/WorkItemTemplates";
import * as React from "react";

interface IWorkItemTemplatePickerOwnProps extends IPicklistPickerSharedProps<WorkItemTemplateReference> {
    teamId?: string;
    workItemType?: string;
}

interface IWorkItemTemplatePickerStateProps {
    teamTemplates?: ITeamTemplates;
}

const Actions = {
    loadTeamWorkItemTemplates: TeamTemplatesActions.loadRequested
};

function WorkItemTemplatePickerInternal(props: IWorkItemTemplatePickerOwnProps) {
    const { teamId, placeholder } = props;
    const mapStateToProps = React.useCallback(
        (state: IWorkItemTemplateAwareState): IWorkItemTemplatePickerStateProps => {
            return {
                teamTemplates: teamId ? getTeamTemplates(state, teamId) : undefined
            };
        },
        [teamId]
    );
    const { teamTemplates } = useMappedState(mapStateToProps);
    const { loadTeamWorkItemTemplates } = useActionCreators(Actions);

    React.useEffect(() => {
        if (teamId && !teamTemplates) {
            loadTeamWorkItemTemplates(teamId);
        }
    }, [teamId]);

    const loading = !teamTemplates || teamTemplates.loading;
    const templates = loading ? undefined : teamTemplates && teamTemplates.templates;

    return picklistRenderer({ ...props, placeholder: placeholder || "Select a template" }, templates, (template: WorkItemTemplateReference) => ({
        key: template.id,
        name: template.name
    }));
}

export function WorkItemTemplatePicker(props: IWorkItemTemplatePickerOwnProps) {
    return (
        <DynamicModuleLoader modules={[getWorkItemTemplateModule()]}>
            <WorkItemTemplatePickerInternal {...props} />
        </DynamicModuleLoader>
    );
}

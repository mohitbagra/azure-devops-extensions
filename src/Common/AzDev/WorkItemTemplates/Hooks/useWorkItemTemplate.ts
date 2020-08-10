import { useCallback, useEffect } from "react";

import { WorkItemTemplate } from "azure-devops-extension-api/WorkItemTracking/WorkItemTracking";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";

import { WorkItemTemplateActions } from "../Redux/Actions";
import { IWorkItemTemplateAwareState } from "../Redux/Contracts";
import { getTemplate, getTemplateError, getTemplateStatus } from "../Redux/Selectors";

interface IUseWorkItemTemplateMappedState {
    status: LoadStatus;
    error: string | undefined;
    template: WorkItemTemplate | undefined;
}

const Actions = {
    loadTemplate: WorkItemTemplateActions.loadRequested
};

export function useWorkItemTemplate(teamId: string, templateId: string): IUseWorkItemTemplateMappedState {
    const mapState = useCallback(
        (state: IWorkItemTemplateAwareState) => {
            return {
                template: getTemplate(state, templateId),
                status: getTemplateStatus(state, templateId),
                error: getTemplateError(state, templateId)
            };
        },
        [templateId]
    );

    const { template, status, error } = useMappedState(mapState);
    const { loadTemplate } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadTemplate(teamId, templateId);
        }
    }, [teamId, templateId]);

    return { template, status, error };
}

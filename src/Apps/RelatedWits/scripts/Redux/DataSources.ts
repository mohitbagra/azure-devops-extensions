import { getClient } from "azure-devops-extension-api/Common/Client";
import { WorkItem, WorkItemErrorPolicy, WorkItemTrackingRestClient } from "azure-devops-extension-api/WorkItemTracking";
import { readSetting, writeSetting } from "Common/ServiceWrappers/ExtensionDataManager";
import { hashCode } from "Common/Utilities/String";
import { getCurrentProjectId } from "Common/Utilities/WebContext";
import { DEFAULT_FIELDS_TO_RETRIEVE, DEFAULT_FIELDS_TO_SEEK, DEFAULT_RESULT_SIZE, DEFAULT_SETTINGS, DEFAULT_SORT_BY_FIELD } from "../Constants";
import { ISettings } from "../Interfaces";

export async function fetchWorkItems(project: string, wiql: string, top: number): Promise<WorkItem[]> {
    const witClient = await getClient(WorkItemTrackingRestClient);
    const queryResult = await witClient.queryByWiql({ query: wiql }, project, undefined, false, top);
    const projectId = await getCurrentProjectId();
    if (queryResult.workItems && queryResult.workItems.length > 0) {
        return witClient.getWorkItems(
            queryResult.workItems.map(w => w.id),
            projectId,
            DEFAULT_FIELDS_TO_RETRIEVE,
            undefined,
            undefined,
            WorkItemErrorPolicy.Omit
        );
    } else {
        return [];
    }
}

export async function fetchSettings(project: string, workItemTypeName: string): Promise<ISettings> {
    const key = `${project}_${workItemTypeName}`.toLowerCase();
    const suffix = hashCode(key).toString();
    const storageKey = `rwf_${suffix}`;
    let settings = await readSetting<ISettings>(storageKey, DEFAULT_SETTINGS, true);
    if (!settings) {
        settings = DEFAULT_SETTINGS;
    }
    if (settings.top == null || settings.top <= 0) {
        settings.top = DEFAULT_RESULT_SIZE;
    }
    if (settings.sortByField == null) {
        settings.sortByField = DEFAULT_SORT_BY_FIELD;
    }
    if (settings.fields == null) {
        settings.fields = DEFAULT_FIELDS_TO_SEEK;
    }

    return settings;
}

export async function saveSettings(project: string, workItemTypeName: string, settings: ISettings): Promise<ISettings> {
    const key = `${project}_${workItemTypeName}`.toLowerCase();
    const suffix = hashCode(key).toString();
    const storageKey = `rwf_${suffix}`;
    return writeSetting<ISettings>(storageKey, settings, true);
}

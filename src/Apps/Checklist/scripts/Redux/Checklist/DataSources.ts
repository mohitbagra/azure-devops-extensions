import { addOrUpdateDocument, readDocument } from "Common/ServiceWrappers/ExtensionDataManager";
import { memoizePromise } from "Common/Utilities/Memoize";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import { getCurrentProjectId } from "Common/Utilities/WebContext";

import { ChecklistItemState, ChecklistType, IChecklist } from "../../Interfaces";

export const fetchWorkItemChecklistAsync = memoizePromise(
    async (workItemId: number, personal: boolean): Promise<IChecklist> => {
        const key = workItemId.toString();
        const checklist = await readDocument<IChecklist>("CheckListItems", key, { id: key, checklistItems: [] }, personal);
        preprocessChecklist(checklist);
        return checklist as IChecklist;
    },
    (workItemId: number, personal: boolean) => `fetchWorkItemChecklistAsync_${workItemId}_${personal ? 1 : 0}`
);

export const fetchWorkItemDefaultChecklist = memoizePromise(
    async (workItemId: number): Promise<IChecklist> => {
        const key = workItemId.toString();
        const checklist = await readDocument<IChecklist>("DefaultCheckList", key, { id: key, checklistItems: [] }, false);
        preprocessChecklist(checklist);
        return checklist as IChecklist;
    },
    (workItemId: number) => `fetchWorkItemDefaultChecklist_${workItemId}`
);

export const fetchWorkItemTypeChecklistAsync = memoizePromise(
    async (workItemType: string, projectId?: string): Promise<IChecklist> => {
        let resolvedProjectId = projectId;
        if (!resolvedProjectId) {
            resolvedProjectId = await getCurrentProjectId();
        }
        const checklist = await readDocument<IChecklist>(`dcwit_${resolvedProjectId}`, workItemType, { id: workItemType, checklistItems: [] }, false);
        preprocessChecklist(checklist);
        return checklist as IChecklist;
    },
    (workItemType: string, projectId?: string) => `fetchWorkItemTypeChecklistAsync_${workItemType}_${projectId || ""}`
);

export const updateChecklistAsync = memoizePromise(
    async (checklist: IChecklist, checklistType: ChecklistType, isWorkItemTypeChecklist: boolean) => {
        let collectionKey: string;
        let currentProjectId: string;
        if (checklistType === ChecklistType.WitDefault) {
            currentProjectId = await getCurrentProjectId();
            collectionKey = isWorkItemTypeChecklist ? `dcwit_${currentProjectId}` : "DefaultCheckList";
        } else {
            collectionKey = "CheckListItems";
        }

        try {
            const updatedChecklist = await addOrUpdateDocument<IChecklist>(collectionKey, checklist, checklistType === ChecklistType.Personal);
            preprocessChecklist(updatedChecklist);
            return updatedChecklist;
        } catch (e) {
            throw new Error(
                "The checklist has been modified by someone else. Please refresh refresh the checklist to get the latest Checklist data."
            );
        }
    },
    (checklist: IChecklist) => `updateChecklistAsync_${checklist.id}`
);

function preprocessChecklist(checklist: IChecklist | undefined) {
    if (checklist && checklist.checklistItems) {
        for (const checklistItem of checklist.checklistItems) {
            if (isNullOrWhiteSpace(checklistItem.state)) {
                if ((checklistItem as any)["checked"]) {
                    checklistItem.state = ChecklistItemState.Completed;
                } else {
                    checklistItem.state = ChecklistItemState.New;
                }
            }
        }
    }
}

import { ChecklistItemState, IWorkItemChecklist } from "Checklist/Interfaces";
import { addOrUpdateDocument, readDocument } from "Common/ServiceWrappers/ExtensionDataManager";
import { memoizePromise } from "Common/Utilities/Memoize";
import { isNullOrWhiteSpace } from "Common/Utilities/String";

export const fetchWorkItemChecklistAsync = memoizePromise(
    async (workItemId: number) => {
        const key = `${workItemId}`;
        const checklist = (await readDocument<IWorkItemChecklist>(
            "CheckListItems",
            key,
            { id: key, checklistItems: [] },
            false
        )) as IWorkItemChecklist;
        preprocessChecklist(checklist);

        return checklist;
    },
    (workItemId: number) => `fetchWorkItemChecklistAsync_${workItemId}`
);

export const updateWorkItemChecklistAsync = memoizePromise(
    async (checklist: IWorkItemChecklist) => {
        try {
            const updatedChecklist = await addOrUpdateDocument<IWorkItemChecklist>("CheckListItems", checklist, false);
            preprocessChecklist(updatedChecklist);
            return updatedChecklist;
        } catch (e) {
            throw new Error(
                "The current version of checklist doesn't match the version of checklist in this workitem. Please refresh the workitem or the checklist to get the latest Checklist data."
            );
        }
    },
    (checklist: IWorkItemChecklist) => `updateWorkItemChecklistAsync_${checklist.id}`
);

function preprocessChecklist(checklist: IWorkItemChecklist) {
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

import { LoadStatus } from "Common/Contracts";
import { produce } from "immer";
import { ChecklistType, IChecklist } from "../Interfaces";
import { ChecklistActions, ChecklistActionTypes } from "./Actions";
import { IChecklistState } from "./Contracts";

const defaultState: IChecklistState = {
    checklistsMap: {}
};

export function checklistReducer(state: IChecklistState | undefined, action: ChecklistActions): IChecklistState {
    return produce(state || defaultState, draft => {
        switch (action.type) {
            case ChecklistActionTypes.BeginLoadChecklist: {
                const idOrType = action.payload;
                const mapKey = idOrType.toString().toLowerCase();

                if (draft.checklistsMap[mapKey]) {
                    draft.checklistsMap[mapKey].status = LoadStatus.Loading;
                } else {
                    draft.checklistsMap[mapKey] = {
                        status: LoadStatus.Loading,
                        personalChecklist: undefined,
                        sharedChecklist: undefined,
                        witDefaultChecklist: undefined
                    };
                }

                break;
            }

            case ChecklistActionTypes.ChecklistLoaded: {
                const { idOrType, groupedChecklists } = action.payload;
                const { personalChecklist, sharedChecklist, witDefaultChecklist } = groupedChecklists;
                const mapKey = idOrType.toString().toLowerCase();

                draft.checklistsMap[mapKey] = {
                    status: LoadStatus.Ready,
                    personalChecklist,
                    sharedChecklist,
                    witDefaultChecklist
                };
                break;
            }

            case ChecklistActionTypes.BeginUpdateChecklist: {
                const { idOrType, unsavedChecklist, checklistType } = action.payload;
                updateChecklist(draft, idOrType, unsavedChecklist, checklistType, LoadStatus.Updating);
                break;
            }

            case ChecklistActionTypes.ChecklistUpdated: {
                const { idOrType, checklist, checklistType } = action.payload;
                updateChecklist(draft, idOrType, checklist, checklistType, LoadStatus.Ready);
                break;
            }

            case ChecklistActionTypes.ChecklistUpdateFailed: {
                const { idOrType, error } = action.payload;
                const mapKey = idOrType.toString().toLowerCase();

                if (draft.checklistsMap[mapKey]) {
                    draft.checklistsMap[mapKey].status = LoadStatus.UpdateFailed;
                    draft.checklistsMap[mapKey].error = error;
                }

                break;
            }
        }
    });
}

function updateChecklist(draft: IChecklistState, idOrType: number | string, checklist: IChecklist, checklistType: ChecklistType, status: LoadStatus) {
    const mapKey = idOrType.toString().toLowerCase();

    if (draft.checklistsMap[mapKey]) {
        draft.checklistsMap[mapKey].status = status;
        draft.checklistsMap[mapKey].error = undefined;

        switch (checklistType) {
            case ChecklistType.Personal: {
                draft.checklistsMap[mapKey].personalChecklist = checklist;
                break;
            }
            case ChecklistType.Shared: {
                draft.checklistsMap[mapKey].sharedChecklist = checklist;
                break;
            }
            case ChecklistType.WitDefault: {
                draft.checklistsMap[mapKey].witDefaultChecklist = checklist;
                break;
            }
        }
    }
}

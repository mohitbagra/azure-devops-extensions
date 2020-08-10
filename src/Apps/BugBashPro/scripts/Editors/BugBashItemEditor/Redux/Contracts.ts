import { IBugBashItem } from "BugBashPro/Shared/Contracts";
import { IChangeableValue } from "Common/Contracts";

export interface IBugBashItemEditorAwareState {
    bugBashItemEditorState: IBugBashItemEditorState;
}

export interface IBugBashItemEditorState {
    draftBugBashItemsMap: { [bugBashItemId: string]: IDraftBugBashItem };
}

export interface IDraftBugBashItem extends IChangeableValue<IBugBashItem | undefined> {
    newComment?: string;
    isSaving?: boolean;
    initializeError?: string;
}

export const defaultBugBashItemEditorState: IBugBashItemEditorState = {
    draftBugBashItemsMap: {}
};

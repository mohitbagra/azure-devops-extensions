import { IBugBash } from "BugBashPro/Shared/Contracts";
import { IChangeableValue } from "Common/Contracts";

export interface IBugBashEditorAwareState {
    bugBashEditorState: IBugBashEditorState;
}

export interface IBugBashEditorState {
    draftBugBashMap: { [bugBashId: string]: IDraftBugBash };
}

export interface IDraftBugBash extends IChangeableValue<IBugBash | undefined> {
    isSaving?: boolean;
    initializeError?: string;
}

export const defaultBugBashEditorState: IBugBashEditorState = {
    draftBugBashMap: {}
};

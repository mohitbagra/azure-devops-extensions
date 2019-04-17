import { IBugBash } from "BugBashPro/Shared/Contracts";
import { IChangeableValue } from "Common/Contracts";

export interface IBugBashEditorAwareState {
    bugBashEditorState: IBugBashEditorState;
}

export interface IBugBashEditorState {
    draftBugBash: IDraftBugBash | undefined;
}

export interface IDraftBugBash extends IChangeableValue<IBugBash | undefined> {
    isSaving?: boolean;
    initializeError?: string;
}

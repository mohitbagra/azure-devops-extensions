import { IBugBashItemComment, LoadStatus } from "BugBashPro/Shared/Contracts";

export interface ICommentsAwareState {
    commentsState: ICommentsState;
}

export interface ICommentsState {
    commentsMap: { [bugBashItemId: string]: ICommentsStateModel };
}

export interface ICommentsStateModel {
    status: LoadStatus;
    error?: string;
    comments?: IBugBashItemComment[];
}

export const defaultState: ICommentsState = {
    commentsMap: {}
};

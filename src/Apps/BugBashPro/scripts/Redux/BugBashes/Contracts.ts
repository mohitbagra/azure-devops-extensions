import { IBugBash, LoadStatus } from "BugBashPro/Shared/Contracts";

export interface IBugBashesAwareState {
    bugBashesState: IBugBashesState;
}

export interface IBugBashesState {
    status: LoadStatus;
    bugBashes?: IBugBash[];
    bugBashMap?: { [id: string]: IBugBashStateModel };
}

export interface IBugBashStateModel {
    status: LoadStatus;
    error?: string;
    bugBash?: IBugBash;
}

export const defaultBugBashesState: IBugBashesState = {
    status: LoadStatus.NotLoaded
};

import { ILongText } from "BugBashPro/Shared/Contracts";
import { LoadStatus } from "Common/Contracts";

export interface IBugBashDetailsAwareState {
    bugBashDetailsState: IBugBashDetailsState;
}

export interface IBugBashDetailsState {
    detailsMap: { [bugBashId: string]: IBugBashDetailsStateModel };
}

export interface IBugBashDetailsStateModel {
    status: LoadStatus;
    error?: string;
    details?: ILongText;
}

export const defaultState: IBugBashDetailsState = {
    detailsMap: {}
};

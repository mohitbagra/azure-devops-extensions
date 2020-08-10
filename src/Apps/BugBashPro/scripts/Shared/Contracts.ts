import { IdentityRef } from "azure-devops-extension-api/WebApi/WebApi";

export interface IBugBash {
    id?: string;
    __etag?: number;
    title: string;
    workItemType: string;
    projectId: string;
    itemDescriptionField: string;
    autoAccept: boolean;
    startTime?: Date;
    endTime?: Date;
    defaultTeam?: string;
    acceptTemplateTeam?: string;
    acceptTemplateId?: string;
}

export interface IBugBashItem {
    id?: string;
    __etag?: number;
    bugBashId: string;
    title: string;
    workItemId?: number;
    teamId: string;
    description?: string;
    createdDate: Date;
    createdBy: IdentityRef;
    rejected?: boolean;
    rejectReason?: string;
    rejectedBy?: IdentityRef;
}

export interface IBugBashItemComment {
    id?: string;
    __etag?: number;
    content: string;
    createdDate: Date;
    createdBy: IdentityRef;
}

export interface ILongText {
    id?: string;
    __etag?: number;
    text: string;
}

export interface ISortState {
    sortKey: string;
    isSortedDescending: boolean;
}

export interface IUserSetting {
    id: string;
    __etag?: number;
    associatedTeam: string;
}

export interface IProjectSetting {
    gitMediaRepo: string;
}

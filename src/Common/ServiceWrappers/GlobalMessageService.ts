import {
    CommonServiceIds, IGlobalMessageBanner, IGlobalMessagesService, IToast
} from "azure-devops-extension-api";
import * as SDK from "azure-devops-extension-sdk";

let globalMessageService: IGlobalMessagesService;

export async function getGlobalMessagesService(): Promise<IGlobalMessagesService> {
    if (!globalMessageService) {
        globalMessageService = await SDK.getService<IGlobalMessagesService>(CommonServiceIds.GlobalMessagesService);
    }

    return globalMessageService;
}

export async function addBanner(banner: IGlobalMessageBanner) {
    const service = await getGlobalMessagesService();
    service.addBanner(banner);
}

export async function addToast(toast: IToast) {
    const service = await getGlobalMessagesService();
    service.addToast(toast);
}

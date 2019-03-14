import {
    CommonServiceIds, IGlobalMessageBanner, IGlobalMessagesService
} from "azure-devops-extension-api";
import * as SDK from "azure-devops-extension-sdk";

let globalMessageService: IGlobalMessagesService;

export async function getGlobalMessagesService(): Promise<IGlobalMessagesService> {
    if (!globalMessageService) {
        globalMessageService = await SDK.getService<IGlobalMessagesService>(CommonServiceIds.GlobalMessagesService);
    }

    return globalMessageService;
}

export async function setGlobalMessageBanner(banner: IGlobalMessageBanner) {
    const service = await getGlobalMessagesService();
    service.setGlobalMessageBanner(banner);
}

export async function addToast(toast: IToast) {
    const service = await getGlobalMessagesService();
    (service as any).addToast(toast);
}

export interface IToast {
    /**
     * Optional text for the Call to Action
     */
    callToAction?: string;

    /**
     * Optional class name for the root toast element
     */
    className?: string;

    /**
     * Duration in ms the toast will appear for
     */
    duration: number;

    /**
     * If true, we'll immediately take down any existing toast and display this instead
     * Otherwise, it adds it to an internal queue in the GlobalToast and will display after others in the queue
     */
    forceOverrideExisting?: boolean;

    /**
     * Message to display on the Toast
     */
    message: string;

    /**
     * Optional handler for when the Call to Action is clicked
     */
    onCallToActionClick?: () => void;
}

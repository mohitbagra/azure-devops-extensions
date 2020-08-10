import {
    CommonServiceIds,
    IDialogOptions,
    IHostPageLayoutService,
    IMessageDialogOptions,
    IPanelOptions
} from "azure-devops-extension-api/Common/CommonServices";
import * as SDK from "azure-devops-extension-sdk";

let hostPageLayoutService: IHostPageLayoutService;

export async function getHostPageLayoutService(): Promise<IHostPageLayoutService> {
    if (!hostPageLayoutService) {
        hostPageLayoutService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
    }

    return hostPageLayoutService;
}

export async function confirmAction(title: string | undefined, msg: string, callback: (ok: boolean) => void) {
    const service = await getHostPageLayoutService();
    service.openMessageDialog(msg, { onClose: callback, showCancel: true, title: title });
}

export async function openErrorDialog(message: string, reason?: string | Error) {
    const reasonStr = typeof reason === "string" ? reason : reason && reason.message;
    const errorMsg = reasonStr ? `${message} Reason: ${reasonStr}` : message;

    const service = await getHostPageLayoutService();
    service.openMessageDialog(errorMsg);
}

export async function openMessageDialog(message: string, options?: IMessageDialogOptions) {
    const service = await getHostPageLayoutService();
    service.openMessageDialog(message, options);
}

export async function openCustomDialog<TResult>(contentContributionId: string, options?: IDialogOptions<TResult>) {
    const service = await getHostPageLayoutService();
    service.openCustomDialog(contentContributionId, options);
}

export async function openPanel<TResult>(contentContributionId: string, options: IPanelOptions<TResult>) {
    const service = await getHostPageLayoutService();
    service.openPanel(contentContributionId, options);
}

export async function getFullScreenMode(): Promise<boolean> {
    const service = await getHostPageLayoutService();
    return service.getFullScreenMode();
}

export async function setFullScreenMode(fullScreenMode: boolean) {
    const service = await getHostPageLayoutService();
    service.setFullScreenMode(fullScreenMode);
}

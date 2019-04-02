import { CommonServiceIds, IHostNavigationService } from "azure-devops-extension-api";
import * as SDK from "azure-devops-extension-sdk";
import { isNullOrWhiteSpace } from "../Utilities/String";

let hostNavigationService: IHostNavigationService;

export async function getHostNavigationService(): Promise<IHostNavigationService> {
    if (!hostNavigationService) {
        hostNavigationService = await SDK.getService<IHostNavigationService>(CommonServiceIds.HostNavigationService);
    }

    return hostNavigationService;
}

export async function reloadPage() {
    const service = await getHostNavigationService();
    service.reload();
}

export async function attachNavigate(callback: (hashParams: { [key: string]: string }) => void, callOnCurrentState?: boolean) {
    const service = await getHostNavigationService();
    service.onHashChanged((hash: string) => {
        callback(parseHashString(hash));
    });

    if (callOnCurrentState) {
        const currentHash = await service.getHash();
        callback(parseHashString(currentHash));
    }
}

export async function setHash(queryParams: { [key: string]: string | undefined }, replaceHistory?: boolean) {
    let hashString = replaceHistory ? "" : "#";
    for (const key of Object.keys(queryParams)) {
        if (!isNullOrWhiteSpace(queryParams[key])) {
            hashString = `${hashString}${key}=${queryParams[key]}&`;
        }
    }
    hashString = hashString.substring(0, hashString.length - 1);
    const service = await getHostNavigationService();
    if (replaceHistory) {
        service.replaceHash(hashString);
    } else {
        service.setHash(hashString);
    }
}

export async function getHash(): Promise<{ [key: string]: string }> {
    const service = await getHostNavigationService();
    const currentHash = await service.getHash();
    return parseHashString(currentHash);
}

export async function setDocumentTitle(title: string) {
    const service = await getHostNavigationService();
    service.setDocumentTitle(title);
}

export async function openNewWindow(url: string, features?: string) {
    const service = await getHostNavigationService();
    service.openNewWindow(url, features || "");
}

function parseHashString(hash: string): { [key: string]: string } {
    let transformedHash = (hash || "").trim();
    if (!transformedHash) {
        return {};
    }

    if (transformedHash.startsWith("#") || transformedHash.startsWith("?")) {
        transformedHash = transformedHash.substring(1);
    }

    const params: { [key: string]: string } = {};
    transformedHash.split("&").map(hk => {
        const temp = hk.split("=");
        params[temp[0]] = temp[1] || "";
    });

    return params;
}

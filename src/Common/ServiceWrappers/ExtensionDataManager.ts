import {
    CommonServiceIds, ExtensionDataCollection, IExtensionDataManager, IExtensionDataService
} from "azure-devops-extension-api";
import * as SDK from "azure-devops-extension-sdk";

let extensionDataManager: IExtensionDataManager;

export async function getExtensionDataManager(): Promise<IExtensionDataManager> {
    if (!extensionDataManager) {
        const accessToken = await SDK.getAccessToken();
        const extDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
        extensionDataManager = await extDataService.getExtensionDataManager(SDK.getExtensionContext().id, accessToken);
    }

    return extensionDataManager;
}

/**
 * Read user/account scoped documents
 */
export async function readDocuments<T>(key: string, isPrivate?: boolean): Promise<T[]> {
    const dataManager = await getExtensionDataManager();
    let data: T[];

    try {
        data = await dataManager.getDocuments(key, isPrivate ? { scopeType: "User" } : undefined);
    } catch (e) {
        data = [];
    }

    return data;
}

/**
 * Read a specific user/account scoped document
 */
export async function readDocument<T>(key: string, id: string, defaultValue?: T, isPrivate?: boolean): Promise<T | undefined> {
    const dataManager = await getExtensionDataManager();
    let data: T | undefined;
    try {
        data = await dataManager.getDocument(key, id, isPrivate ? { scopeType: "User" } : undefined);
    } catch (e) {
        data = defaultValue;
    }

    return data;
}

/**
 * Create user/account scoped document
 */
export async function createDocument<T>(key: string, data: T, isPrivate?: boolean): Promise<T> {
    const dataManager = await getExtensionDataManager();
    return dataManager.createDocument(key, data, isPrivate ? { scopeType: "User" } : undefined);
}

/**
 * Update user/account scoped document
 */
export async function updateDocument<T>(key: string, data: T, isPrivate?: boolean): Promise<T> {
    const dataManager = await getExtensionDataManager();
    return dataManager.updateDocument(key, data, isPrivate ? { scopeType: "User" } : undefined);
}

/**
 * Add or Update user/account scoped document
 */
export async function addOrUpdateDocument<T>(key: string, data: T, isPrivate?: boolean): Promise<T> {
    const dataManager = await getExtensionDataManager();
    return dataManager.setDocument(key, data, isPrivate ? { scopeType: "User" } : undefined);
}

/**
 * Delete user/account scoped document
 */
export async function deleteDocument(key: string, id: string, isPrivate?: boolean): Promise<void> {
    const dataManager = await getExtensionDataManager();
    return dataManager.deleteDocument(key, id, isPrivate ? { scopeType: "User" } : undefined);
}

/**
 * Read user extension settings
 */
export async function readSetting<T>(key: string, defaultValue?: T, isPrivate?: boolean): Promise<T | undefined> {
    const dataManager = await getExtensionDataManager();
    try {
        const data = await dataManager.getValue<T>(key, isPrivate ? { scopeType: "User" } : undefined);
        return data || defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

/**
 * Write user extension settings
 */
export async function writeSetting<T>(key: string, data: T, isPrivate?: boolean): Promise<T> {
    const dataManager = await getExtensionDataManager();
    return dataManager.setValue<T>(key, data, isPrivate ? { scopeType: "User" } : undefined);
}

/**
 * Query collection names
 */
export async function queryCollectionNames(collectionNames: string[]): Promise<ExtensionDataCollection[]> {
    const dataManager = await getExtensionDataManager();
    return dataManager.queryCollectionsByName(collectionNames);
}

/**
 * Query collection
 */
export async function queryCollections(collections: ExtensionDataCollection[]): Promise<ExtensionDataCollection[]> {
    const dataManager = await getExtensionDataManager();
    return dataManager.queryCollections(collections);
}

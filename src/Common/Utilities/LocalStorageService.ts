import { getExtensionContext } from "azure-devops-extension-sdk";

import { getCurrentUser } from "./Identity";

function _getScopedKey(key: string): string {
    const userId = getCurrentUser().id;
    const extensionId = getExtensionContext().extensionId;
    return `${extensionId}_${userId}_${key}`;
}

export function writeLocalSetting(key: string, value: string) {
    const scopedKey = _getScopedKey(key);
    if (scopedKey) {
        try {
            window.localStorage.setItem(scopedKey, value);
        } catch {
            // eat up
        }
    }
}

export function readLocalSetting(key: string): string | undefined;
export function readLocalSetting(key: string, defaultValue: string): string;
export function readLocalSetting(key: string, defaultValue?: string): string | undefined {
    const scopedKey = _getScopedKey(key);
    if (scopedKey) {
        try {
            return window.localStorage.getItem(scopedKey) || defaultValue;
        } catch {
            return defaultValue;
        }
    }
    return undefined;
}

export function removeLocalSetting(key: string) {
    const scopedKey = _getScopedKey(key);
    if (scopedKey) {
        try {
            window.localStorage.removeItem(scopedKey);
        } catch {
            // eat up
        }
    }
}

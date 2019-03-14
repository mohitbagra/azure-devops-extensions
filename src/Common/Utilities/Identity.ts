import { IdentityRef } from "azure-devops-extension-api/WebApi";
import * as SDK from "azure-devops-extension-sdk";
import { isGuid, startsWith } from "azure-devops-ui/Core/Util/String";
import { isNullOrWhiteSpace } from "Common/Utilities/String";
import { getIdentityAvatarUrlAsync } from "Common/Utilities/UrlHelper";

export function isIdentityRef(value: any): value is IdentityRef {
    return !!(value && value.displayName !== undefined);
}

export function getCurrentUserName(): string {
    const currentUser = SDK.getUser();
    return `${currentUser.displayName} <${currentUser.name || ""}>`;
}

export function getCurrentUser(): IdentityRef {
    const { id, displayName, name, imageUrl } = SDK.getUser();
    return {
        id: id,
        displayName: displayName,
        uniqueName: name,
        imageUrl: imageUrl,
        _links: {
            avatar: {
                href: imageUrl
            }
        }
    } as IdentityRef;
}

export function getDistinctNameFromIdentityRef(identityRef: IdentityRef): string {
    if (identityRef == null) {
        return "";
    }

    const displayName = identityRef.displayName;
    const uniqueName = identityRef.uniqueName;

    if (uniqueName) {
        return `${displayName} <${uniqueName}>`;
    } else {
        return displayName;
    }
}

export function parseUniquefiedIdentityName(distinctName: string): IdentityRef | undefined {
    if (isNullOrWhiteSpace(distinctName)) {
        return undefined;
    }

    const i = distinctName.lastIndexOf("<");
    const j = distinctName.lastIndexOf(">");
    let displayName = distinctName;
    let uniqueName = "";
    let id = "";

    if (i >= 0 && j > i && j === distinctName.length - 1) {
        displayName = distinctName.substr(0, i).trim();
        const rightPart = distinctName.substr(i + 1, j - i - 1).trim();
        const vsIdFromAlias = getVsIdFromGroupUniqueName(rightPart); // if it has vsid in unique name (for TFS groups)

        if (rightPart.indexOf("@") !== -1 || rightPart.indexOf("\\") !== -1 || vsIdFromAlias || isGuid(rightPart)) {
            // if its a valid alias
            uniqueName = rightPart;

            // If the alias component is just a guid then this is not a uniqueName but
            // vsId which is used only for TFS groups
            if (vsIdFromAlias && !isNullOrWhiteSpace(vsIdFromAlias)) {
                id = vsIdFromAlias;
                uniqueName = "";
            }
        } else {
            // if its not a valid alias, treat it as a non-identity string
            displayName = distinctName;
        }
    }

    return {
        id: id,
        displayName: displayName,
        uniqueName: uniqueName
    } as IdentityRef;
}

export async function getAvatarUrlAsync(identityRef: IdentityRef | undefined): Promise<string> {
    if (!identityRef) {
        return "";
    }
    const avatarUrl = identityRef._links && identityRef._links.avatar && identityRef._links.avatar.href;
    return avatarUrl || identityRef.imageUrl || getIdentityAvatarUrlAsync(identityRef.id, identityRef.uniqueName);
}

function getVsIdFromGroupUniqueName(str: string): string | null {
    let leftPart: string;
    if (isNullOrWhiteSpace(str)) {
        return null;
    }

    let vsid = null;
    const i = str.lastIndexOf("\\");
    if (i === -1) {
        leftPart = str;
    } else {
        leftPart = str.substr(0, i);
    }

    if (startsWith(leftPart, "id:")) {
        const rightPart = leftPart.substr(3).trim();
        vsid = isGuid(rightPart) ? rightPart : "";
    }

    return vsid;
}

import "./IdentityView.scss";

import * as React from "react";

import { IdentityRef } from "azure-devops-extension-api/WebApi/WebApi";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { css } from "azure-devops-ui/Util";
import { VssPersona, VssPersonaSize } from "azure-devops-ui/VssPersona";
import { AsyncComponent } from "Common/Components/AsyncComponent";
import { getAvatarUrlAsync, isIdentityRef, parseUniquefiedIdentityName } from "Common/Utilities/Identity";

import { IBaseProps } from "../Contracts";
import { emptyRenderer } from "../Renderers";

interface IIdentityViewProps extends IBaseProps {
    value: IdentityRef | string;
    size?: VssPersonaSize;
    avatarOnly?: boolean;
}

export function IdentityView(props: IIdentityViewProps) {
    const { value, className, size, avatarOnly = false } = props;
    let identityRef: IdentityRef | undefined;

    if (!isIdentityRef(value)) {
        identityRef = parseUniquefiedIdentityName(value);
    } else {
        identityRef = value;
    }

    if (!identityRef || !identityRef.displayName) {
        return null;
    }

    const { displayName } = identityRef;
    const getAvatarUrlPromise = async () => getAvatarUrlAsync(identityRef);

    return (
        <div
            className={css("identity-view flex-row flex-center", className)}
            key={identityRef.id || identityRef.uniqueName || identityRef.displayName}
        >
            <AsyncComponent<string> loader={getAvatarUrlPromise} loadingComponent={emptyRenderer}>
                {(imageUrl: string) => (
                    <VssPersona
                        cssClass="identity-avatar flex-noshrink"
                        size={size || "extra-small"}
                        identityDetailsProvider={{
                            getDisplayName: () => displayName,
                            getIdentityImageUrl: () => imageUrl
                        }}
                    />
                )}
            </AsyncComponent>
            {!avatarOnly && (
                <Tooltip overflowOnly={true}>
                    <div className="identity-display-name text-ellipsis flex-grow">{displayName}</div>
                </Tooltip>
            )}
        </div>
    );
}

import "./Badge.scss";

import * as React from "react";
import { css } from "azure-devops-ui/Util";
import { IParentComponentProps } from "Common/Components/Contracts";
import { Callout, DirectionalHint } from "OfficeFabric/Callout";

interface IBadgeProps extends IParentComponentProps {
    badgeCount: number;
    badgeContent: () => JSX.Element;
    showCalloutOnHover?: boolean;
    directionalHint?: DirectionalHint;
}

export function Badge(props: IBadgeProps) {
    const { className, badgeCount, badgeContent, directionalHint, children, showCalloutOnHover } = props;
    const calloutTargetElement = React.useRef<HTMLDivElement>(null);

    const [isCalloutOpen, setCalloutOpen] = React.useState(false);

    const onBadgeClick = () => !showCalloutOnHover && setCalloutOpen(!isCalloutOpen);
    const dismissCallout = () => setCalloutOpen(false);
    const onMouseOver = () => showCalloutOnHover && setCalloutOpen(true);
    const onMouseOut = () => showCalloutOnHover && dismissCallout();

    return (
        <div
            className={css("badge relative inline-flex-row", className)}
            ref={calloutTargetElement}
            onMouseEnter={onMouseOver}
            onMouseLeave={onMouseOut}
            onClick={onBadgeClick}
        >
            {badgeContent()}
            <span className="badge-count flex-row justify-center flex-center fontSize fontWeightNormal">{badgeCount}</span>
            {isCalloutOpen && (
                <Callout
                    gapSpace={0}
                    target={calloutTargetElement.current}
                    onDismiss={dismissCallout}
                    setInitialFocus={true}
                    isBeakVisible={true}
                    directionalHint={directionalHint}
                >
                    <div className="badge-callout-container">{children}</div>
                </Callout>
            )}
        </div>
    );
}

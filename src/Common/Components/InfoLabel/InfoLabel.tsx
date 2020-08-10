import "./InfoLabel.scss";

import * as React from "react";

import { Icon } from "azure-devops-ui/Icon";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { css } from "azure-devops-ui/Util";

import { IBaseProps } from "../Contracts";

interface IInfoLabelProps extends IBaseProps {
    label: string;
    info?: string;
}

export function InfoLabel(props: IInfoLabelProps) {
    const { className, label, info } = props;
    return (
        <div className={css("info-label flex-row", className)}>
            <span className="info-label-text text-ellipsis">{label}</span>
            {info && (
                <Tooltip text={info}>
                    {Icon({
                        className: "info-icon font-size",
                        iconName: "Info"
                    })}
                </Tooltip>
            )}
        </div>
    );
}

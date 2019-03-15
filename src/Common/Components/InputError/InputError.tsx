import "./InputError.scss";

import { Icon } from "azure-devops-ui/Icon";
import { css } from "azure-devops-ui/Util";
import * as React from "react";
import { IBaseProps } from "../Contracts";

interface IInputErrorProps extends IBaseProps {
    error: string;
}

export function InputError(props: IInputErrorProps) {
    const { error, className } = props;
    return (
        <div className={css("input-error flex-row flex-center", className)}>
            <Icon className="error-icon" iconName="Error" />
            <span className="error-text flex-grow fontSize">{error}</span>
        </div>
    );
}

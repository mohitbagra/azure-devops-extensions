import "./LabelledComponent.scss";

import * as React from "react";

import { css } from "azure-devops-ui/Util";
import { ILabelledComponentProps, IParentComponentProps } from "Common/Components/Contracts";
import { InfoLabel } from "Common/Components/InfoLabel";
import { InputError } from "Common/Components/InputError";

export function LabelledComponent(props: ILabelledComponentProps & IParentComponentProps) {
    const { label, info, required, getErrorMessage, className, children } = props;
    const errorMessage = getErrorMessage && getErrorMessage();
    return (
        <div className={css("labelled-component flex-column", className, required && "required")}>
            {label && <InfoLabel label={label} info={info} />}
            {children}
            {errorMessage && <InputError error={errorMessage} />}
        </div>
    );
}

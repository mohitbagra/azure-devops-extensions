import * as React from "react";

export interface IBaseProps {
    className?: string;
}

export interface ILabelledComponentProps extends IBaseProps {
    label?: string;
    info?: string;
    required?: boolean;
    getErrorMessage?: () => string | undefined;
}

export interface IParentComponentProps extends IBaseProps {
    children: JSX.Element;
}

export interface IInputComponentProps<T> extends IBaseProps {
    value?: T;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    onChange?: (value: T) => void;
}

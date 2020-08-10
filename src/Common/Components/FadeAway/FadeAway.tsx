import "./FadeAway.scss";

import * as React from "react";

import { css } from "azure-devops-ui/Util";

import { IBaseProps } from "../Contracts";

interface IFadeAwayProps extends IBaseProps {
    duration: number;
    children: JSX.Element;
    onDismiss: () => void;
}

export function FadeAway(props: IFadeAwayProps) {
    const { className, onDismiss, duration, children } = props;
    const [fading, setFading] = React.useState(false);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onDismiss();
        }, duration);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setFading(true);
        }, duration - 500);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return <div className={css(className, "fade-away", fading && "fading")}>{children}</div>;
}

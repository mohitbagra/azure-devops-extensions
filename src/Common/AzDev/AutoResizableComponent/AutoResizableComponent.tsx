import * as SDK from "azure-devops-extension-sdk";
import { useEffect, useState } from "react";

const WIDTH_DELTA = 10;
const MIN_HEIGHT_THRESHOLD = 10;

interface IAutoResizableComponentProps {
    children: JSX.Element;
}

export function AutoResizableComponent(props: IAutoResizableComponentProps) {
    const { children } = props;
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        fillBodyHeight();
    }, []);

    useEffect(() => {
        let timeout: number;
        const handleResize = () => {
            if (Math.abs(width - window.innerWidth) > WIDTH_DELTA) {
                clearTimeout(timeout);
                timeout = window.setTimeout(() => {
                    setWidth(window.innerWidth);
                    fillBodyHeight();
                }, 50);
            }
        };
        window.addEventListener("resize", handleResize);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return children;
}

function fillBodyHeight() {
    const bodyElement = document.getElementsByTagName("body").item(0) as HTMLBodyElement;
    if (bodyElement.offsetHeight > MIN_HEIGHT_THRESHOLD) {
        SDK.resize(undefined, bodyElement.offsetHeight);
    }
}

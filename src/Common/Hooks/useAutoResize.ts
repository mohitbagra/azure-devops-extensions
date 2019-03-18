import * as SDK from "azure-devops-extension-sdk";
import { useEffect, useState } from "react";

const WIDTH_DELTA = 10;

export function useAutoResize() {
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
    });
}

function fillBodyHeight() {
    const bodyElement = document.getElementsByTagName("body").item(0) as HTMLBodyElement;
    SDK.resize(undefined, bodyElement.offsetHeight);
}

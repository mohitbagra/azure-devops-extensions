import { useEffect } from "react";

import { useActionCreators } from "Common/Hooks/useActionCreators";

import { WorkItemFormActions } from "../Redux/Actions";

const Actions = {
    resizeIframe: WorkItemFormActions.resize
};

export function useAutoResize() {
    const { resizeIframe } = useActionCreators(Actions);

    useEffect(() => {
        const bodyElement = document.getElementsByTagName("body").item(0) as HTMLBodyElement;
        let height = bodyElement.offsetHeight;
        const interval = setInterval(() => {
            const newHeight = bodyElement.offsetHeight;
            if (Math.abs(newHeight - height) > 10) {
                height = newHeight;
                resizeIframe(newHeight);
            }
        }, 50);

        return () => {
            clearInterval(interval);
        };
    }, []);
}

import { useTimeout } from "Common/Hooks/useTimeout";

interface IDelayedRenderProps {
    delay: number;
    waitComponent?: () => JSX.Element;
    children: JSX.Element;
}

export function DelayedRender(props: IDelayedRenderProps) {
    const { delay, waitComponent, children } = props;

    const ready = useTimeout(delay);

    if (ready) {
        return children;
    } else if (waitComponent) {
        return waitComponent();
    } else {
        return null;
    }
}

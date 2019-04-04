import { IBaseProps } from "Common/Components/Contracts";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { FadeAway } from "Common/Components/FadeAway";
import { isNullOrEmpty } from "Common/Utilities/String";
import * as React from "react";
import { useKeyValuePair } from "../Hooks/useKeyValuePair";
import { getKeyValuePairModule } from "../Redux/Module";

interface IFadeAwayNotificationOwnProps extends IBaseProps {
    notificationKey: string;
    duration: number;
    children: (notificationString: string) => JSX.Element;
}

function FadeAwayNotificationInternal(props: IFadeAwayNotificationOwnProps) {
    const { className, notificationKey, children, duration } = props;
    const { value: notificationString, dismissEntry } = useKeyValuePair<string>(notificationKey);

    if (isNullOrEmpty(notificationString)) {
        return null;
    }

    return (
        <FadeAway className={className} duration={duration} onDismiss={dismissEntry}>
            {children(notificationString!)}
        </FadeAway>
    );
}

export function FadeAwayNotification(props: IFadeAwayNotificationOwnProps) {
    return (
        <DynamicModuleLoader modules={[getKeyValuePairModule()]} cleanOnUnmount={true}>
            <FadeAwayNotificationInternal {...props} />
        </DynamicModuleLoader>
    );
}

import { IBaseProps } from "Common/Components/Contracts";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { FadeAway } from "Common/Components/FadeAway";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import {
    getKeyValue, getKeyValurPairModule, IKeyValurPairAwareState, KeyValurPairActions
} from "Common/Redux/KeyValuePair";
import * as React from "react";

interface IFadeAwayNotificationOwnProps extends IBaseProps {
    notificationKey: string;
    duration: number;
    children: (notificationString: string) => JSX.Element;
}

interface IFadeAwayNotificationStateProps {
    notificationString?: string;
}

const Actions = {
    dismissEntry: KeyValurPairActions.dismissEntry
};

function FadeAwayNotificationInternal(props: IFadeAwayNotificationOwnProps) {
    const { className, notificationKey, children, duration } = props;
    const mapStateToProps = React.useCallback(
        (state: IKeyValurPairAwareState): IFadeAwayNotificationStateProps => {
            return {
                notificationString: getKeyValue<string>(state, notificationKey)
            };
        },
        [notificationKey]
    );
    const { notificationString } = useMappedState(mapStateToProps);
    const { dismissEntry } = useActionCreators(Actions);

    React.useEffect(() => {
        return onDismiss;
    }, []);

    const onDismiss = React.useCallback(() => {
        dismissEntry(notificationKey);
    }, [notificationKey]);

    if (!notificationString) {
        return null;
    }

    return (
        <FadeAway className={className} duration={duration} onDismiss={onDismiss}>
            {children(notificationString)}
        </FadeAway>
    );
}

export function FadeAwayNotification(props: IFadeAwayNotificationOwnProps) {
    return (
        <DynamicModuleLoader modules={[getKeyValurPairModule()]} cleanOnUnmount={true}>
            <FadeAwayNotificationInternal {...props} />
        </DynamicModuleLoader>
    );
}

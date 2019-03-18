import { IBaseProps } from "Common/Components/Contracts";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { FadeAway } from "Common/Components/FadeAway";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import * as React from "react";
import { getKeyValue, getKeyValuePairModule, IKeyValuePairAwareState, KeyValuePairActions } from "../Redux";

interface IFadeAwayNotificationOwnProps extends IBaseProps {
    notificationKey: string;
    duration: number;
    children: (notificationString: string) => JSX.Element;
}

interface IFadeAwayNotificationStateProps {
    notificationString?: string;
}

const Actions = {
    dismissEntry: KeyValuePairActions.dismissEntry
};

function FadeAwayNotificationInternal(props: IFadeAwayNotificationOwnProps) {
    const { className, notificationKey, children, duration } = props;
    const mapStateToProps = React.useCallback(
        (state: IKeyValuePairAwareState): IFadeAwayNotificationStateProps => {
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
        <DynamicModuleLoader modules={[getKeyValuePairModule()]} cleanOnUnmount={true}>
            <FadeAwayNotificationInternal {...props} />
        </DynamicModuleLoader>
    );
}

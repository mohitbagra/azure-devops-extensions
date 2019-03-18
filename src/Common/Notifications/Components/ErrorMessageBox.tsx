import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { css } from "azure-devops-ui/Util";
import { IBaseProps } from "Common/Components/Contracts";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { isNullOrEmpty } from "Common/Utilities/String";
import * as React from "react";
import { getKeyValue, getKeyValuePairModule, IKeyValuePairAwareState, KeyValuePairActions } from "../Redux";

interface IErrorMessageBoxOwnProps extends IBaseProps {
    errorKey: string;
}

interface IErrorMessageBoxStateProps {
    error?: string;
}

const Actions = {
    dismissError: KeyValuePairActions.dismissEntry
};

function ErrorMessageBoxInternal(props: IErrorMessageBoxOwnProps) {
    const { className, errorKey } = props;
    const mapStateToProps = React.useCallback(
        (state: IKeyValuePairAwareState): IErrorMessageBoxStateProps => {
            return {
                error: getKeyValue<string>(state, errorKey)
            };
        },
        [errorKey]
    );
    const { error } = useMappedState(mapStateToProps);
    const { dismissError } = useActionCreators(Actions);

    const onDismiss = () => {
        dismissError(errorKey);
    };

    React.useEffect(() => {
        return onDismiss;
    }, []);

    if (isNullOrEmpty(error)) {
        return null;
    }

    return (
        <MessageCard className={css(className, "error-message")} onDismiss={onDismiss} severity={MessageCardSeverity.Error}>
            {error}
        </MessageCard>
    );
}

export function ErrorMessageBox(props: IErrorMessageBoxOwnProps) {
    return (
        <DynamicModuleLoader modules={[getKeyValuePairModule()]} cleanOnUnmount={true}>
            <ErrorMessageBoxInternal {...props} />
        </DynamicModuleLoader>
    );
}

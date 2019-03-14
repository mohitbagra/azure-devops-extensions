import * as React from "react";
import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { css } from "azure-devops-ui/Util";
import { IBaseProps } from "Common/Components/Contracts";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import {
    getKeyValue, getKeyValurPairModule, IKeyValurPairAwareState, KeyValurPairActions
} from "Common/Redux/KeyValuePair";
import { isNullOrEmpty } from "Common/Utilities/String";

interface IErrorMessageBoxOwnProps extends IBaseProps {
    errorKey: string;
}

interface IErrorMessageBoxStateProps {
    error?: string;
}

const Actions = {
    dismissError: KeyValurPairActions.dismissEntry
};

function ErrorMessageBoxInternal(props: IErrorMessageBoxOwnProps) {
    const { className, errorKey } = props;
    const mapStateToProps = React.useCallback(
        (state: IKeyValurPairAwareState): IErrorMessageBoxStateProps => {
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
        <DynamicModuleLoader modules={[getKeyValurPairModule()]} cleanOnUnmount={true}>
            <ErrorMessageBoxInternal {...props} />
        </DynamicModuleLoader>
    );
}

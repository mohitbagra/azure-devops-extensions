import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { css } from "azure-devops-ui/Util";
import { IBaseProps } from "Common/Components/Contracts";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { isNullOrEmpty } from "Common/Utilities/String";
import * as React from "react";
import { useKeyValuePair } from "../Hooks/useKeyValuePair";
import { getKeyValuePairModule } from "../Redux/Module";

interface IErrorMessageBoxOwnProps extends IBaseProps {
    errorKey: string;
}

function ErrorMessageBoxInternal(props: IErrorMessageBoxOwnProps) {
    const { className, errorKey } = props;
    const { value: error, dismissEntry } = useKeyValuePair<string>(errorKey);

    if (isNullOrEmpty(error)) {
        return null;
    }

    return (
        <MessageCard className={css(className, "error-message")} onDismiss={dismissEntry} severity={MessageCardSeverity.Error}>
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

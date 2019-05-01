import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { css } from "azure-devops-ui/Util";
import * as React from "react";
import { ChecklistContext } from "../../Constants";
import { useChecklistError } from "../../Hooks/useChecklistError";
import { IBaseProps } from "../Props";

export function ChecklistError(props: IBaseProps) {
    const { className } = props;
    const idOrType = React.useContext(ChecklistContext);
    const error = useChecklistError(idOrType);

    if (error) {
        return (
            <MessageCard className={css("checklist-message compact", className)} severity={MessageCardSeverity.Error}>
                {error}
            </MessageCard>
        );
    }

    return null;
}

import "./ChecklistView.scss";

import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { css } from "azure-devops-ui/Util";
import { Loading } from "Common/Components/Loading";
import * as React from "react";
import { ChecklistContext } from "../../Constants";
import { useChecklists } from "../../Hooks/useChecklists";
import { ChecklistType, IBaseProps, IChecklistItem } from "../../Interfaces";
import { ChecklistItem } from "./ChecklistItem";

interface IChecklistViewProps extends IBaseProps {
    checklistType: ChecklistType;
}

export function ChecklistView(props: IChecklistViewProps) {
    const { checklistType, className } = props;
    const idOrType = React.useContext(ChecklistContext);
    const { personalChecklist, sharedChecklist, witDefaultChecklist } = useChecklists(idOrType);

    if (!personalChecklist || !sharedChecklist || !witDefaultChecklist) {
        return <Loading />;
    }

    const isEmpty =
        checklistType === ChecklistType.Personal
            ? personalChecklist.checklistItems.length === 0
            : checklistType === ChecklistType.WitDefault
            ? witDefaultChecklist.checklistItems.length === 0
            : witDefaultChecklist.checklistItems.length + sharedChecklist.checklistItems.length === 0;

    let innerElement: JSX.Element | null = null;
    if (isEmpty) {
        innerElement = (
            <MessageCard className="checklist-message" severity={MessageCardSeverity.Info}>
                No checklist items added.
            </MessageCard>
        );
    } else if (checklistType === ChecklistType.Shared) {
        innerElement = (
            <>
                {witDefaultChecklist.checklistItems.length > 0 && (
                    <div className="checklist-items-group witdefault">
                        {witDefaultChecklist.checklistItems.map((checklistItem: IChecklistItem) => (
                            <ChecklistItem key={`checklist_${checklistItem.id}`} checklistItem={checklistItem} checklistType={ChecklistType.Shared} />
                        ))}
                    </div>
                )}
                {sharedChecklist.checklistItems.length > 0 && (
                    <div className="checklist-items-group">
                        {sharedChecklist.checklistItems.map((checklistItem: IChecklistItem) => (
                            <ChecklistItem key={`checklist_${checklistItem.id}`} checklistItem={checklistItem} checklistType={ChecklistType.Shared} />
                        ))}
                    </div>
                )}
            </>
        );
    } else {
        const checklist = checklistType === ChecklistType.Personal ? personalChecklist : witDefaultChecklist;
        innerElement = (
            <div className="checklist-items-group">
                {checklist.checklistItems.map((checklistItem: IChecklistItem) => (
                    <ChecklistItem key={`checklist_${checklistItem.id}`} checklistItem={checklistItem} checklistType={ChecklistType.Shared} />
                ))}
            </div>
        );
    }
    return <div className={css("checklist-view flex-column", className)}>{innerElement}</div>;
}

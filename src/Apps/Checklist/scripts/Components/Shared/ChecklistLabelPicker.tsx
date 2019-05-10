import { useMappedState } from "Common/Hooks/useMappedState";
import * as React from "react";
import { IChecklistAwareState } from "../../Redux/Checklist/Contracts";
import { getSuggestedLabels } from "../../Redux/Checklist/Selectors";

interface IChecklistLabelPickerProps {
    values: string[] | undefined;
    onSelectionChanged: (labels: string[]) => void;
}

function mapState(state: IChecklistAwareState): { suggestedLabels: string[] } {
    return {
        suggestedLabels: getSuggestedLabels(state)
    };
}

export function ChecklistLabelPicker(props: IChecklistLabelPickerProps) {
    // const { values, onSelectionChanged } = props;
    const { suggestedLabels } = useMappedState(mapState);

    return <>{suggestedLabels.length}</>;
}

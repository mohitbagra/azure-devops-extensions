import * as React from "react";

import { IBaseProps } from "Common/Components/Contracts";
import { MultiValuePicker } from "Common/Components/Pickers/MultiValuePicker";
import { useMappedState } from "Common/Hooks/useMappedState";

import { IChecklistAwareState } from "../../Redux/Checklist/Contracts";
import { getSuggestedLabels } from "../../Redux/Checklist/Selectors";

interface IChecklistLabelPickerProps extends IBaseProps {
    values: string[] | undefined;
    disabled?: boolean;
    onSelectionChanged: (labels: string[]) => void;
}

function mapState(state: IChecklistAwareState): { suggestedLabels: string[] } {
    return {
        suggestedLabels: getSuggestedLabels(state)
    };
}

export function ChecklistLabelPicker(props: IChecklistLabelPickerProps) {
    const { values, className, disabled, onSelectionChanged } = props;
    const { suggestedLabels } = useMappedState(mapState);

    return (
        <MultiValuePicker
            className={className}
            allValues={suggestedLabels}
            placeholder="Add labels"
            disabled={disabled}
            value={values}
            onChange={onSelectionChanged}
        />
    );
}

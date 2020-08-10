import * as React from "react";

import { css } from "azure-devops-ui/Util";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { IMultiValuePickerProps, MultiValuePicker } from "Common/Components/Pickers/MultiValuePicker";

import { useTags } from "../Hooks/useTags";
import { getTagModule } from "../Redux/Module";

function WorkItemTagPickerInternal(props: IMultiValuePickerProps) {
    const { tags } = useTags();
    const newProps = {
        ...props,
        className: css("work-item-tags-picker", props.className),
        allValues: tags || []
    } as IMultiValuePickerProps;

    return <MultiValuePicker {...newProps} />;
}

export function WorkItemTagPicker(props: IMultiValuePickerProps) {
    return (
        <DynamicModuleLoader modules={[getTagModule()]}>
            <WorkItemTagPickerInternal {...props} />
        </DynamicModuleLoader>
    );
}

import { css } from "azure-devops-ui/Util";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import {
    ClassificationNodePicker,
    IClassificationNodePickerProps,
    IClassificationNodePickerSharedProps
} from "Common/Components/Pickers/ClassificationNodePicker";
import * as React from "react";
import { useAreaPaths } from "../Hooks/useAreaPaths";
import { getClassificationNodeModule } from "../Redux";

function AreaPathPickerInternal(props: IClassificationNodePickerSharedProps) {
    const { rootNode } = useAreaPaths();
    const newProps = {
        ...props,
        className: css("area-path-picker", props.className),
        rootNode: rootNode
    } as IClassificationNodePickerProps;

    return <ClassificationNodePicker {...newProps} />;
}

export function AreaPathPicker(props: IClassificationNodePickerSharedProps) {
    return (
        <DynamicModuleLoader modules={[getClassificationNodeModule()]}>
            <AreaPathPickerInternal {...props} />
        </DynamicModuleLoader>
    );
}

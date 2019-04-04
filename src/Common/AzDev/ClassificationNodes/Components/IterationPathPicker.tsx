import { css } from "azure-devops-ui/Util";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import {
    ClassificationNodePicker,
    IClassificationNodePickerProps,
    IClassificationNodePickerSharedProps
} from "Common/Components/Pickers/ClassificationNodePicker";
import * as React from "react";
import { useIterationPaths } from "../Hooks/useIterationPaths";
import { getClassificationNodeModule } from "../Redux/Module";

function IterationPathPickerInternal(props: IClassificationNodePickerSharedProps) {
    const { rootNode } = useIterationPaths();

    const newProps = {
        ...props,
        className: css("iteration-path-picker", props.className),
        rootNode: rootNode
    } as IClassificationNodePickerProps;

    return <ClassificationNodePicker {...newProps} />;
}

export function IterationPathPicker(props: IClassificationNodePickerSharedProps) {
    return (
        <DynamicModuleLoader modules={[getClassificationNodeModule()]}>
            <IterationPathPickerInternal {...props} />
        </DynamicModuleLoader>
    );
}

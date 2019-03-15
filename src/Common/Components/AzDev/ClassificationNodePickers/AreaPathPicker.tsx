import { css } from "azure-devops-ui/Util";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import {
    ClassificationNodePicker, IClassificationNodePickerProps, IClassificationNodePickerSharedProps
} from "Common/Components/Pickers/ClassificationNodePicker";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import {
    AreaPathActions, areAreaPathsLoading, getAreaPathRootNode, getClassificationNodeModule,
    IClassificationNode, IClassificationNodeAwareState
} from "Common/Redux/ClassificationNodes";
import * as React from "react";

interface IAreaPathPickerStateProps {
    rootNode?: IClassificationNode;
    loading: boolean;
}

function mapStateToProps(state: IClassificationNodeAwareState): IAreaPathPickerStateProps {
    return {
        rootNode: getAreaPathRootNode(state),
        loading: areAreaPathsLoading(state)
    };
}

const Actions = {
    loadAreaPaths: AreaPathActions.loadRequested
};

function AreaPathPickerInternal(props: IClassificationNodePickerSharedProps) {
    const { rootNode, loading } = useMappedState(mapStateToProps);
    const { loadAreaPaths } = useActionCreators(Actions);

    React.useEffect(() => {
        if (!rootNode && !loading) {
            loadAreaPaths();
        }
    }, []);

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

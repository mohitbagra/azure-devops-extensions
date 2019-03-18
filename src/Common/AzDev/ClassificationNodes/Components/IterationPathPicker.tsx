import { css } from "azure-devops-ui/Util";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import {
    ClassificationNodePicker,
    IClassificationNodePickerProps,
    IClassificationNodePickerSharedProps
} from "Common/Components/Pickers/ClassificationNodePicker";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import * as React from "react";
import {
    areIterationPathsLoading,
    getClassificationNodeModule,
    getIterationPathRootNode,
    IClassificationNode,
    IClassificationNodeAwareState,
    IterationPathActions
} from "../Redux";

interface IIterationPathPickerStateProps {
    rootNode?: IClassificationNode;
    loading: boolean;
}

function mapStateToProps(state: IClassificationNodeAwareState): IIterationPathPickerStateProps {
    return {
        rootNode: getIterationPathRootNode(state),
        loading: areIterationPathsLoading(state)
    };
}

const Actions = {
    loadIterationPaths: IterationPathActions.loadRequested
};

function IterationPathPickerInternal(props: IClassificationNodePickerSharedProps) {
    const { rootNode, loading } = useMappedState(mapStateToProps);
    const { loadIterationPaths } = useActionCreators(Actions);

    React.useEffect(() => {
        if (!rootNode && !loading) {
            loadIterationPaths();
        }
    }, []);

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

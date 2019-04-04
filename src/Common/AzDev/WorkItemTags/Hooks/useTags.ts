import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useEffect } from "react";
import { TagActions } from "../Redux/Actions";
import { ITagAwareState, ITagState } from "../Redux/Contracts";
import { getTags, getTagsError, getTagsStatus } from "../Redux/Selectors";

export function useTags(): ITagState {
    const { tags, status, error } = useMappedState(mapState);
    const { loadTags } = useActionCreators(Actions);

    useEffect(() => {
        if (status === LoadStatus.NotLoaded) {
            loadTags();
        }
    }, []);

    return { tags, status, error };
}

function mapState(state: ITagAwareState): ITagState {
    return {
        tags: getTags(state),
        status: getTagsStatus(state),
        error: getTagsError(state)
    };
}

const Actions = {
    loadTags: TagActions.loadRequested
};

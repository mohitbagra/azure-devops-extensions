import { IBugBashItemComment } from "BugBashPro/Shared/Contracts";
import { CommentActions } from "BugBashPro/Shared/Redux/Comments/Actions";
import { ICommentsAwareState } from "BugBashPro/Shared/Redux/Comments/Contracts";
import { getComments, getCommentsStatus } from "BugBashPro/Shared/Redux/Comments/Selectors";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useCallback, useEffect } from "react";

export function useComments(bugBashItemId: string): IUseCommentsMappedState {
    const mapState = useCallback(
        (state: ICommentsAwareState): IUseCommentsMappedState => {
            return {
                comments: getComments(state, bugBashItemId),
                status: getCommentsStatus(state, bugBashItemId)
            };
        },
        [bugBashItemId]
    );
    const { comments, status } = useMappedState(mapState);
    const { requestCommentsLoad } = useActionCreators(Actions);

    useEffect(() => {
        if (!comments || status === LoadStatus.NotLoaded) {
            requestCommentsLoad(bugBashItemId);
        }
    }, [bugBashItemId]);

    return { comments, status };
}

interface IUseCommentsMappedState {
    comments: IBugBashItemComment[] | undefined;
    status: LoadStatus;
}

const Actions = {
    requestCommentsLoad: CommentActions.commentsLoadRequested
};

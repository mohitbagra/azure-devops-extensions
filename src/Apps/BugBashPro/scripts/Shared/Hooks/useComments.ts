import { IBugBashItemComment } from "BugBashPro/Shared/Contracts";
import { CommentActions, getComments, getCommentsStatus, ICommentsAwareState } from "BugBashPro/Shared/Redux/Comments";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useCallback, useEffect } from "react";

export function useComments(bugBashItemId: string): IUseCommentsMappedState {
    const mapStateToProps = useCallback(
        (state: ICommentsAwareState): IUseCommentsMappedState => {
            return {
                comments: getComments(state, bugBashItemId),
                status: getCommentsStatus(state, bugBashItemId)
            };
        },
        [bugBashItemId]
    );
    const { comments, status } = useMappedState(mapStateToProps);
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

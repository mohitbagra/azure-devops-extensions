import { GitRepository } from "azure-devops-extension-api/Git";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import {
    IPicklistPickerSharedProps, picklistRenderer
} from "Common/Components/Pickers/PicklistPicker";
import { useActionCreators, useMappedState } from "Common/Hooks/Redux";
import {
    areGitReposLoading, getGitRepoModule, getGitRepos, GitRepoActions, IGitRepoAwareState
} from "Common/Redux/GitRepos";
import * as React from "react";

interface IGitRepoPickerStateProps {
    gitRepos?: GitRepository[];
    loading: boolean;
}

function mapStateToProps(state: IGitRepoAwareState): IGitRepoPickerStateProps {
    return {
        gitRepos: getGitRepos(state),
        loading: areGitReposLoading(state)
    };
}

const Actions = {
    loadGitRepos: GitRepoActions.loadRequested
};

function GitRepoPickerInternal(props: IPicklistPickerSharedProps<GitRepository>) {
    const { placeholder } = props;
    const { gitRepos, loading } = useMappedState(mapStateToProps);
    const { loadGitRepos } = useActionCreators(Actions);

    React.useEffect(() => {
        if (!gitRepos && !loading) {
            loadGitRepos();
        }
    }, []);

    return picklistRenderer({ ...props, placeholder: placeholder || "Select a git repo" }, gitRepos, (repo: GitRepository) => ({
        key: repo.id,
        name: repo.name
    }));
}

export function GitRepoPicker(props: IPicklistPickerSharedProps<GitRepository>) {
    return (
        <DynamicModuleLoader modules={[getGitRepoModule()]}>
            <GitRepoPickerInternal {...props} />
        </DynamicModuleLoader>
    );
}

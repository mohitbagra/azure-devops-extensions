import { GitRepository } from "azure-devops-extension-api/Git/Git";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { IPicklistPickerSharedProps, picklistRenderer } from "Common/Components/Pickers/PicklistPicker";
import * as React from "react";
import { useGitRepos } from "../Hooks/useGitRepos";
import { getGitRepoModule } from "../Redux/Module";

function GitRepoPickerInternal(props: IPicklistPickerSharedProps<GitRepository>) {
    const { placeholder } = props;
    const { gitRepos } = useGitRepos();

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

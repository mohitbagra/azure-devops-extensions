import { GitRepository } from "azure-devops-extension-api/Git/Git";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { dropdownRenderer, IDropdownPickerSharedProps } from "Common/Components/Pickers/DropdownPicker";
import * as React from "react";
import { useGitRepos } from "../Hooks/useGitRepos";
import { getGitRepoModule } from "../Redux/Module";

function GitRepoPickerInternal(props: IDropdownPickerSharedProps<GitRepository>) {
    const { placeholder } = props;
    const { gitRepos } = useGitRepos();

    return dropdownRenderer({ ...props, placeholder: placeholder || "Select a git repo" }, gitRepos, (repo: GitRepository) => ({
        id: repo.id,
        text: repo.name
    }));
}

export function GitRepoPicker(props: IDropdownPickerSharedProps<GitRepository>) {
    return (
        <DynamicModuleLoader modules={[getGitRepoModule()]}>
            <GitRepoPickerInternal {...props} />
        </DynamicModuleLoader>
    );
}

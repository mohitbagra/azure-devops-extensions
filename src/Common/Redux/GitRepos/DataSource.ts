import { getClient } from "azure-devops-extension-api";
import { GitRepository, GitRestClient } from "azure-devops-extension-api/Git";
import { localeIgnoreCaseComparer } from "azure-devops-ui/Core/Util/String";
import { memoizePromise } from "Common/Utilities/Memoize";
import { getCurrentProjectId } from "Common/Utilities/WebContext";

export const fetchGitRepos = memoizePromise(
    async () => {
        const projectId = await getCurrentProjectId();
        const gitRepos = await getClient(GitRestClient).getRepositories(projectId);
        gitRepos.sort((a: GitRepository, b: GitRepository) => localeIgnoreCaseComparer(a.name, b.name));
        return gitRepos;
    },
    () => "gitRepos"
);

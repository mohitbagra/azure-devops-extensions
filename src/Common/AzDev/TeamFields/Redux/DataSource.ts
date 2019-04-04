import { getClient } from "azure-devops-extension-api/Common/Client";
import { TeamContext } from "azure-devops-extension-api/Core/Core";
import { WorkRestClient } from "azure-devops-extension-api/Work";
import { memoizePromise } from "Common/Utilities/Memoize";
import { getCurrentProjectId } from "Common/Utilities/WebContext";

export const fetchTeamFieldValues = memoizePromise(
    async (teamId: string) => {
        const projectId = await getCurrentProjectId();
        const teamContext: TeamContext = {
            project: "",
            projectId: projectId,
            team: "",
            teamId: teamId
        };

        return getClient(WorkRestClient).getTeamFieldValues(teamContext);
    },
    (teamId: string) => teamId.toLowerCase()
);

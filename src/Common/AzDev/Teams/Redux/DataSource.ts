import { getClient } from "azure-devops-extension-api/Common/Client";
import { CoreRestClient, WebApiTeam } from "azure-devops-extension-api/Core";
import { localeIgnoreCaseComparer } from "azure-devops-ui/Core/Util/String";
import { memoizePromise } from "Common/Utilities/Memoize";
import { getCurrentProjectId } from "Common/Utilities/WebContext";

async function getTeams(): Promise<WebApiTeam[]> {
    const teams: WebApiTeam[] = [];
    const top = 300;
    const client = await getClient(CoreRestClient);
    const projectId = await getCurrentProjectId();

    const getTeamDelegate = async (skip: number) => {
        const result: WebApiTeam[] = await client.getTeams(projectId, false, top, skip);
        if (result.length > 0) {
            teams.push(...result);
        }
        if (result.length === top) {
            await getTeamDelegate(skip + top);
        }
        return;
    };

    await getTeamDelegate(0);
    return teams;
}

export const fetchTeams = memoizePromise(
    async () => {
        const teams = await getTeams();
        teams.sort((a: WebApiTeam, b: WebApiTeam) => localeIgnoreCaseComparer(a.name, b.name));
        return teams;
    },
    () => "teams"
);

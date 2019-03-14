import { getClient } from "azure-devops-extension-api";
import { WebApiTagDefinition } from "azure-devops-extension-api/Core";
import { localeIgnoreCaseComparer } from "azure-devops-ui/Core/Util/String";
import { TaggingRestClient } from "Common/RestClients/Tags/RestClient";
import { memoizePromise } from "Common/Utilities/Memoize";
import { getCurrentProjectId } from "Common/Utilities/WebContext";

export const fetchTags = memoizePromise(
    async () => {
        const client = await getClient(TaggingRestClient);
        const projectId = await getCurrentProjectId();
        const tags = await client.getTagDefinitions(projectId);
        tags.sort((a: WebApiTagDefinition, b: WebApiTagDefinition) => localeIgnoreCaseComparer(a.name, b.name));
        return tags.map(t => t.name);
    },
    () => "tags"
);

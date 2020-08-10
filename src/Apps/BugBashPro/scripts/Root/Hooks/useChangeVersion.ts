import * as React from "react";

import { readSetting, writeSetting } from "Common/ServiceWrappers/ExtensionDataManager";

import { ChangelogMajorVersion } from "../Constants";

export function useChangeVersion(): [string | undefined, () => void] {
    const [changeVersion, setChangeVersion] = React.useState<string | undefined>(undefined);

    function setChangelogVersionToLatest() {
        writeSetting("changeVersion", ChangelogMajorVersion, true);
        setChangeVersion(undefined);
    }

    async function loadChangeVersion() {
        const lastChangeVersion = await readSetting("changeVersion", "", true);
        if (lastChangeVersion !== ChangelogMajorVersion) {
            setChangeVersion(ChangelogMajorVersion);
        }
    }

    React.useEffect(() => {
        loadChangeVersion();
    }, []);

    return [changeVersion, setChangelogVersionToLatest];
}

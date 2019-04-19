import "./BugBashItemCharts.scss";

import { Checkbox } from "azure-devops-ui/Checkbox";
import { ConditionalChildren } from "azure-devops-ui/ConditionalChildren";
import { useBugBashViewMode } from "BugBashPro/Hubs/BugBashView/Hooks/useBugBashViewMode";
import { IBugBashItemProviderParams } from "BugBashPro/Hubs/BugBashView/Interfaces";
import { BugBashViewMode } from "BugBashPro/Hubs/BugBashView/Redux/Contracts";
import { isBugBashItemAccepted } from "BugBashPro/Shared/Helpers";
import { useUserSettings } from "BugBashPro/Shared/Hooks/useUserSettings";
import { getBugBashUserSettingsModule } from "BugBashPro/Shared/Redux/UserSettings/Module";
import { useTeams } from "Common/AzDev/Teams/Hooks/useTeams";
import { getTeamModule } from "Common/AzDev/Teams/Redux/Module";
import { DynamicModuleLoader } from "Common/Components/DynamicModuleLoader";
import { Loading } from "Common/Components/Loading";
import { CoreFieldRefNames } from "Common/Constants";
import { getDistinctNameFromIdentityRef, parseUniquefiedIdentityName } from "Common/Utilities/Identity";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function BugBashItemsChartsInternal(props: IBugBashItemProviderParams) {
    const { filteredBugBashItems, workItemsMap } = props;
    const [groupedByTeam, setGroupedByTeam] = React.useState(false);
    const { userSettingsMap } = useUserSettings();
    const { teamsMap } = useTeams();
    const { viewMode } = useBugBashViewMode();
    const toggleGroupByTeam = React.useCallback((_e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, checked: boolean) => {
        setGroupedByTeam(checked);
    }, []);

    if (!teamsMap || !userSettingsMap) {
        return <Loading />;
    }

    const assignedToTeamCounts: { [key: string]: number } = {};
    const createdByCounts: { [key: string]: { count: number; members: { [key: string]: number } } } = {};
    const assignedToTeamData: INameValuePair[] = [];
    const createdByData: INameValuePair[] = [];

    for (const bugBashItem of filteredBugBashItems) {
        const createdByUser = bugBashItem.createdBy;
        const createdBy = getDistinctNameFromIdentityRef(createdByUser);

        const userSetting = userSettingsMap[createdByUser.uniqueName.toLowerCase()];
        const associatedTeamId = userSetting ? userSetting.associatedTeam : "";
        const associatedTeam = associatedTeamId ? teamsMap[associatedTeamId.toLowerCase()] : null;

        let teamId: string;
        if (isBugBashItemAccepted(bugBashItem) && workItemsMap && workItemsMap[bugBashItem.workItemId!]) {
            teamId = workItemsMap[bugBashItem.workItemId!].fields[CoreFieldRefNames.AreaPath];
        } else {
            teamId = bugBashItem.teamId;
        }
        assignedToTeamCounts[teamId] = (assignedToTeamCounts[teamId] || 0) + 1;

        if (associatedTeam && groupedByTeam) {
            if (createdByCounts[associatedTeam.name] == null) {
                createdByCounts[associatedTeam.name] = {
                    count: 0,
                    members: {}
                };
            }
            createdByCounts[associatedTeam.name].count = createdByCounts[associatedTeam.name].count + 1;
            createdByCounts[associatedTeam.name].members[createdBy] = (createdByCounts[associatedTeam.name].members[createdBy] || 0) + 1;
        } else {
            if (createdByCounts[createdBy] == null) {
                createdByCounts[createdBy] = {
                    count: 0,
                    members: {}
                };
            }
            createdByCounts[createdBy].count = createdByCounts[createdBy].count + 1;
        }
    }

    for (const teamId of Object.keys(assignedToTeamCounts)) {
        const team = teamsMap[teamId.toLowerCase()];
        const teamName = team ? team.name : teamId;
        assignedToTeamData.push({ name: teamName, value: assignedToTeamCounts[teamId] });
    }

    for (const createdBy of Object.keys(createdByCounts)) {
        const membersMap = createdByCounts[createdBy].members;
        const membersArr: INameValuePair[] = [];
        for (const memberKey of Object.keys(membersMap)) {
            membersArr.push({ name: parseUniquefiedIdentityName(memberKey)!.displayName, value: membersMap[memberKey] });
        }

        membersArr.sort((a, b) => b.value - a.value);

        createdByData.push({
            name: parseUniquefiedIdentityName(createdBy)!.displayName,
            value: createdByCounts[createdBy].count,
            members: membersArr
        });
    }

    assignedToTeamData.sort((a, b) => b.value - a.value);
    createdByData.sort((a, b) => b.value - a.value);

    return (
        <div className="bugbash-charts flex-grow">
            <ConditionalChildren renderChildren={viewMode === BugBashViewMode.All}>
                <div className="chart-view-container">
                    <div className="header-container">
                        <div>{`Assigned to ${viewMode === BugBashViewMode.Accepted ? "area path" : "team"} (${filteredBugBashItems.length})`}</div>
                    </div>
                    <div className="chart-view">
                        <ResponsiveContainer width="95%">
                            <BarChart
                                layout={"vertical"}
                                width={600}
                                height={600}
                                data={assignedToTeamData}
                                barSize={5}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <XAxis type="number" allowDecimals={false} />
                                <YAxis type="category" dataKey="name" tick={<CustomAxisTick />} allowDecimals={false} />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip isAnimationActive={false} content={<CustomTooltip />} />
                                <Bar isAnimationActive={false} dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </ConditionalChildren>
            <div className="chart-view-container">
                <div className="header-container">
                    <div className="flex-grow">{`Created By (${filteredBugBashItems.length})`}</div>
                    <Checkbox label="Group by team" checked={groupedByTeam} className="group-by-checkbox" onChange={toggleGroupByTeam} />
                </div>
                <div className="chart-view">
                    <ResponsiveContainer width="95%">
                        <BarChart
                            layout={"vertical"}
                            width={600}
                            height={600}
                            data={createdByData}
                            barSize={5}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis type="number" allowDecimals={false} />
                            <YAxis type="category" dataKey="name" tick={<CustomAxisTick />} allowDecimals={false} />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip isAnimationActive={false} content={<CustomTooltip />} />
                            <Bar isAnimationActive={false} dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

interface INameValuePair {
    name: string;
    value: number;
    members?: INameValuePair[];
}

const CustomAxisTick = (props: any): JSX.Element => {
    const { x, y, payload } = props;
    const value = payload.value.length > 9 ? `${payload.value.substr(0, 9)}...` : payload.value;
    return (
        <g transform={`translate(${x - 4},${y + 2})`}>
            <text fill="#767676" style={{ fontSize: "12px" }} width={100} textAnchor="end">
                {value}
            </text>
        </g>
    );
};

const CustomTooltip: React.StatelessComponent<any> = (props: any): JSX.Element | null => {
    const data: INameValuePair = props && props.payload && props.payload[0] && props.payload[0].payload;
    if (!data) {
        return null;
    }

    if (!data.members || data.members.length === 0) {
        return (
            <div className="chart-tooltip">
                <span className="tooltip-key">{data["name"]}</span> : <span className="tooltip-value">{data["value"]}</span>
            </div>
        );
    } else {
        return (
            <div className="chart-tooltip">
                <div className="team-name">
                    <span className="tooltip-key">{data["name"]}</span> : <span className="tooltip-value">{data["value"]}</span>
                </div>
                {data.members.map((member: INameValuePair) => {
                    return (
                        <div key={member.name}>
                            <span className="tooltip-key">{member.name}</span> : <span className="tooltip-value">{member.value}</span>
                        </div>
                    );
                })}
            </div>
        );
    }
};

export function BugBashItemsCharts(props: IBugBashItemProviderParams) {
    return (
        <DynamicModuleLoader modules={[getBugBashUserSettingsModule(), getTeamModule()]}>
            <BugBashItemsChartsInternal {...props} />
        </DynamicModuleLoader>
    );
}

import "./SettingsPanel.scss";

import * as React from "react";

import { WorkItemField } from "azure-devops-extension-api/WorkItemTracking";
import { Button } from "azure-devops-ui/Button";
import { ContentSize } from "azure-devops-ui/Components/Callout/Callout.Props";
import { Panel } from "azure-devops-ui/Panel";
import { Loading } from "Common/Components/Loading";
import { DropdownPicker } from "Common/Components/Pickers/DropdownPicker";
import { MultiValuePicker } from "Common/Components/Pickers/MultiValuePicker";
import { TextField } from "Common/Components/TextField";
import { useControlledState } from "Common/Hooks/useControlledState";
import { useMappedState } from "Common/Hooks/useMappedState";

import { IRelatedWitsAwareState } from "../Redux/Contracts";
import { getQueryableFields, getSettings, getSortableFields } from "../Redux/Selectors";

interface ISettingsPanelProps {
    onDismiss: () => void;
}

const mapState = (state: IRelatedWitsAwareState) => {
    return {
        sortFields: getSortableFields(state),
        queryFields: getQueryableFields(state),
        settings: getSettings(state)
    };
};

export function SettingsPanel(props: ISettingsPanelProps) {
    const { sortFields, queryFields, settings } = useMappedState(mapState);
    const [settingsDraft, setSettingsDraft] = useControlledState(settings);

    const onTopChange = React.useCallback(
        (newValue: string) => {
            if (settingsDraft) {
                setSettingsDraft({ ...settingsDraft, top: parseInt(newValue) });
            }
        },
        [settingsDraft, setSettingsDraft]
    );

    const onSortFieldChange = React.useCallback(
        (newValue?: WorkItemField) => {
            if (settingsDraft && newValue) {
                setSettingsDraft({ ...settingsDraft, sortByField: newValue.referenceName });
            }
        },
        [settingsDraft, setSettingsDraft]
    );

    return (
        <Panel blurDismiss={false} size={ContentSize.Medium} titleProps={{ text: "Settings" }} onDismiss={props.onDismiss}>
            {!settingsDraft && <Loading />}
            {settingsDraft && (
                <div className="settings-panel flex-column flex-grow">
                    <div className="settings-controls flex-column">
                        <div className="settings-control-container">
                            <TextField
                                info="Maximum number of work items to retrieve"
                                inputType="number"
                                label="Max count"
                                required={true}
                                value={(settingsDraft.top || "").toString()}
                                onChange={onTopChange}
                            />
                        </div>

                        <div className="settings-control-container">
                            <DropdownPicker
                                label="Sort by"
                                info="Select a field which will be used to sort the results"
                                required={true}
                                className="sort-field-dropdown"
                                options={sortFields || []}
                                selectedValue={settingsDraft.sortByField}
                                getDropdownItem={(f: WorkItemField) => {
                                    return {
                                        id: f.referenceName,
                                        text: f.name
                                    };
                                }}
                                onChange={onSortFieldChange}
                            />
                        </div>

                        <div className="settings-control-container">
                            <MultiValuePicker
                                className="tagpicker"
                                required={true}
                                addButtonText="Add fields"
                                placeholder="Type to add a field"
                                label="Fields to seek"
                                info="Select a list of fields which will be used to seek related work items"
                                allValues={(queryFields || []).map((f) => f.name)}
                            />
                        </div>
                    </div>

                    <Button primary={true} className="save-button">
                        Save
                    </Button>
                </div>
            )}
        </Panel>
    );
}

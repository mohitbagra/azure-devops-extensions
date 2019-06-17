import "./SettingsPanel.scss";

import { WorkItemField } from "azure-devops-extension-api/WorkItemTracking";
import { Button } from "azure-devops-ui/Button";
import { ContentSize } from "azure-devops-ui/Components/Callout/Callout.Props";
import { Panel } from "azure-devops-ui/Panel";
import { DropdownPicker } from "Common/Components/Pickers/DropdownPicker";
import { MultiValuePicker } from "Common/Components/Pickers/MultiValuePicker";
import { TextField } from "Common/Components/TextField";
import { useMappedState } from "Common/Hooks/useMappedState";
import * as React from "react";
import { IRelatedWitsAwareState } from "../Redux/Contracts";
import { getQueryableFields, getSortableFields } from "../Redux/Selectors";

interface ISettingsPanelProps {
    onDismiss: () => void;
}

const mapState = (state: IRelatedWitsAwareState) => {
    return {
        sortFields: getSortableFields(state),
        queryFields: getQueryableFields(state)
    };
};

export function SettingsPanel(props: ISettingsPanelProps) {
    const { sortFields, queryFields } = useMappedState(mapState);

    return (
        <Panel blurDismiss={false} size={ContentSize.Medium} titleProps={{ text: "Settings" }} onDismiss={props.onDismiss}>
            <div className="settings-panel flex-column flex-grow">
                <div className="settings-controls flex-column">
                    <div className="settings-control-container">
                        <TextField info="Maximum number of work items to retrieve" label="Max count" />
                    </div>

                    <div className="settings-control-container">
                        <DropdownPicker
                            label="Sort by"
                            info="Select a field which will be used to sort the results"
                            className="sort-field-dropdown"
                            options={sortFields || []}
                            getDropdownItem={(f: WorkItemField) => {
                                return {
                                    id: f.referenceName,
                                    text: f.name
                                };
                            }}
                        />
                    </div>

                    <div className="settings-control-container">
                        <MultiValuePicker
                            className="tagpicker"
                            label="Fields to seek"
                            info="Select a list of fields which will be used to seek related work items"
                            allValues={(queryFields || []).map(f => f.name)}
                        />
                    </div>
                </div>

                <Button primary={true} className="save-button">
                    Save
                </Button>
            </div>
        </Panel>
    );
}

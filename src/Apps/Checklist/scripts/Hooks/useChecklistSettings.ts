import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { useEffect } from "react";
import { ChecklistSettingsActions } from "../Redux/Settings/Actions";
import { IChecklistSettingsAwareState, IChecklistSettingsState } from "../Redux/Settings/Contracts";
import { areSettignsInitialized, isHideCompletedItemsOn, isWordWrapOn } from "../Redux/Settings/Selectors";

export function useChecklistSettings(): IChecklistSettingsState {
    const { initialized, wordWrap, hideCompletedItems } = useMappedState(mapState);
    const { initializeSettings } = useActionCreators(Actions);

    useEffect(() => {
        if (!initialized) {
            initializeSettings();
        }
    }, []);

    return { initialized, wordWrap, hideCompletedItems };
}

function mapState(state: IChecklistSettingsAwareState): IChecklistSettingsState {
    return {
        initialized: areSettignsInitialized(state),
        wordWrap: isWordWrapOn(state),
        hideCompletedItems: isHideCompletedItemsOn(state)
    };
}

const Actions = { initializeSettings: ChecklistSettingsActions.initialize };

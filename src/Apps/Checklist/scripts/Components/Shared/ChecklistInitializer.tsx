import { Loading } from "Common/Components/Loading";
import * as React from "react";
import { ChecklistContext } from "../../Constants";
import { useChecklists } from "../../Hooks/useChecklists";

interface IChecklistInitializerProps {
    children: JSX.Element;
}

export function ChecklistInitializer(props: IChecklistInitializerProps) {
    const idOrType = React.useContext(ChecklistContext);
    const { personalChecklist, sharedChecklist, witDefaultChecklist } = useChecklists(idOrType);

    if (!personalChecklist || !sharedChecklist || !witDefaultChecklist) {
        return <Loading />;
    }

    return props.children;
}

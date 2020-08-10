import { useContext, useEffect, useMemo } from "react";

import { Context } from "Common/Redux";
import { IModule } from "redux-dynamic-modules";

import { IParentComponentProps } from "../Contracts";

interface IDynamicModuleLoaderProps extends IParentComponentProps {
    /** Modules that need to be dynamically registerd */
    modules: IModule<any>[];
    cleanOnUnmount?: boolean;
}

export function DynamicModuleLoader(props: IDynamicModuleLoaderProps) {
    const { modules, cleanOnUnmount, children } = props;
    const store = useContext(Context);
    if (!store) {
        throw new Error("Redux store is required to be passed through context via the <StoreProvider>");
    }
    const modulesRef = useMemo(() => store.addModules(modules), []);

    useEffect(() => {
        return () => {
            if (cleanOnUnmount) {
                modulesRef.remove();
            }
        };
    }, []);

    return children;
}

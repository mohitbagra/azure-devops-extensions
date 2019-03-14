import { createContext } from "react";
import { IModuleStore } from "redux-dynamic-modules";

export const Context: React.Context<IModuleStore<any> | null> = createContext(null);
export const ReduxHooksStoreProvider = Context.Provider;

import { useContext, useMemo } from "react";
import { Context } from "Common/Redux";
import { bindActionCreators } from "redux";

export function useActionCreators<T>(actionCreators: T, memoArray?: any[]): T {
    const store = useContext(Context);
    if (!store) {
        throw new Error("redux-react-hook requires your Redux store to be passed through context via the <StoreProvider>");
    }

    const dispatch = store.dispatch;
    return useMemo(() => bindActionCreators(actionCreators as any, dispatch), memoArray ? [dispatch, ...memoArray] : [dispatch]);
}

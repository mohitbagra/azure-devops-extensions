import * as React from "react";
import { InputError } from "Common/Components/InputError";
import { Loading } from "Common/Components/Loading";

interface IAsyncComponentProps<T> {
    loader: () => Promise<T>;
    children: (data: T) => JSX.Element | null;
    errorComponent?: (error: string) => JSX.Element | null;
    loadingComponent?: () => JSX.Element | null;
}

interface IResolvedData<T> {
    loading: boolean;
    error?: string;
    data?: T;
}

export function AsyncComponent<T>(props: IAsyncComponentProps<T>) {
    const { children, loader, loadingComponent = renderLoading, errorComponent = renderError } = props;
    const [resolvedData, setResolvedData] = React.useState<IResolvedData<T>>({ loading: true });

    React.useEffect(() => {
        const promise = loader();
        let disposed = false;
        promise.then(
            data => {
                if (!disposed) {
                    setResolvedData({ loading: false, data: data });
                }
            },
            err => {
                if (!disposed) {
                    setResolvedData({ loading: false, error: err.message || err });
                }
            }
        );
        return () => {
            disposed = true;
        };
    }, []);

    const { loading, data, error } = resolvedData;
    if (loading) {
        return loadingComponent();
    } else if (error) {
        return errorComponent(error);
    } else if (data) {
        return children ? children(data) : null;
    } else {
        return null;
    }
}

function renderLoading(): JSX.Element {
    return <Loading />;
}

function renderError(error: string): JSX.Element {
    return <InputError error={error} />;
}

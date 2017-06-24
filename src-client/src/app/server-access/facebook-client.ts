import { autoTimeout } from '../components/common/utils/auto-timeout';

async function graphApiRaw<T>(url: string, errorName: string): Promise<T> {
    return autoTimeout({
        timeoutErrorMessage: 'Timeout: ' + errorName,
        errorMessage: 'Error: ' + errorName
    }, async () => {
        const r = await fetch(url, { method: 'GET' });
        const json = await r.json();

        if (json.error) {
            console.error(errorName + 'graphApi ERROR', json);
            throw '' + json.error;
        }

        const result = json as T;
        return result;
    });
}

async function graphApi<T>(url: string, errorName: string): Promise<T> {
    return ((await graphApiRaw(url, errorName)) as { data: T }).data;
}

export const facebookClient = {
    graphApiRaw,
    graphApi,
};
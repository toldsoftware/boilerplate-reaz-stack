

export function autoTimeout<T>(options: { time?: number, timeoutErrorMessage?: string, errorMessage?: string }, process: () => Promise<T>): Promise<T> {
    options = {
        time: options.time || 10000,
        timeoutErrorMessage: options.timeoutErrorMessage || 'Timeout',
        errorMessage: options.errorMessage || 'Error',
    };
    return new Promise<T>((resolve, reject) => {
        try {
            const id = setTimeout(() => {
                console.error(options.timeoutErrorMessage);
                reject(options.timeoutErrorMessage);
            }, options.time);
            process()
                .then(x => {
                    clearTimeout(id);
                    resolve(x);
                })
                .catch(err => {
                    clearTimeout(id);
                    console.error(options.errorMessage, err);
                    reject(err);
                });
        } catch (err) {
            console.error(options.errorMessage, err);
            reject(err);
        }
    });
}
export type LogMethod = (message: string, ...args: any[]) => void;

export const logger = {
    log: console && console.log && console.log.bind(console)
};

export function registerLog(req: { context: { log: LogMethod } }) {
    const r = req;
    if (r && r.context && r.context.log) {
        logger.log = r.context.log;
    }
}

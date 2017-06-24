import { registerLog, LogMethod } from "../../utils/logger";
import { runUpdater } from "./updater";

export function app(context: { log: LogMethod }) {
    registerLog({ context });
    runUpdater();
}
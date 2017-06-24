const INVERSE_TIME_BASE = 9999999999999;

export function inverseTime(time: number) {
    return INVERSE_TIME_BASE - time;
}

export function parseFacebookCreatedTime(facebookCreatedTime: string) {
    return Date.parse(facebookCreatedTime.replace('+0000', '+00:00'));
}
export function isMatch(search: string, item: any) {
    if (!search) { return true; }

    search = search.toLowerCase();

    for (let k in item) {
        const v = item[k];
        let s = (v + '').toLowerCase();
        if (s.indexOf(search) >= 0) {
            return true;
        }
    }

    return false;
}

export async function delay(time = 0) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

export function injectAds<TPost, TBusiness>(items: TPost[], adItems:TBusiness[]): (TPost|TBusiness)[] {

    const merged = items.slice() as (TPost|TBusiness)[];
    const bItems = adItems.map(x => ({ x: x, order: Math.random() })).sort((a, b) => a.order - b.order).map(x => x.x);

    const itemsPerBusiness = 7 + Math.floor(Math.random() * 3);
    const iFirstBusiness = 2 + Math.floor(Math.random() * 5);
    let bIndex = 0;

    for (let i = iFirstBusiness; i < merged.length; i += itemsPerBusiness + 1) {
        if (bIndex >= bItems.length) {
            break;
        }

        merged.splice(i, 0, bItems[bIndex++]);
    }

    merged.push(...bItems.slice(bIndex));

    return merged;
}

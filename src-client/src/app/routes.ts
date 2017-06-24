import * as RX from 'reactxp';

import { Store } from './store/store';

export function handleRoute() {
    if (RX.Platform.getType() !== 'web') { return; }

    const query = location.search;
    const m = query.match(/\Wpath=([^&]+)(?:&|$)/);
    const qPath = m && m[1];
    const path = qPath || location.pathname;

    console.log('handleRoute', { path });

    const parts = path.replace(/^\//,'').split('/');
    const page = (parts[0] || '').toLowerCase();

    // if (page === 'custom') {
    //     const id = parts[1];

    //     if (id) {
    //         Store.route_openCustomPage(id);
    //         return;
    //     }
    // }
}
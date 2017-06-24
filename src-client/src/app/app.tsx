import * as RX from 'reactxp';
import { Root } from './components/pages/root';
import { Store } from './store/store';
import { handleRoute } from "./routes";

const store = Store;

handleRoute();

export const App = () => (
    <Root store={store} />
);

import * as RX from 'reactxp';
import { App } from './app/app';

RX.App.initialize(true, true);
RX.UserInterface.setMainView(<App />);

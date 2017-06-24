import * as RX from 'reactxp';

export class SimpleComponentBase<T = {}, S = {}> extends RX.Component<T & { children?: JSX.Element | null }, S> {
    // constructor() {
    //     super();
    //     this.state = {} as any;
    // }
}

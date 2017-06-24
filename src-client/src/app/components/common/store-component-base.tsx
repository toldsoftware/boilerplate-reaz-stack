import * as RX from 'reactxp';
import { ComponentBase } from 'resub';
import { Debug } from './utils/debug';

export function storeComp<S>(buildStateCallback: () => S, renderCallback: (state: S) => JSX.Element | null) {
    return <StoreComponentBase buildStateCallback={buildStateCallback} renderCallback={renderCallback} />;
};

class StoreComponentBase extends ComponentBase<{
    buildStateCallback: () => any,
    renderCallback: (state: any) => JSX.Element | null
}, any> {

    protected _buildState(props: {}, initialBuild: boolean): any {
        return this.props.buildStateCallback();
    }

    render() {
        return this.props.renderCallback(this.state);
    }
}

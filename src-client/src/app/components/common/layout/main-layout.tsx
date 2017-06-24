import * as RX from 'reactxp';
import { SimpleComponentBase } from '../simple-component-base';

const styles = {
    fullRow: RX.Styles.createViewStyle({
        flexDirection: 'row',
        flex: 1,
    }),
    fullColumn: RX.Styles.createViewStyle({
        flexDirection: 'column',
        flex: 1,
    }),
};

export class MainLayout extends SimpleComponentBase<
    {
        backgroundColor?: string,
        // sideContent?: JSX.Element,
        headerContent?: JSX.Element,
        footerContent?: JSX.Element,
        footerHeight: number,
        onScrollReachEnd: () => void,
    }, {
        isExpanded?: boolean,
        isHeaderFixed?: boolean
    }> {

    private onScroll = () => {
        // From: https://stackoverflow.com/questions/1145850/how-to-get-height-of-entire-document-with-javascript
        const body = document.body;
        const html = document.documentElement;
        const contentHeight = Math.max(body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);

        const yTop = document.body.scrollTop;
        const viewHeight = document.body.clientHeight;
        const yBottom = yTop + viewHeight;

        // console.log('onScroll', { yBottom, contentHeight, viewHeight, yTop });

        if (yBottom > contentHeight - 100) {
            this.props.onScrollReachEnd && this.props.onScrollReachEnd();
        }
    };

    componentDidMount() {
        if (this.props.onScrollReachEnd) {
            window.addEventListener('scroll', this.onScroll);
            this.onScroll();
        }
    }

    componentWillUnmount() {
        if (this.props.onScrollReachEnd) {
            window.removeEventListener('scroll', this.onScroll);
        }
    }

    render() {
        return (
            <div style={`width:100%; height: 100%; background-color: ${this.props.backgroundColor}`}>
                <div style='width:100%'>
                    {this.props.headerContent}
                </div>
                <div style='width:100%; display:flex;'>
                    {/*<RX.View>
                        {this.props.sideContent}
                    </RX.View>*/}
                    <RX.View style={styles.fullColumn}>
                        {this.props.children}
                    </RX.View>
                </div>
                <div style={`height:${this.props.footerHeight}px;`}>
                    {/* Footer Placeholder - margin-bottom didn't work in Safari*/}
                </div>
                <AutoHideHeader>
                    {this.props.headerContent}
                </AutoHideHeader>
                <div style='position:fixed; bottom: 0; width: 100%;'>
                    {this.props.footerContent}
                </div>
            </div>
        );
    }
}

export class AutoHideHeader extends SimpleComponentBase<
    {
    }, {
        isVisible: boolean
        clonedChildren?: any,
    }> {

    constructor() {
        super();

        setTimeout(() => {
            this.state = {
                isVisible: false,
                clonedChildren: RX.Children.map(this.props.children, c => c),
            };
        });
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    private _lastScrollY = 0;
    handleScroll = (e: any) => {

        const scrollY = window.scrollY;
        const dy = scrollY - this._lastScrollY;

        const isVisible = this.state.isVisible;

        // Make invisible if negative scroll (mobile web)
        if (scrollY < 0) {
            if (isVisible) {
                this.setState({
                    isVisible: false
                });
            }
            return;
        }

        // Ignore small changes
        if (Math.abs(dy) < 100) {
            return;
        }

        this._lastScrollY = scrollY;

        if (!isVisible && dy < 0) {
            this.setState({
                isVisible: true
            });
        } else if (isVisible && dy > 0) {
            this.setState({
                isVisible: false
            });
        }

    }

    render() {
        return (this.state.isVisible &&
            <div style='position:fixed; top: 0; width: 100%;'>
                {this.state.clonedChildren}
            </div>
        );
    }
}
import * as RX from 'reactxp';
import { SimpleComponentBase } from '../simple-component-base';
import { StatusBar } from 'react-native';
import { colors } from "../../../styles";

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
        // Ignored
        footerHeight: number,

        onScrollReachEnd: () => void,
    }, {
        isExpanded?: boolean
    }> {


    private contentHeight = 0;
    private viewHeight = 0;

    private onContentSizeChange = (width: number, height: number) => {
        this.contentHeight = height;
    };

    private onLayout = (e: { height: number }) => {
        this.viewHeight = e.height;
    };

    private onScroll = (x: number, y: number) => {

        const contentHeight = this.contentHeight;
        const yTop = y;
        const viewHeight = this.viewHeight;
        const yBottom = yTop + viewHeight;

        console.log('onScroll', { yBottom, contentHeight, viewHeight, yTop });

        if (yBottom > contentHeight - 100) {
            this.props.onScrollReachEnd && this.props.onScrollReachEnd();
        }
    };

    render() {
        // TODO: Background color
        // TODO: Auto Hide Header
        RX.StatusBar.setBarStyle('light-content', false);
        // RX.StatusBar.setTranslucent(false);
        // RX.StatusBar.setHidden(false, 'fade');

        const styleStatusBarPlaceholder = RX.Platform.getType() === 'ios'
            ? RX.Styles.createViewStyle({
                height: (StatusBar.currentHeight || 20),
                backgroundColor: colors.back_headerBar,
            }, false)
            : RX.Styles.createViewStyle({
                height: 0,
                backgroundColor: colors.back_headerBar,
            }, false);

        return (
            <RX.View style={styles.fullColumn}>
                <RX.View style={styleStatusBarPlaceholder}>
                </RX.View>
                <RX.View>
                    {this.props.headerContent}
                </RX.View>
                <RX.View style={styles.fullRow}>
                    {/*<RX.View>
                        {this.props.sideContent}
                    </RX.View>*/}
                    <RX.View style={styles.fullColumn}>
                        <RX.ScrollView onContentSizeChange={this.onContentSizeChange} onLayout={this.onLayout} onScroll={this.onScroll}>
                            {this.props.children}
                        </RX.ScrollView>
                    </RX.View>
                </RX.View>
                <RX.View>
                    {this.props.footerContent}
                </RX.View>
            </RX.View>
        );
    }
}

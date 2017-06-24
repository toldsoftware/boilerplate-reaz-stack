import * as RX from 'reactxp';

const styles = {
    wrap: RX.Styles.createViewStyle({
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    }),
};

export const WrapContainer = (props: { children?: any }) => (
    <RX.View style={styles.wrap}>
        {props.children}
    </RX.View>
);
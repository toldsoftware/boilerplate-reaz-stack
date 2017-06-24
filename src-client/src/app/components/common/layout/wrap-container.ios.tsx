import * as RX from 'reactxp';

const styles = {
    wrap: RX.Styles.createViewStyle({
        flex: 1,
        flexDirection: 'column',
    }),
};

// Don't wrap, just make it column for mobile
// BUG: flexWrap does not work on mobile
// TODO: FIX this (maybe use a fixed column size?)
export const WrapContainer = (props: { children?: any }) => (
    <RX.View style={styles.wrap}>
        {props.children}
    </RX.View>
);
import * as RX from 'reactxp';

const onPressCache: { [address: string]: () => void } = {};
function createOnPress(address: string) {
    return onPressCache[address] = onPressCache[address] || (() => RX.Linking.launchEmail({ to: [address] }))
}

export const EmailLink = (props: { address: string, children?: any }) => (
    <RX.Button onPress={createOnPress(props.address)}>
        {props.children}
    </RX.Button>
);
import * as RX from 'reactxp';

const onPressCache: { [phone: string]: () => void } = {};
function createOnPress(phone: string) {
    return onPressCache[phone] = onPressCache[phone] || (() => RX.Linking.openUrl('tel:' + phone))
}

export const PhoneLink = (props: { phone: string, children?: any }) => (
    <RX.Button onPress={createOnPress(props.phone)}>
        {props.children}
    </RX.Button>
);
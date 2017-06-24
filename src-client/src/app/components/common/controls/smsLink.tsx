import * as RX from 'reactxp';

const onPressCache: { [phone: string]: () => void } = {};
function createOnPress(phone: string) {
    return onPressCache[phone] = onPressCache[phone] || (() => RX.Linking.launchSms({phoneNumber:phone}))
}

export const SmsLink = (props: { phone: string, children?: any }) => (
    <RX.Button onPress={createOnPress(props.phone)}>
        {props.children}
    </RX.Button>
);
import * as RX from 'reactxp';

export const ButtonLink = (props: { url: string, children?: any }) => (
    <RX.Button onPress={()=>RX.Linking.openUrl(props.url)}>
        {props.children}
    </RX.Button>
);
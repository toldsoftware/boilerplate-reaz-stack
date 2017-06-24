import * as RX from 'reactxp';

export const ButtonLink = (props: { url: string, children?: any }) => (
    <RX.Link url={props.url}>
        {props.children}
    </RX.Link>
);
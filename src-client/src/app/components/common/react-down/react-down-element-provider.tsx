import * as RX from 'reactxp';
import { CircleSolidIcon } from '../icons/circle-solid';
import { styles } from './styles';

export interface ReactDownEventHandlerProvider {
    onLinkPress: (url: string) => void;
};

export type ReactDownElementProvider = {
    [kind: string]: (props: any, children: any, provider: ReactDownProvider) => JSX.Element;
};

export type ReactDownProvider = ReactDownEventHandlerProvider & ReactDownElementProvider;

export const defaultElementProvider: ReactDownElementProvider = {

    section: (props: { level: number }, children: any) => {
        const s = styles.headings[props.level] || styles.headings[0];
        return (<RX.View style={s.section}>{children}</RX.View>);
    },
    heading: (props: { text: string, level: number }) => {
        const s = styles.headings[props.level] || styles.headings[0];
        return (<RX.View style={s.view}><RX.Text style={s.text}>{props.text}</RX.Text></RX.View>);
    },

    paragraph: (props: {}, children: any) => {
        return (<RX.View style={styles.paragraph}>{children}</RX.View>);
    },
    text: (props: { text: string }) => {
        return (<RX.Text style={styles.text}> {props.text} </RX.Text>);
    },
    inlineLink: (props: { text: string, url: string }, _: any, provider: ReactDownEventHandlerProvider) => {
        return (<RX.Button style={styles.inlineLink} onPress={() => provider.onLinkPress(props.url)}>
            <RX.Text style={styles.inlineLink_text}>{props.text}</RX.Text>
        </RX.Button>);
    },

    loneLink: (props: { text: string, url: string }, _: any, provider: ReactDownEventHandlerProvider) => {
        return (
            <RX.View style={styles.loneLink_view}>
                <RX.Button style={styles.loneLink_link} onPress={() => provider.onLinkPress(props.url)}>
                    <RX.Text style={styles.loneLink_text}>{props.text}</RX.Text>
                </RX.Button>
            </RX.View>
        );
    },

    list: (props: {}, children: any) => {
        return (<RX.View style={styles.list}>{children}</RX.View>);
    },
    item: (props: { text: string }) => {
        return (
            <RX.View style={styles.listItem_view}>
                <CircleSolidIcon style={styles.listItem_icon} /><RX.Text style={styles.listItem}>{props.text}</RX.Text>
            </RX.View>
        );
    },
};

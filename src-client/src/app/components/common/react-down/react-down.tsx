import * as RX from 'reactxp';

import { SimpleComponentBase } from '../simple-component-base';
import { parseTemplate, ReactDownDom, ReactDownDomPart, ReactDownDomSection } from './react-down-dom';
import {
    defaultElementProvider,
    ReactDownElementProvider,
    ReactDownEventHandlerProvider,
    ReactDownProvider,
} from './react-down-element-provider';

const domCache: { [template: string]: ReactDownDom } = {};

export class ReactDown extends SimpleComponentBase<{ template: string, provider?: ReactDownElementProvider }, {
    page: string
}>{
    render() {
        const props = this.props;
        const state = this.state;

        const template = props.template;
        const dom = domCache[template] = domCache[template] || parseTemplate(template);

        const provider: ReactDownProvider = (props.provider || defaultElementProvider) as ReactDownProvider;
        provider.onLinkPress = provider.onLinkPress || ((url) => {
            const pages = dom.pages.filter(p => p.page === url);
            if (pages.length) {
                this.setState({
                    page: pages[0].page,
                });
            } else {
                RX.Linking.openUrl(url);
            }
        });

        const pageId = state.page;
        const page = dom.pages.filter(p => p.page === pageId)[0] || dom.pages[0];
        return (
            <RX.View>
                {page.children.map(c => <ReactDownPart part={c} provider={provider} />)}
            </RX.View>
        );

        // // DEBUG Show all Pages
        // return (
        //     <RX.View>
        //         {dom.pages.map(x => (
        //             <RX.View>
        //                 <RX.Text style={pageStyle}>Page: {x.props.text}</RX.Text>
        //                 <RX.View>
        //                     {x.children.map(p => <ReactDownPart part={p} provider={provider} />)}
        //                 </RX.View>
        //             </RX.View>
        //         ))}
        //         {/*<RX.View>
        //         <div style='white-space: pre-wrap;'>{JSON.stringify(dom, null, '  ')}</div>
        //     </RX.View>*/}
        //     </RX.View>
        // );
    }
}

// export const ReactDown = (props: { template: string, provider?: ReactDownElementProvider }) => {
//     const template = props.template;
//     const instance = domCache[template] = domCache[template] || { dom: parseTemplate(template), page: null };
//     const dom = instance.dom;

//     const provider: ReactDownProvider = (props.provider || defaultElementProvider) as ReactDownProvider;
//     provider.onLinkPress = provider.onLinkPress || ((url) => {
//         const pages = dom.pages.filter(p => p.page === url);
//         if (pages.length) {
//             instance.page = pages[0].page;
//         }
//     });

//     const pageId = instance.page;
//     const page = dom.pages.filter(p => p.page === pageId)[0] || dom.pages[0];
//     return (
//         <RX.View>
//             {page.children.map(c => <ReactDownPart part={c} provider={provider} />)}
//         </RX.View>
//     );

//     // // TEMP
//     // return (
//     //     <RX.View>
//     //         {dom.pages.map(x => (
//     //             <RX.View>
//     //                 <RX.Text style={pageStyle}>Page: {x.props.text}</RX.Text>
//     //                 <RX.View>
//     //                     {x.children.map(p => <ReactDownPart part={p} provider={provider} />)}
//     //                 </RX.View>
//     //             </RX.View>
//     //         ))}
//     //         {/*<RX.View>
//     //             <div style='white-space: pre-wrap;'>{JSON.stringify(dom, null, '  ')}</div>
//     //         </RX.View>*/}
//     //     </RX.View>
//     // );
// };

const ReactDownPart = (props: { part: ReactDownDomPart, provider: ReactDownProvider }): any => (
    render({
        part: props.part,
        provider: props.provider,
        children: (props.part.children && props.part.children.map(p => <ReactDownPart part={p} provider={props.provider} />))
    })
);

const pageStyle = RX.Styles.createViewStyle({
    marginTop: 24,
    marginLeft: 24,
    borderColor: '#888888',
    borderStyle: 'solid',
    borderTopWidth: 3,
    borderBottomWidth: 1,
});

const indentStyle = RX.Styles.createViewStyle({
    marginLeft: 24,
});

const render = (props: { part: ReactDownDomPart, provider: ReactDownProvider, children: any }) => {
    const p = props.provider[props.part.kind];

    console.log('render', { name: p && (p as any).name, kind: props.part.kind, part: props.part, p, children: props.children })

    if (p) {
        return p(props.part.props, props.children, props.provider);
    } else {
        return (
            <RX.View style={indentStyle}>
                <RX.View>{JSON.stringify(props.part)}</RX.View>
                {props.children}
            </RX.View>
        );
    }
};

import { storeComp } from '../common/store-component-base';
import * as RX from 'reactxp';
import { HomePage } from './home-page';
import { Store } from '../../store/store';
import { NewsPage } from "./news-page";
import { PageLayout } from "./page-layout";

export const Root = (props: { store: Store }) => storeComp(() => ({
    page: props.store.getPage()
}), (state) => {
    switch (state.page) {
        case 'Empty': return <EmptyPage store={props.store} />
        case 'Newsfeed': return <NewsPage store={props.store} />
        default: return <HomePage store={props.store} />
    }
});


export const EmptyPage = (props: { store: Store }) => (
    <PageLayout store={props.store} postsStore={props.store}>
        <RX.View >
        </RX.View>
    </PageLayout>
);
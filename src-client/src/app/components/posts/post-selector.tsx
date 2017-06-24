import { FacebookPost } from '../../server-access/facebook-access';
import { CircleOpenIcon } from '../common/icons/circle-open';
import { styles } from '../../styles';
import * as RX from 'reactxp';
import { Store } from '../../store/store';
import { FacebookFeedPost } from "./facebook-feed-post";
import { PostItem } from "../../store/posts-store-base";

export const PostSelector = (props: { store: Store, item: PostItem }) => {

    switch (props.item.kind) {
        case 'FacebookPost': return <FacebookFeedPost store={props.store} item={props.item} />

        // Should never happen
        default: return <GenericPost store={props.store} item={props.item} />
    }
};

export const GenericPost = (props: { store: Store, item: PostItem }) => {
    const x = props.item;
    return (
        <RX.View style={styles.postPanel}>
            <RX.View style={styles.fullRow}>
                <RX.View style={styles.postIcon_padding}>
                    <CircleOpenIcon style={styles.postIcon} />
                </RX.View>
                <RX.View style={styles.fullColumn}>
                    <RX.View><RX.Text style={styles.postTitle_text}>{x.kind}</RX.Text></RX.View>
                </RX.View>
            </RX.View>
            <RX.View style={styles.postContent_section}>
                {Object.getOwnPropertyNames(x).filter(k => k !== 'kind').map((k, i) => (
                    <RX.View key={i}>
                        <RX.Text style={styles.postContent_section_text}>{(x as any)[k] + ''}</RX.Text>
                    </RX.View>
                ))}
            </RX.View>
        </RX.View>
    );
};

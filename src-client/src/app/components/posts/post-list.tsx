import { Store } from '../../store/store';
import * as RX from 'reactxp';
import { PostSelector } from "./post-selector";
import { styles } from "../../styles";
import { PostItem } from "../../store/posts-store-base";

export const PostList = (props: { store: Store, items: PostItem[] }) => (
    <RX.View style={styles.postList}>
        {props.items.map((x, i) => (
            <RX.View style={styles.postItem} key={i}>
                <PostSelector store={props.store} item={x} />
            </RX.View>
        ))}
    </RX.View>
);

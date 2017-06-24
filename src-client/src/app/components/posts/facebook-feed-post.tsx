import { HomeIcon } from '../common/icons/home';
import { storeComp } from '../common/store-component-base';
import * as RX from 'reactxp';
import { Store } from '../../store/store';
import { styles } from "../../styles";
import { SizedImage } from "../common/controls/sized-image";
import { PhoneButton, MapButton, WebButton, PhoneActionItem, PhoneDisabledActionItem, FaxDisabledActionItem, AddressActionItem, WebActionItem } from "./post-common";
import { WrapContainer } from "../common/layout/wrap-container";
import { FacebookPost, FacebookProfile } from '../../server-access/facebook-access';

export const FacebookFeedPost = (props: { store: Store, item: FacebookPost }) => {

    return (
        <RX.View style={[styles.postPanel, styles.sponsored]}>
            {/* Post Header */}
            <RX.Button onPress={() => RX.Linking.openUrl(props.item.permalink_url)}>
                <RX.View style={styles.fullRow}>
                    <RX.View style={styles.postIcon_padding}>
                        <RX.Image source={props.item.from.picture.data.url} style={styles.postProfilePicture} />
                    </RX.View>
                    <RX.View style={styles.fullColumn}>
                        <RX.View><RX.Text style={styles.postTitle_text}>{props.item.from.name}</RX.Text></RX.View>
                        <RX.View><RX.Text style={styles.postInfo_text}>{formatTime(props.item.created_time)}</RX.Text></RX.View>
                    </RX.View>
                </RX.View>
            </RX.Button>
            {/* Post Body */}
            <RX.View style={[styles.fullColumn]}>
                {/*Description*/}
                {!!props.item.message && (
                    <RX.View style={styles.fullRow}>
                        <RX.View style={styles.postContent_section}>
                            <RX.Text style={styles.postContent_section_text}>{props.item.message}</RX.Text>
                        </RX.View>
                    </RX.View>
                )}
                {!!props.item.full_picture && (
                    <RX.View style={[styles.fullRow, styles.center_content]}>
                        <SizedImage style={styles.postImage} source={props.item.full_picture} maxWidth={styles.postImage_maxWidth} />
                    </RX.View>
                )}
                {!!props.item.caption && (
                    <RX.View style={styles.fullRow}>
                        <RX.View style={styles.postContent_section}>
                            <RX.Text style={styles.postContent_section_caption_text}>{props.item.caption}</RX.Text>
                        </RX.View>
                    </RX.View>
                )}
                {!!props.item.description && (
                    <RX.View style={styles.fullRow}>
                        <RX.View style={styles.postContent_section}>
                            <RX.Text style={styles.postContent_section_details_text}>{props.item.description}</RX.Text>
                        </RX.View>
                    </RX.View>
                )}
            </RX.View>

            {/*Stats*/}
            {props.item.shares && props.item.shares.count && (
                <RX.View style={[styles.fullColumn, styles.postStats_view]}>
                    <RX.View style={[styles.postContent_section, styles.fullRow]}>
                        <RX.Text style={styles.postContent_section_details_text}>{props.item.shares.count} shares </RX.Text>
                        <RX.Text style={styles.postContent_section_details_text}>{props.item.comments && props.item.comments.data && props.item.comments.data.length || 0} comments </RX.Text>
                    </RX.View>
                </RX.View>
            )}
            {props.item.comments && props.item.comments.data && props.item.comments.data.length && (
                <RX.View style={[styles.fullColumn, styles.postStats_view]}>
                    {props.item.comments.data.map(c => (
                        <Comment key={c.id} comment={c} />
                    ))}
                </RX.View>
            )}
            {/*Actions*/}
            <RX.View style={styles.right_content}>
                <RX.Button style={styles.action_button} onPress={() => RX.Linking.openUrl(props.item.permalink_url)}>
                    <RX.Text style={styles.action_button_text}>
                        Open in Facebook
                    </RX.Text>
                </RX.Button>
            </RX.View>
        </RX.View>
    );
};

export const Comment = (props: { comment: { from: FacebookProfile, message: string, created_time: string }, key?: any }) => (
    <RX.View style={[styles.postContent_section, styles.fullRow]}>
        <RX.Image source={props.comment.from.picture.data.url} style={styles.postProfilePicture} />
        <RX.View style={styles.fullColumn}>
            <RX.View style={styles.flex1}>
                <RX.Text style={styles.postContent_comment_message_text}>
                    <RX.Text style={styles.postContent_comment_name_text}>{props.comment.from.name} </RX.Text>
                    {props.comment.message}
                </RX.Text>
            </RX.View>
            <RX.Text style={styles.postContent_comment_info_text}>{formatTime(props.comment.created_time)}</RX.Text>
        </RX.View>
    </RX.View>
);

export function formatTime(time: string) {
    const d = new Date(Date.parse(time.replace('+0000', '+00:00')));
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

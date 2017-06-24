import * as RX from 'reactxp';
import { colors, styles } from '../../styles';
import { PhoneIcon } from "../common/icons/phone";
import { CircleOpenIcon } from "../common/icons/circle-open";
import { CompassIcon } from "../common/icons/compass";
import { AddressCardIcon } from "../common/icons/address-card";
import { FaxIcon } from "../common/icons/fax";
import { WebIcon } from "../common/icons/web";
import { FamilyIcon } from "../common/icons/family";
import { FitnessIcon } from "../common/icons/fitness";
import { BankIcon } from "../common/icons/bank";
import { HealthIcon } from "../common/icons/health";
import { EducationIcon } from "../common/icons/education";
import { ChurchIcon } from "../common/icons/church";
import { BedIcon } from "../common/icons/bed";
import { LegalIcon } from "../common/icons/legal";
import { FoodIcon } from "../common/icons/food";
import { TruckIcon } from "../common/icons/truck";
import { PhoneLink } from "../common/controls/phoneLink";
import { SmsLink } from "../common/controls/smsLink";
import { SmsIcon } from "../common/icons/sms";
import { ButtonLink } from "../common/controls/button-link";
import { EmailIcon } from "../common/icons/email";
import { EmailLink } from "../common/controls/emailLink";


export type Address = {
    // From FB
    single_line_address?: string;
    location?: {
        latitude: number;
        longitude: number;
    };

    // Directory Data
    addressLine1?: string;
    addressLine2?: string;
    addressLine3?: string;
    addressLine4?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    mapAddress?: string;
};

export const AddressActionItem = (props: { item: Address }) => (
    !!props.item.single_line_address ?
        <AddressActionItem_Single item={props.item} />
        : <AddressActionItem_Parts item={props.item} />
);


const AddressActionItem_Single = (props: { item: Address }) => (!!props.item.single_line_address && (
    <ItemWithAction action={<MapButton address={props.item.single_line_address} location={props.item.location} />}>
        <RX.View><RX.Text style={styles.postContent_section_text}>{props.item.single_line_address}</RX.Text></RX.View>
    </ItemWithAction>
));

const AddressActionItem_Parts = (props: { item: Address }) => (!!props.item.addressLine1 && (
    <ItemWithAction action={<MapButton address={props.item.mapAddress} />}>
        <RX.View><RX.Text style={styles.postContent_section_text}>{props.item.addressLine1}</RX.Text></RX.View>
        <RX.View><RX.Text style={styles.postContent_section_text}>{props.item.addressLine2}</RX.Text></RX.View>
        <RX.View><RX.Text style={styles.postContent_section_text}>{props.item.addressLine3}</RX.Text></RX.View>
        <RX.View><RX.Text style={styles.postContent_section_text}>{props.item.addressLine4}</RX.Text></RX.View>
        {(!props.item.country || props.item.country === 'United States') && (
            <RX.View><RX.Text style={styles.postContent_section_text}>
                {props.item.city} {props.item.state}, {props.item.zipCode}
            </RX.Text></RX.View>
        )}
        {props.item.country !== 'United States' && (
            <RX.View><RX.Text style={styles.postContent_section_text}>{props.item.country}</RX.Text></RX.View>
        )}
    </ItemWithAction>
));

export const EmailActionItem = (props: { value: string, label?: string }) => (!!props.value && (
    <ItemWithAction action={<EmailButton address={props.value} />}>
        <RX.Text style={styles.postContent_section_text}>{props.label || props.value}</RX.Text>
    </ItemWithAction>
));

export const WebActionItem = (props: { value: string, label?: string }) => (!!props.value && (
    <ItemWithAction action={<WebButton url={props.value} />}>
        <RX.Text style={styles.postContent_section_text}>{props.label || props.value}</RX.Text>
    </ItemWithAction>
));

export const PhoneActionItem = (props: { value: string, label?: string }) => (!!props.value && (
    <ItemWithAction action={<RX.View style={styles.row}><SmsButton phone={props.value} /><PhoneButton phone={props.value} /></RX.View>}>
        <RX.Text style={styles.postContent_section_text}>{props.label || props.value}</RX.Text>
    </ItemWithAction>
));

export const PhoneDisabledActionItem = (props: { value: string, label?: string }) => (!!props.value && (
    <ItemWithAction action={<PhoneIcon style={styles.postIcon_action_disabled} />}>
        <RX.Text style={styles.postContent_section_text}>{props.label || props.value}</RX.Text>
    </ItemWithAction>
));

export const FaxDisabledActionItem = (props: { value: string, label?: string }) => (!!props.value && (
    <ItemWithAction action={<FaxIcon style={styles.postIcon_action_disabled} />}>
        <RX.Text style={styles.postContent_section_text}>{props.label || props.value}</RX.Text>
    </ItemWithAction>
));

export const ItemWithAction = (props: { children?: any, action?: any }) => (
    <RX.View style={styles.fullRow}>
        <RX.View style={styles.postContent_section}>
            {props.children}
        </RX.View>
        <RX.View style={styles.postContent_action}>
            {props.action}
        </RX.View>
    </RX.View>
);

const styleEmailIcon = { ...styles.postIcon_action, fillColor: colors.actionIcons.h_teal };
export const EmailButton = (props: { address: string }) => {
    return props.address && (
        <EmailLink address={props.address} >
            <EmailIcon style={styleEmailIcon} />
        </EmailLink>
    );
};

const styleWebIcon = { ...styles.postIcon_action, fillColor: colors.actionIcons.g_green };
export const WebButton = (props: { url: string }) => {
    return props.url && (
        <ButtonLink url={props.url} >
            <WebIcon style={styleWebIcon} />
        </ButtonLink>
    );
};

const styleSmsIcon = { ...styles.postIcon_action, fillColor: colors.actionIcons.a_purple };
export const SmsButton = (props: { phone: string }) => {
    return props.phone && (
        <SmsLink phone={props.phone} >
            <SmsIcon style={styleSmsIcon} />
        </SmsLink>
    );
};

const stylePhoneIcon = { ...styles.postIcon_action, fillColor: colors.actionIcons.b_red };
export const PhoneButton = (props: { phone: string }) => {
    return props.phone && (
        <PhoneLink phone={props.phone} >
            <PhoneIcon style={stylePhoneIcon} />
        </PhoneLink>
    );
};

type Location = {
    longitude: number;
    latitude: number;
};

const styleMapIcon = { ...styles.postIcon_action, fillColor: colors.actionIcons.d_orange_yellow };
// export const MapButton = (props: { address: string, location?: Location }) => {

//     const location = props.location;

//     return props.address && (location.longitude ? (
//         <ButtonLink url={`http://maps.apple.com/?address=${props.address}&ll=${location.latitude},${location.longitude}`} >
//             <CompassIcon style={styleMapIcon} />
//         </ButtonLink>
//     ) : (
//             <ButtonLink url={`http://maps.apple.com/?address=${props.address}`} >
//                 <CompassIcon style={styleMapIcon} />
//             </ButtonLink>
//         ));
// };

export const MapButton = (props: { address: string, location?: Location }) => {

    return props.address && (
        <ButtonLink url={`http://maps.apple.com/?address=${props.address}`} >
            <CompassIcon style={styleMapIcon} />
        </ButtonLink>
    );
};

const iconStyles = {
    default: styles.postIcon,
    a: { ...styles.postIcon, fillColor: colors.sectionIcons.a_purple },
    b: { ...styles.postIcon, fillColor: colors.sectionIcons.b_red },
    c: { ...styles.postIcon, fillColor: colors.sectionIcons.c_orange },
    d: { ...styles.postIcon, fillColor: colors.sectionIcons.d_orange_yellow },
    e: { ...styles.postIcon, fillColor: colors.sectionIcons.e_yellow },
    f: { ...styles.postIcon, fillColor: colors.sectionIcons.f_yellow_green },
    g: { ...styles.postIcon, fillColor: colors.sectionIcons.g_green },
    h: { ...styles.postIcon, fillColor: colors.sectionIcons.h_teal },
};


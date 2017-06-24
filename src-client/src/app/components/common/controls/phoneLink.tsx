import * as RX from 'reactxp';
import { ButtonLink } from "./button-link";

export const PhoneLink = (props: { phone: string, children?: any }) => (
    <ButtonLink url={`tel:${props.phone}`}>
        {props.children}
    </ButtonLink>
);
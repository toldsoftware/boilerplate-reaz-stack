import * as RX from 'reactxp';
import ImageSvg, { SvgPath } from 'reactxp-imagesvg';
import { IconBase, IconProps } from './icon-base';

export const BusinessIcon = (props: IconProps) => (
    <IconBase viewBox='0 -2 40 40' {...props} >
        <SvgPath strokeColor={props.style.strokeColor} fillColor={props.style.fillColor} 
            // tslint:disable-next-line:max-line-length
            d='m30 25v3.4h-3.4v-3.4h3.4z m0-6.6v3.2h-3.4v-3.2h3.4z m3.4 13.2v-16.6h-13.4v3.4h3.4v3.2h-3.4v3.4h3.4v3.4h-3.4v3.2h13.4z m-16.8-20v-3.2h-3.2v3.2h3.2z m0 6.8v-3.4h-3.2v3.4h3.2z m0 6.6v-3.4h-3.2v3.4h3.2z m0 6.6v-3.2h-3.2v3.2h3.2z m-6.6-20v-3.2h-3.4v3.2h3.4z m0 6.8v-3.4h-3.4v3.4h3.4z m0 6.6v-3.4h-3.4v3.4h3.4z m0 6.6v-3.2h-3.4v3.2h3.4z m10-20h16.6v23.4h-33.2v-30h16.6v6.6z'
        />
    </IconBase>
);

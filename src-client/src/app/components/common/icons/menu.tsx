import * as RX from 'reactxp';
import ImageSvg, { SvgPath } from 'reactxp-imagesvg';
import { IconBase, IconProps } from './icon-base';

export const MenuIcon = (props: IconProps) => (
    <IconBase viewBox='0 0 40 40' {...props} >
        <SvgPath strokeColor={props.style.strokeColor} fillColor={props.style.fillColor}
            // tslint:disable-next-line:max-line-length
            d='m5 10h30v3.4h-30v-3.4z m0 11.6v-3.2h30v3.2h-30z m0 8.4v-3.4h30v3.4h-30z'
        />
    </IconBase>
);

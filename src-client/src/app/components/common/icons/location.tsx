import * as RX from 'reactxp';
import ImageSvg, { SvgPath } from 'reactxp-imagesvg';
import { IconBase, IconProps } from './icon-base';

export const LocationIcon = (props: IconProps) => (
    <IconBase viewBox='0 0 40 40' {...props} >
        <SvgPath strokeColor={props.style.strokeColor} fillColor={props.style.fillColor} 
            // tslint:disable-next-line:max-line-length
            d='m20 0c-6.9 0-12.5 5.6-12.5 12.5s6.3 16.3 12.5 27.5c6.3-11.2 12.5-20.6 12.5-27.5s-5.6-12.5-12.5-12.5z m0 17.5c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z'
        />
    </IconBase>
);

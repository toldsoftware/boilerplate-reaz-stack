import * as RX from 'reactxp';
import ImageSvg, { SvgPath } from 'reactxp-imagesvg';
import { IconBase, IconProps } from './icon-base';

export const FeedbackIcon = (props: IconProps) => (
    <IconBase viewBox='0 0 40 40' {...props} >
        <SvgPath strokeColor={props.style.strokeColor} fillColor={props.style.fillColor} 
            // tslint:disable-next-line:max-line-length
            d='m21.6 16.6v-6.6h-3.2v6.6h3.2z m0 6.8v-3.4h-3.2v3.4h3.2z m11.8-20q1.3 0 2.3 0.9t0.9 2.3v20q0 1.4-0.9 2.4t-2.3 1h-23.4l-6.6 6.6v-30q0-1.3 0.9-2.3t2.3-0.9h26.8z'
        />
    </IconBase>
);

import * as RX from 'reactxp';
import ImageSvg, { SvgPath } from 'reactxp-imagesvg';
import { IconBase, IconProps } from './icon-base';

export const ClearIcon = (props: IconProps) => (
    <IconBase viewBox='0 0 40 40' {...props} >
        <SvgPath strokeColor={props.style.strokeColor} fillColor={props.style.fillColor} 
            // tslint:disable-next-line:max-line-length
            d='m31.6 10.7l-9.3 9.3 9.3 9.3-2.3 2.3-9.3-9.3-9.3 9.3-2.3-2.3 9.3-9.3-9.3-9.3 2.3-2.3 9.3 9.3 9.3-9.3z'
        />
    </IconBase>
);

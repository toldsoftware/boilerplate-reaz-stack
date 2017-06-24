import * as RX from 'reactxp';
import ImageSvg, { SvgPath } from 'reactxp-imagesvg';

export interface IconStyle {
    fontSize: number;
    padding: number;
    // width?: number;
    // height?: number;
    strokeColor?: string;
    fillColor?: string;
}

export function createIconStyle(style: IconStyle) { return style; }
export type IconProps = { style: IconStyle };

// {props.style.strokeColor}
// {props.style.fillColor} 
export const IconBase = (props: IconProps & { viewBox: string, children?: JSX.Element | null }) => {
    // console.log('IconBase', props.children);
    return (
        <ImageSvg
            height={props.style.fontSize + props.style.padding * 2}
            width={props.style.fontSize + props.style.padding * 2}
            viewBox={props.viewBox}
        >
            {props.children}
        </ImageSvg>
    );
};

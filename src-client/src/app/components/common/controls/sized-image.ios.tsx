import { SimpleComponentBase } from '../simple-component-base';
import * as RX from 'reactxp';
import { Image } from 'react-native';
import { getSize } from "./sized-image-common";

export class SizedImage extends SimpleComponentBase<{ source: string, style: RX.Types.ImageStyle, maxWidth: number }, { width: number, height: number }>{

    hasLoaded = false;
    hasMounted = false;

    getSize = () => {
        if (!this.hasLoaded || !this.hasMounted) { return; }

        const img = this.refs['img'] as RX.Image;
        const w = img.getNativeWidth();
        const h = img.getNativeHeight();

        if (w) {
            this.setState(getSize(w, h, this.props.maxWidth));

            //   setTimeout(() => {
            //         const d = (<RX.View><RX.Text>Size (ReactXP): {w} {h}</RX.Text></RX.View>);
            //         RX.Modal.show(d, 'Test');
            //     }, 3000);
        } else {
            // BUG FIX
            Image.getSize(this.props.source, (width: number, height: number) => {
                this.setState(getSize(width, height, this.props.maxWidth));

                // setTimeout(() => {
                //     const d = (<RX.View><RX.Text>Size (React-Native): {width} {height}</RX.Text></RX.View>);
                //     RX.Modal.show(d, 'Test');
                // }, 3000);
            });
        }
    };

    onImageLoad = () => {
        this.hasLoaded = true;
        this.getSize();
    };

    componentDidMount() {
        this.hasMounted = true;
        this.getSize();
    }

    render() {

        const w = this.state && this.state.width || 50;
        const h = this.state && this.state.height || 50;
        const s = RX.Styles.createViewStyle({
            width: w,
            height: h,
        }, false);

        return (
            <RX.View style={s}>
                <RX.Image ref='img' source={this.props.source} style={this.props.style} onLoad={this.onImageLoad} />
            </RX.View>
        );
    }
}
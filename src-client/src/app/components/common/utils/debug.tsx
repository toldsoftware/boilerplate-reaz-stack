import * as RX from 'reactxp';

// export const Debug = null as any;

let renderId = 0;
export const Debug = () => (
    <RX.Text>
        {'R' + renderId++}
    </RX.Text>
);

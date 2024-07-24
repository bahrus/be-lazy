import {BeHive, EMC, seed, MountObserver} from 'be-hive/be-hive.js';

export const emc: EMC = {
    base: 'be-lazy',
    map:{
        '0.0':{
            instanceOf: 'Object',
            mapsTo: '.',
            valIfFalsy: {},
        }
    },
    enhPropKey: 'beLazy',
    importEnh: async () => {
        const {BeLazy} = await import('./be-lazy.js');
        return BeLazy;
    }
}

const mose = seed(emc);

MountObserver.synthesize(document, BeHive, mose);
// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
/** @import {EMC} from './ts-refs/trans-render/be/types.d.ts' */
/**
 * @type {EMC}
 */
export const emc = {
    base: 'be-lazy',
    map: {
        '0.0': {
            instanceOf: 'Object',
            mapsTo: '.',
            valIfFalsy: {},
        }
    },
    enhPropKey: 'beLazy',
    importEnh: async () => {
        const { BeLazy } = 
        /** @type {{new(): IEnhancement<Element>}} */ 
        /** @type {any} */
        (await import('./be-lazy.js'));
        return BeLazy;
    }
};
const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);

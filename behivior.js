import { seed } from 'be-hive/be-hive.js';
export const emc = {
    base: 'be-lazy',
    map: {},
    enhPropKey: 'beLazy',
    importEnh: async () => {
        const { BeLazy } = await import('./be-lazy.js');
        return BeLazy;
    }
};
const mose = seed(emc);

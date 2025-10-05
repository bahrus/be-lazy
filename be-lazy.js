// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BeIntersectional } from 'be-intersectional/be-intersectional.js';
/** @import {BEConfig} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {IEnhancement, BEAllProps} from './ts-refs/trans-render/be/types.d.ts' */
/** @import {BeLazyActions, PAP, AllProps, AP, BAP} from './ts-refs/be-lazy/types' */;

/**
 * @implements {BeLazyActions}
 */
class BeLazy extends BeIntersectional {
    /**
     * @type {BEConfig<AP & BEAllProps, BeLazyActions & IEnhancement, any>}
     */
    static config = {
        propDefaults: {
            options: {
                threshold: 0,
                rootMargin: '0px',
            },
            enterDelay: 16,
            exitDelay: 16,
        },
        propInfo: {
            ...propInfo,
            isIntersecting: {
                def: false,
            },
            isIntersectingEcho: {
                def: false,
            }
        },
        positractions: [
            resolved, rejected
        ],
        compacts: {
            when_options_changes_call_onOptions: 0,
            negate_isIntersecting_to_isNotIntersecting: 0,
        },
        actions: {
            onIntersecting: {
                ifAllOf: ['isIntersecting'],
                ifEquals: ['isIntersecting', 'isIntersectingEcho'],
            },
            // onIntersectingChange: {
            //     ifKeyIn: ['isIntersecting']
            // },
            // onNotIntersecting: {
            //     ifEquals: ['isNotIntersecting', 'isNotIntersectingEcho']
            // },
            // onNotIntersectingEcho: {
            //     ifKeyIn: ['isIntersectingEcho'],
            // }
        }
    };

    /**
     * 
     * @param {BAP} self 
     */
    async onIntersecting(self) {
        const { enhancedElement, exitDelay } = self;
        const { localName, nextElementSibling } = enhancedElement;
        switch (localName) {
            case 'template':
                const templ = enhancedElement;
                const clone = templ.content.cloneNode(true);
                enhancedElement.after(clone);
                this.disconnect();
                if (exitDelay !== undefined && exitDelay >= 0) {
                    setTimeout(() => {
                        enhancedElement.remove();
                    }, exitDelay);
                }
                else {
                    enhancedElement.remove();
                }
                break;
            case 'meta':
                throw 'NI';
                break;
        }
    }
}
await BeLazy.bootUp();
export { BeLazy };

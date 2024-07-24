import { config as beCnfg } from 'be-enhanced/config.js';
import { BeIntersectional } from 'be-intersectional/be-intersectional.js';
class BeLazy extends BeIntersectional {
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
            ...beCnfg.propInfo,
            isIntersecting: {
                def: false,
            },
            isIntersectingEcho: {
                def: false,
            }
        },
        positractions: [...beCnfg.positractions],
        compacts: {
            when_options_changes_invoke_onOptions: 0,
        },
        actions: {
            onIntersecting: {
                ifAllOf: ['isIntersecting'],
                ifEquals: ['isIntersecting', 'isIntersectingEcho'],
            },
            onIntersectingChange: {
                ifKeyIn: ['isIntersecting']
            },
            onNotIntersecting: {
                ifEquals: ['isNotIntersecting', 'isIntersectingEcho']
            },
            onNotIntersectingEcho: {
                ifKeyIn: ['isIntersectingEcho'],
            }
        }
    };
    onNotIntersecting(self) {
    }
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

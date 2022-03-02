import { define } from 'be-decorated/be-decorated.js';
export class BeLazy {
    #target;
    #observer;
    intro(proxy, target, beDecorProps) {
        this.#target = target;
    }
    onOptions({ options, proxy, enterDelay }) {
        this.disconnect(this);
        const target = this.#target;
        const observer = new IntersectionObserver((entries, observer) => {
            //if(this.#removed) return;
            for (const entry of entries) {
                const intersecting = entry.isIntersecting;
                proxy.isIntersecting = intersecting;
                setTimeout(() => {
                    try {
                        proxy.isIntersectingEcho = intersecting; //sometimes proxy is revoked
                    }
                    catch (e) { }
                }, enterDelay);
            }
        }, options);
        setTimeout(() => {
            observer.observe(target);
        }, enterDelay);
    }
    async onIntersecting({ exitDelay }) {
        const target = this.#target;
        if (target.nextElementSibling === null) {
            const clone = target.content.cloneNode(true);
            target.parentElement.appendChild(clone);
        }
        else {
            const { insertAdjacentTemplate } = await import('trans-render/lib/insertAdjacentTemplate.js');
            insertAdjacentTemplate(target, target, 'afterend');
        }
        this.#observer.disconnect();
        setTimeout(() => {
            this.#target.remove();
            this.#target = undefined;
        }, exitDelay);
    }
    disconnect({}) {
        if (this.#observer) {
            this.#observer.disconnect();
        }
    }
    finale(proxy, target, beDecorProps) {
        this.disconnect(this);
    }
}
const tagName = 'be-lazy';
const ifWantsToBe = 'lazy';
const upgrade = 'template';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            forceVisible: [upgrade],
            virtualProps: [
                'options', 'isIntersecting', 'isIntersectingEcho', 'enterDelay'
            ],
            intro: 'intro',
            finale: 'finale',
            actions: {
                onOptions: 'options',
                onIntersecting: {
                    ifAllOf: ['isIntersecting', 'isIntersectingEcho'],
                }
            },
            proxyPropDefaults: {
                options: {
                    threshold: 0,
                    rootMargin: '0px',
                },
                enterDelay: 16,
                exitDelay: 16
            }
        }
    },
    complexPropDefaults: {
        controller: BeLazy,
    }
});

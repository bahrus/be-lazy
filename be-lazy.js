import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeLazy {
    #target;
    #observer;
    intro(proxy, target, beDecorProps) {
        this.#target = target;
    }
    onOptions({ options, proxy, enterDelay, rootClosest }) {
        this.disconnect(this);
        const target = this.#target;
        if (rootClosest !== undefined) {
            const root = target.closest(rootClosest);
            if (root === null) {
                throw '404';
            }
            options.root = root;
        }
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
        this.#observer = observer;
    }
    async onIntersecting({ exitDelay, transform, host }) {
        const target = this.#target;
        if (target.nextElementSibling === null) {
            const clone = target.content.cloneNode(true);
            if (transform !== undefined) {
                const { DTR } = await import('trans-render/lib/DTR.js');
                const ctx = {
                    host,
                    match: transform
                };
                const dtr = new DTR(ctx);
                await dtr.transform(clone);
            }
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
                'options', 'isIntersecting', 'isIntersectingEcho',
                'enterDelay', 'rootClosest', 'transform', 'host'
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
register(ifWantsToBe, upgrade, tagName);

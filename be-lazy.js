import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeLazy extends EventTarget {
    #observer;
    onOptions({ options, proxy, enterDelay, rootClosest, self }) {
        this.disconnect(this);
        if (rootClosest !== undefined) {
            const root = self.closest(rootClosest);
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
            observer.observe(self);
        }, enterDelay);
        this.#observer = observer;
        proxy.resolved = true;
    }
    async onIntersecting({ exitDelay, transform, host, self, proxy, ctx }) {
        if (transform !== undefined && host === undefined) {
            //wait for host to be passed in
            return;
        }
        if (self.nextElementSibling === null) {
            const clone = self.content.cloneNode(true);
            if (ctx !== undefined) {
                const { self } = ctx;
                self.flushCache();
                await self.transform(clone);
                self.flushCache();
            }
            else if (transform !== undefined) {
                const { DTR } = await import('trans-render/lib/DTR.js');
                const ctx = {
                    host,
                    match: transform
                };
                const dtr = new DTR(ctx);
                await dtr.transform(clone);
            }
            self.parentElement.appendChild(clone);
        }
        else {
            const { insertAdjacentTemplate } = await import('trans-render/lib/insertAdjacentTemplate.js');
            insertAdjacentTemplate(self, self, 'afterend');
        }
        this.#observer.disconnect();
        setTimeout(() => {
            self.remove();
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
                'enterDelay', 'rootClosest', 'transform', 'host', 'ctx'
            ],
            finale: 'finale',
            actions: {
                onOptions: 'options',
                onIntersecting: {
                    ifAllOf: ['isIntersecting', 'isIntersectingEcho'],
                    ifKeyIn: ['host', 'transform', 'ctx'],
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

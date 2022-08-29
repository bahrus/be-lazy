import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeLazyVirtualProps, BeLazyActions, BeLazyProps} from './types.js';
import {register} from 'be-hive/register.js';
import {RenderContext} from 'trans-render/lib/types';

export class BeLazy extends EventTarget implements BeLazyActions{
    #observer: IntersectionObserver | undefined;

    onOptions({options, proxy, enterDelay, rootClosest, self}: this): void {
        this.disconnect(this);
        if(rootClosest !== undefined){
            const root = self.closest(rootClosest);
            if(root === null){
                throw '404';
            }
            options.root = root;
        }
        const observer = new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            //if(this.#removed) return;
            for(const entry of entries){
                const intersecting = entry.isIntersecting;
                proxy.isIntersecting = intersecting;
                setTimeout(() => {
                    try{
                        proxy.isIntersectingEcho = intersecting;//sometimes proxy is revoked
                    }catch(e){}
                    
                }, enterDelay); 
            }
        }, options);
        setTimeout(() => {
            observer.observe(self);
        }, enterDelay);
        this.#observer = observer; 
        proxy.resolved = true;
    }

    async onIntersecting({exitDelay, transform, host, self, proxy, ctx}: this){
        if(transform !== undefined && host === undefined){
            //wait for host to be passed in
            return;
        }
        if(self.nextElementSibling === null){
            const clone = self.content.cloneNode(true);
            if(ctx !== undefined){
                const {self} = ctx;
                self!.flushCache();
                self!.transform(clone as DocumentFragment);
                self!.flushCache();

            }else if(transform !== undefined){
                const {DTR} = await import('trans-render/lib/DTR.js');
                const ctx: RenderContext = {
                    host,
                    match: transform
                };
                const dtr = new DTR(ctx);
                await dtr.transform(clone as DocumentFragment);
            }
            
            self.parentElement!.appendChild(clone);
        }else{
            const {insertAdjacentTemplate} = await import('trans-render/lib/insertAdjacentTemplate.js');
            insertAdjacentTemplate(self, self, 'afterend');
        }
        this.#observer!.disconnect();
        setTimeout(() => {
            self!.remove();
        }, exitDelay);
    }

    disconnect({}: this){
        if(this.#observer){
            this.#observer.disconnect();
        }
    }

    finale(proxy: Element & BeLazyProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps){
        this.disconnect(this);
    }
}

export interface BeLazy extends BeLazyProps{}

const tagName = 'be-lazy';

const ifWantsToBe = 'lazy';

const upgrade = 'template';

define<BeLazyProps & BeDecoratedProps<BeLazyProps, BeLazyActions>, BeLazyActions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            forceVisible: [upgrade],
            virtualProps: [
                'options', 'isIntersecting', 'isIntersectingEcho', 
                'enterDelay', 'rootClosest', 'transform', 'host', 'ctx'
            ],
            finale: 'finale',
            actions:{
                onOptions: 'options',
                onIntersecting: {
                    ifAllOf: ['isIntersecting', 'isIntersectingEcho'],
                    ifKeyIn: ['host', 'transform', 'ctx'],
                }
            },
            proxyPropDefaults:{
                options: {
                    threshold: 0,
                    rootMargin: '0px',
                },
                enterDelay: 16,
                exitDelay: 16
            }
        }
    },
    complexPropDefaults:{
        controller: BeLazy,
    }
});
register(ifWantsToBe, upgrade, tagName);
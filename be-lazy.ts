import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeLazyVirtualProps, BeLazyActions, BeLazyProps} from './types.js';
import {register} from 'be-hive/register.js';

export class BeLazy implements BeLazyActions{
    #target: HTMLTemplateElement | undefined;
    #observer: IntersectionObserver | undefined;

    intro(proxy: HTMLTemplateElement & BeLazyProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps): void{
        this.#target = target;
    }

    onOptions({options, proxy, enterDelay}: this): void {
        this.disconnect(this);
        const target = this.#target!;
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
            observer.observe(target);
        }, enterDelay);
        this.#observer = observer; 
    }

    async onIntersecting({exitDelay}: this){
        const target = this.#target!;
        if(target.nextElementSibling === null){
            const clone = target.content.cloneNode(true);
            target.parentElement!.appendChild(clone);
        }else{
            const {insertAdjacentTemplate} = await import('trans-render/lib/insertAdjacentTemplate.js');
            insertAdjacentTemplate(target, target, 'afterend');
        }
        this.#observer!.disconnect();
        setTimeout(() => {
            this.#target!.remove();
            this.#target = undefined;
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
                'options', 'isIntersecting', 'isIntersectingEcho', 'enterDelay'
            ],
            intro: 'intro',
            finale: 'finale',
            actions:{
                onOptions: 'options',
                onIntersecting: {
                    ifAllOf: ['isIntersecting', 'isIntersectingEcho'],
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
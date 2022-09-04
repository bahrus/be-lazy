import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeLazyVirtualProps, BeLazyActions, BLP} from './types.js';
import {BeIntersectional} from 'be-intersectional/be-intersectional.js';
import {register} from 'be-hive/register.js';
import {RenderContext} from 'trans-render/lib/types';
import { ProxyProps } from '../be-intersectional/types.js';

export class BeLazy extends BeIntersectional implements BeLazyActions{

    onNotIntersecting(pp: ProxyProps): void {
        
    }

    async onIntersecting({exitDelay, transform, host, self, proxy, ctx}: BLP){
        if(transform !== undefined && host === undefined){
            //wait for host to be passed in
            return;
        }
        if(self.nextElementSibling === null){
            const clone = self.content.cloneNode(true);
            if(ctx !== undefined){
                const {self} = ctx;
                self!.flushCache();
                await self!.transform(clone as DocumentFragment);
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
        this.disconnect();
        setTimeout(() => {
            self!.remove();
        }, exitDelay);
    }
}


const tagName = 'be-lazy';

const ifWantsToBe = 'lazy';

const upgrade = 'template';

define<BeLazyVirtualProps & BeDecoratedProps<BeLazyVirtualProps, BeLazyActions>, BeLazyActions>({
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
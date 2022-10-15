import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {VirtualProps, Actions, PP} from './types.js';
import {BeIntersectional} from 'be-intersectional/be-intersectional.js';
import {register} from 'be-hive/register.js';
import {RenderContext} from 'trans-render/lib/types';
import { ProxyProps } from '../be-intersectional/types.js';

export class BeLazy extends BeIntersectional implements Actions{

    onNotIntersecting(pp: ProxyProps): void {
        
    }

    async onIntersecting({exitDelay, transform, host, self, proxy, ctx}: PP){
        if(transform !== undefined && host === undefined){
            //wait for host to be passed in
            return;
        }
        if(self.nextElementSibling === null){
            const clone = (self as HTMLTemplateElement).content.cloneNode(true);
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
            insertAdjacentTemplate(self as HTMLTemplateElement, self, 'afterend');
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

define<VirtualProps & BeDecoratedProps<VirtualProps, Actions>, Actions>({
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

            proxyPropDefaults:{
                options: {
                    threshold: 0,
                    rootMargin: '0px',
                },
                enterDelay: 16,
                exitDelay: 16
            }
        },
        actions:{
            onOptions: 'options',
            onIntersecting: {
                ifAllOf: ['isIntersecting', 'isIntersectingEcho'],
                ifKeyIn: ['host', 'transform', 'ctx'],
            }
        },
    },
    complexPropDefaults:{
        controller: BeLazy,
    }
});
register(ifWantsToBe, upgrade, tagName);
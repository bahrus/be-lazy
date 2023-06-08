import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP} from './types';
import {register} from 'be-hive/register.js';

import {BeIntersectional, actions, propDefaults as BeIntersectionalPropDefaults} from 'be-intersectional/be-intersectional.js';

export class BeLazy extends BeIntersectional{
    onNotIntersecting(self: this): void {
        
    }

    async onIntersecting(self: this){
        const {enhancedElement, exitDelay} = self;
        const {localName, nextElementSibling} = enhancedElement;
        switch(localName){
            case 'template':
                const templ = enhancedElement as HTMLTemplateElement;
                if(templ.content.firstChild !== null){
                    if(nextElementSibling === null){
                        const clone = templ.content.cloneNode(true);
                        // if(ctx !== undefined){
                        //     const {self} = ctx;
                        //     self!.flushCache();
                        //     await self!.transform(clone as DocumentFragment);
                        //     self!.flushCache();
            
                        // }else if(transform !== undefined){
                        //     const {DTR} = await import('trans-render/lib/DTR.js');
                        //     const ctx: RenderContext = {
                        //         host,
                        //         match: transform
                        //     };
                        //     const dtr = new DTR(ctx);
                        //     await dtr.transform(clone as DocumentFragment);
                        // }
                        
                        enhancedElement.parentElement!.appendChild(clone);
                    }else{
                        const {insertAdjacentTemplate} = await import('trans-render/lib/insertAdjacentTemplate.js');
                        insertAdjacentTemplate(templ, enhancedElement, 'afterend');
                    }

                }else if(nextElementSibling !== null && nextElementSibling.hasAttribute('hidden')){
                    nextElementSibling.removeAttribute('hidden');
                }else{
                    throw 'NI';
                }
                this.disconnect();
                if(exitDelay!== undefined && exitDelay >= 0){
                    setTimeout(() => {
                        enhancedElement.remove();
                    }, exitDelay);
                }else{
                    enhancedElement.remove();
                }

                break;
            case 'meta':
                throw 'NI';
                break;
        }

    }
}

export interface BeLazy extends AllProps{}

const tagName = 'be-lazy';
const ifWantsToBe = 'lazy';
const upgrade = 'template,meta';

const xe = new XE<AP, Actions>({
    config: {
        tagName,
        propDefaults: {
            ...propDefaults,
            ...BeIntersectionalPropDefaults
        },
        propInfo: {
            ...propInfo
        },
        actions
    },
    superclass: BeLazy
});

register(ifWantsToBe, upgrade, tagName);


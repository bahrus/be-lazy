import {config as beCnfg} from 'be-enhanced/config.js';
import {BE, BEConfig} from 'be-enhanced/BE.js';
import {Actions, AllProps, AP, PAP} from './types';
import { Positractions, PropInfo } from 'trans-render/froop/types';
import {IEnhancement,  BEAllProps} from 'trans-render/be/types';

import {BeIntersectional} from 'be-intersectional/be-intersectional.js';



class BeLazy extends BeIntersectional implements Actions{
    static override config: BEConfig<AP & BEAllProps, Actions & IEnhancement, any> ={
        propDefaults:  {
            options: {
                threshold: 0,
                rootMargin: '0px',
            },
            enterDelay: 16,
            exitDelay: 16,

        },
        propInfo: {
            ...beCnfg.propInfo as Partial<{[key in keyof AP]: PropInfo}>,
            isIntersecting:{
                def: false,
            },
            isIntersectingEcho:{
                def: false,
            }
        },
        positractions: [...beCnfg.positractions as Positractions<IEnhancement>],
        compacts: {
            when_options_changes_invoke_onOptions: 0,
        },
        actions: {
            onIntersecting: {
                ifAllOf: ['isIntersecting'],
                ifEquals: ['isIntersecting', 'isIntersectingEcho'],
            },
            onIntersectingChange: {
                ifKeyIn:  ['isIntersecting']
            },
            onNotIntersecting: {
                ifEquals: ['isNotIntersecting', 'isIntersectingEcho']
            },
            onNotIntersectingEcho: {
                ifKeyIn: ['isIntersectingEcho'],
            }
        }
    }

    onNotIntersecting(self: this): void {
        
    }

    async onIntersecting(self: this){
        const {enhancedElement, exitDelay} = self;
        const {localName, nextElementSibling} = enhancedElement;
        switch(localName){
            case 'template':
                const templ = enhancedElement as HTMLTemplateElement;
                const clone = templ.content.cloneNode(true);
                enhancedElement.after(clone);
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

interface BeLazy extends AP{}

await BeLazy.bootUp();

export {BeLazy}
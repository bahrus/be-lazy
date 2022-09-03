import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';
import { RenderContext, MatchRHS } from '../trans-render/lib/types';
import { 
    BeInterseciontalEndUserProps, 
    BeIntersectionalVirtualProps,
    BeIntersectionalActions,
} from 'be-intersectional/types';


export interface BeLazyEndUserProps extends BeInterseciontalEndUserProps{
    transform?: {[key: string]: MatchRHS};
    host: any;
    ctx: RenderContext;
}

export interface BeLazyVirtualProps extends BeLazyEndUserProps, MinimalProxy<HTMLTemplateElement>{
    isIntersecting: boolean;
    isIntersectingEcho: boolean;

}

export type Proxy = HTMLTemplateElement & BeLazyVirtualProps;

export interface BeLazyProxy extends BeLazyActions, BeLazyVirtualProps{
    proxy: Proxy;
}

export type BLP = BeLazyProxy;

export interface BeLazyActions extends BeIntersectionalActions{

}
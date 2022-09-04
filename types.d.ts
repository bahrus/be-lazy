import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';
import { RenderContext, MatchRHS } from '../trans-render/lib/types';
import { 
    BeIntersectiontalEndUserProps, 
    BeIntersectionalVirtualProps,
    BeIntersectionalActions,
} from 'be-intersectional/types';


export interface BeLazyEndUserProps extends BeIntersectiontalEndUserProps{
    transform?: {[key: string]: MatchRHS};
    host: any;
    ctx: RenderContext;
}

export interface BeLazyVirtualProps extends BeLazyEndUserProps, BeIntersectionalVirtualProps{}

export type Proxy = HTMLTemplateElement & BeLazyVirtualProps;

export interface ProxyProps extends BeLazyVirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface BeLazyActions extends BeIntersectionalActions{}
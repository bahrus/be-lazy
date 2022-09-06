import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';
import { RenderContext, MatchRHS } from '../trans-render/lib/types';
import { 
    EndUserProps as BeIntersectiontalEndUserProps, 
    VirtualProps as BeIntersectionalVirtualProps,
    Actions as BeIntersectionalActions,
} from 'be-intersectional/types';


export interface EndUserProps extends BeIntersectiontalEndUserProps{
    transform?: {[key: string]: MatchRHS};
    host: any;
    ctx: RenderContext;
}

export interface VirtualProps extends BeIntersectionalVirtualProps, EndUserProps{}

export type Proxy = HTMLTemplateElement & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface Actions extends BeIntersectionalActions{}
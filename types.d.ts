import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';
import { RenderContext, MatchRHS } from '../trans-render/lib/types';


export interface BeLazyEndUserProps{
    options?: IntersectionObserverInit;
    enterDelay?: number;
    exitDelay?: number;
    rootClosest?: string;
    transform?: {[key: string]: MatchRHS};
    host: any;
    ctx: RenderContext;
    //shadowRootMode?: ShadowRootMode;
}

export interface BeLazyVirtualProps extends BeLazyEndUserProps, MinimalProxy<HTMLTemplateElement>{
    isIntersecting: boolean;
    isIntersectingEcho: boolean;

}

export interface BeLazyProps extends BeLazyVirtualProps{
    proxy: HTMLTemplateElement & BeLazyVirtualProps;
}

export interface BeLazyActions{

    onOptions(self: this): void;

    onIntersecting(self: this): void;

    finale(proxy: HTMLTemplateElement & BeLazyProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps): void;

}
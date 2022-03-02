import {BeDecoratedProps} from 'be-decorated/types';

export interface BeLazyVirtualProps{
    options: IntersectionObserverInit;
    isIntersecting: boolean;
    isIntersectingEcho: boolean;
    enterDelay: number;
    exitDelay: number;
}

export interface BeLazyProps extends BeLazyVirtualProps{
    proxy: HTMLTemplateElement & BeLazyVirtualProps;
}

export interface BeLazyActions{

    intro(proxy: HTMLTemplateElement & BeLazyProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps): void;

    onOptions(self: this): void;

    onIntersecting(self: this): void;

    finale(proxy: HTMLTemplateElement & BeLazyProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps): void;

}
import {BeDecoratedProps} from 'be-decorated/types';


export interface BeLazyEndUserProps{
    options: IntersectionObserverInit;
    enterDelay: number;
    exitDelay: number;
    rootClosest: string;
    transform: any | any[];
    host: any;
}

export interface BeLazyVirtualProps extends BeLazyEndUserProps{
    isIntersecting: boolean;
    isIntersectingEcho: boolean;

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
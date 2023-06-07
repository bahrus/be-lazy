import { 
    EndUserProps as BeIntersectiontalEndUserProps, 
    AllProps as BeIntersectionalAllProps,
    Actions as BeIntersectionalActions,
} from 'be-intersectional/types';


export interface EndUserProps extends BeIntersectiontalEndUserProps{
    //transform?: {[key: string]: MatchRHS};
    //host: any;
    //ctx: RenderContext;
}

export interface AllProps extends BeIntersectionalAllProps, EndUserProps{}

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

//export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];


export interface Actions extends BeIntersectionalActions{}
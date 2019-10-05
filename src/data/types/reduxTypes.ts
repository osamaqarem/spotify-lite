export type DispatchFun = ({type, payload}: DispatchObject) => void;

export type DispatchObject = {type: string; payload?: any};

export type GetToken = ({authCode}: {authCode: string}) => void;

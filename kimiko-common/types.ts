
export interface WinMessage {
    Type: WinMsgType,
    Content: any
}


export interface WexSocket extends WebSocket {
    kimiko_absid: string;
    kimiko_relid: string;
    kimiko_url: string;
    kimiko_hashed: string;
}



export interface DBMessage {
    absid: string,
    message: string,
    time: number
}

export interface Message {
    absid?: string,
    avatar?: string,
    username?: string,
    backcolor?: string,
    message: string,
    time: number
}




export interface UserInfo {
    avatar: any;
    username: string;
    bio: string;
    email: string;
    backcolor: string;

    socials: {
        [key:string]: string

    };
};

export interface UserInfoMin {
    absid: string,
    avatar?: any,
    username?: any,
    backcolor?: string,
    [key: string]: any
}



export interface WsMessage_Client {
    Type: MsgType,
    Rel?: string,
    Abs?: string,
    Content?: any,
}

export interface WsMessage_Server {
    Type: MsgType;
    Content?: any;
}

export enum WinMsgType {
    INIT,
    PROF_REQ,
    PROF_UPD,
    PROF_REF
}

export enum MsgType {
    INIT,
    MSG,
    HIST,
    PRF_UPD,
    PRF_REQ,
    CO_UPD
}




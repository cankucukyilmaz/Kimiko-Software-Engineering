import { EventEmitter } from "events";
import { WsMessage_Client, MsgType, WinMessage, WinMsgType, Message, WsMessage_Server } from "../kimiko-common/types";
import Profile from "./Profile";


class MySocket extends WebSocket {
    emitter = new EventEmitter();

    constructor() {        
        super("wss://cs308-kimiko.herokuapp.com/")
        this.onmessage = this.incomeMessage;
    }

    sendMessage(msg: WsMessage_Client): void {


        super.send(JSON.stringify(msg));
    }

    waitForConnection(): Promise<void> {
        return new Promise((resolve, reject) => {
            const maxNumberOfAttempts = 10
            const intervalTime = 200 //ms

            let currentAttempt = 0
            const interval = setInterval(() => {
                if (currentAttempt > maxNumberOfAttempts - 1) {
                    clearInterval(interval)
                    reject(new Error('Maximum number of attempts exceeded'))
                } else if (this.readyState === this.OPEN) {
                    clearInterval(interval)
                    resolve();
                }
                currentAttempt++
                
            }, intervalTime)
        })
    }

    incomeMessage(event: any) {
        let data: WsMessage_Server = JSON.parse(event.data);
        switch (data.Type) {
            case MsgType.HIST:
                let messages: Message[] = data.Content.reverse();
                this.emitter.emit("old-messages", messages);
                break;

            case MsgType.MSG:
                console.debug(data);
                let cont: Message = data.Content;
                let message: Message = { avatar: cont.avatar, username: cont.username, backcolor: cont.backcolor, message: cont.message, time: cont.time };
                this.emitter.emit("new-message", message);
                break;

            case MsgType.PRF_UPD:
                this.emitter.emit("new-profile", data.Content);
                break;

            case MsgType.CO_UPD:
                this.emitter.emit("counter-update", data.Content);
                break;

        }
    }
}


class MyWindow {

    emitter = new EventEmitter();
    constructor(profile: Profile) {
        console.debug(profile);
    }


    handler(event: any, profile: Profile, socket: MySocket) {

        let payload: WinMessage = event.data;

        if (payload.Type === WinMsgType.INIT) {
            profile.import(payload.Content.profile);
            profile.AbsId = payload.Content.uuid;
            let url = new URL(payload.Content.location);
            profile.location = url.host + url.pathname + url.search;
            socket.sendMessage({ Type: MsgType.INIT, Rel: profile.RelId, Abs: profile.AbsId, Content: profile.location });
            this.emitter.emit("profile-refresh", profile);


        } else if (payload.Type === WinMsgType.PROF_UPD) {
            if (!payload.Content)
                profile.import(payload.Content);
            else
                this.sendMessage({ Type: WinMsgType.PROF_UPD, Content: profile.export() });

        } else if (payload.Type === WinMsgType.PROF_REF) {
            profile.import(payload.Content);
            this.emitter.emit("profile-refresh", profile);
        }



    }

    sendMessage(message: WinMessage) {
        window.parent.postMessage(message, "*");
    }
}



export { MySocket, MyWindow };
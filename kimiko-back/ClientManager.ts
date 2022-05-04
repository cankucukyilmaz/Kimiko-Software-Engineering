import { DB_CONSTS } from "./kimiko-common/vars";
import { DBMessage, Message, MsgType, UserInfo, UserInfoMin, WexSocket, WsMessage_Server } from "./kimiko-common/types";
import DatabaseManager from "./DatabaseManager";
import ConnManager from "./URLManager";


const dbManager = new DatabaseManager();
dbManager.connect().then(()=>console.log('Connected to database.'))

const connManager = new ConnManager();




class ClientManager {
    constructor() {
    }

    async newClient(client: WexSocket) {
        let onlineCo = connManager.newClient(client);
        await dbManager.registerUrl(client.kimiko_hashed);
        let result: DBMessage[] = await dbManager.fetchMessages(client.kimiko_hashed, 20);

        let messages: Message[] = [];
        for (let dbmessage of result) {

            let absid = dbmessage.absid;
            let user: UserInfoMin = await dbManager.getMessageProfile(absid);

            

            messages.push(<Message>{
                absid: user.absid,
                avatar: user.avatar,
                username: user.username,
                message: dbmessage.message,
                backcolor: user.backcolor,
                time: dbmessage.time
            })

        }

        let wsMessage: WsMessage_Server = { Type: MsgType.HIST, Content: messages };
        client.send(JSON.stringify(wsMessage));
        let wsMessage_CO_UPD: WsMessage_Server = { Type: MsgType.CO_UPD, Content: onlineCo };
        let clients = connManager.getClients(client);
        if (clients) {
            for (let client of clients) {
                client.send(JSON.stringify(wsMessage_CO_UPD));
            }
        }

    }

    async newMessage(client: WexSocket, content: Message) {

        dbManager.newMessage(client.kimiko_absid, client.kimiko_hashed, content);
        let profile: UserInfoMin = await dbManager.getMessageProfile(client.kimiko_absid);
        let clients = connManager.getClients(client);
        let msg: Message = { message: content.message, time: content.time };
        if (profile) {
            msg.absid = profile[DB_CONSTS.COL_NAMES.ABS];
            msg.avatar = profile[DB_CONSTS.COL_NAMES.AVATAR];
            msg.username = profile[DB_CONSTS.COL_NAMES.USERNAME];
            msg.backcolor = profile[DB_CONSTS.COL_NAMES.BACKCOLOR];
        }


        let wsMessage: WsMessage_Server = { Type: MsgType.MSG, Content: msg };
        for (let client of clients) {
            client.send(JSON.stringify(wsMessage));
        }
    }

    async getFullProfile(absid: string) {
        return await dbManager.getFullProfile(absid);
    }

    clientLeft(client: WexSocket) {
        let onlineCo = connManager.leftClient(client);
        let wsMessage_CO_UPD: WsMessage_Server = { Type: MsgType.CO_UPD, Content: onlineCo };
        let clients = connManager.getClients(client);
        if (clients) {
            for (let client of clients) {
                client.send(JSON.stringify(wsMessage_CO_UPD));
            }
        }
    }


    updateProfile(client: WexSocket, profile: UserInfo) {
        dbManager.registerProfile(client.kimiko_absid, profile);
    }




}


export default ClientManager;
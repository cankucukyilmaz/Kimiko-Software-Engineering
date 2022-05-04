import { WexSocket } from "./kimiko-common/types";

class ConnManager {
    pairs: {
        [key: string]: WexSocket[]
    } = {};


    newClient(client: WexSocket) {
        let hash = client.kimiko_hashed;
        if (!this.pairs[hash]) {
            this.pairs[hash] = [];
        }
        this.pairs[hash].push(client);
        return this.pairs[hash].length - 1;
    }

    getClients(client: WexSocket): WexSocket[] {
        let hash = client.kimiko_hashed;
        return this.pairs[hash];
    }

    leftClient(client: WexSocket) {
        let hash = client.kimiko_hashed;

        if (hash && this.pairs[hash]) {
            let clients = this.pairs[hash].filter(cli => cli !== client);
            let len = clients.length;
            if (len > 0) {
                this.pairs[hash] = clients;
                return len;
            } else {
                delete this.pairs[hash];
            }
        } else {
            console.log("No hash or no client!");
        }

        return 0;
    }


}

export default ConnManager;
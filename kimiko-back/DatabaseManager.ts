import { Message, UserInfo, UserInfoMin, WexSocket } from "./kimiko-common/types";
import { DB_CONSTS } from "./kimiko-common/vars";
import { MongoClient, Db, Collection } from "mongodb";

//var url = "mongodb://localhost:27017";
var url = `mongodb+srv://tagrikli:Tututug124.@cluster0.qt06w.mongodb.net/kimiko?retryWrites=true&w=majority`;


class DatabaseManager {

    client: MongoClient | undefined;
    database: Db | undefined;
    profiles: Collection | undefined;

    constructor() {
    }

    async connect() {

        let client = new MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        this.client = await client.connect();
        this.database = this.client.db("kimiko");
        this.profiles = this.database.collection(DB_CONSTS.TABL_NAMES.PROFILE);
        


    }

    async registerUrl(hash: string) {
        console.info("registerUrl", hash);

    }

    newMessage(absid: string, hash: string, content: Message) {
        let table = hash;
        //let query = `INSERT INTO "${table}" VALUES ($1::text,$2::text,$3::numeric)`;
        let coll = this.database!.collection(table.toString());
        coll.insertOne({ absid: absid, message: content.message, time: content.time });

    }

    async registerProfile(absid: string, profile: UserInfo) {
        console.info("registerProfile", absid);

        const filter = { absid: absid };
        const options = { upsert: true };
        const update = {
            $set:
            {
                [DB_CONSTS.COL_NAMES.AVATAR]: profile.avatar,
                [DB_CONSTS.COL_NAMES.USERNAME]: profile.username,
                [DB_CONSTS.COL_NAMES.BIO]: profile.bio,
                [DB_CONSTS.COL_NAMES.EMAIL]: profile.email,
                [DB_CONSTS.COL_NAMES.SOCIALS]: profile.socials,
                [DB_CONSTS.COL_NAMES.BACKCOLOR]: profile.backcolor
            }

        }
        this.profiles!.updateOne(filter, update, options);
    }

    async getFullProfile(absid: string) {
        const query = { [DB_CONSTS.COL_NAMES.ABS]: absid };
        const options = {
            projection: {
                _id: 0
            }
        }
        let res = await this.profiles!.findOne(query, options);
        return res;
    }

    async getMessageProfile(absid: string) {

        const query = { [DB_CONSTS.COL_NAMES.ABS]: absid };
        const options = {
            projection: {
                _id: 0,
                [DB_CONSTS.COL_NAMES.ABS]: 1,
                [DB_CONSTS.COL_NAMES.AVATAR]: 1,
                [DB_CONSTS.COL_NAMES.USERNAME]: 1,
                [DB_CONSTS.COL_NAMES.BACKCOLOR]: 1,
            }
        }
        return await this.profiles!.findOne(query, options);
    }


    async fetchMessages(hash: string, limit: number) {
        console.debug("fetchMessages");
        const coll = this.database!.collection(hash.toString());
        const query = {};
        const sort = { time: -1 };
        return await coll.find(query).limit(limit).sort(sort).toArray();
    }


}


export default DatabaseManager;
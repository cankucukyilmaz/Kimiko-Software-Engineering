import { v4 } from "uuid";
import { UserInfo } from "../kimiko-common/types";
import ProfileIds from "./accounts.json";

export { ProfileIds };

interface SocialMedia {
    [key:string]: string
}

class Profile {
    private _abs = "";
    private _rel = v4();
    private _avatar = "";
    private _username = "";
    private _bio = "";
    private _email = "";
    private _backcolor = "";
    private _socials: SocialMedia = {};
    private _loc = "";
    private _empty: UserInfo = { avatar: "", username: "", bio: "", socials: {}, email: "", backcolor: "#fffff" }
    private _profile: UserInfo = this._empty;


    get location() {
        return this._loc;
    }

    set location(loc: string) {
        this._loc = loc;
    }

    import(profile: UserInfo) {
        if (profile) {
            this._avatar = profile.avatar;
            this._username = profile.username;
            this._bio = profile.bio;
            this._socials = profile.socials;
            this._backcolor = profile.backcolor;
            this._email = profile.email;
            this._profile = this.export();
        }
    }
    export(): UserInfo {
        let profile: UserInfo = {
            avatar: this._avatar,
            username: this._username,
            bio: this._bio,
            socials: this._socials,
            email: this._email,
            backcolor: this._backcolor
        };
        return profile;
    }


    set username(username: string) {
        this._username = username;
    }
    get username() {
        return this._username;
    }

    set avatar(data: string) {
        this._avatar = data;
    }
    get avatar() {
        return this._avatar;
    }

    set bio(bio: string) {
        this._bio = bio;
    }
    get bio() {
        return this._bio;
    }

    set email(email: string) {
        this._email = email;
    }
    get email() {
        return this._email;
    }

    set backcolor(color: string) {
        this._backcolor = color;
    }

    get backcolor() {
        return this._backcolor;
    }

    addSocial(data: SocialMedia) {
        let [key, value] = [Object.keys(data)[0], Object.values(data)[0]];
        this._socials[key] = value;
    }

    getSocial(key: string) {

        return this._socials[key];
    }

    get socials() {
        return this._socials;
    }

    set AbsId(id: string) {
        this._abs = id;
    }

    set RelId(id: string) {
        this._rel = id;
    }

    get RelId() {
        return this._rel;
    }

    get AbsId() {
        return this._abs;
    }

    resetProfile() {
        this.import(this._empty);
        return this;
    }



    isEqual(profile: Profile) {



    }
}

export default Profile;
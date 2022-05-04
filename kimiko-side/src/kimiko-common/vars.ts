export const INPUT_CONSTS = {
    USERNAME: 30,
    SOCIAL: 50,
    BIO: 100,
    MESSAGE: 50 
}


export const DB_CONSTS = {
    COL_NAMES: {
        ABS: "absid",
        AVATAR: "avatar",
        USERNAME: "username",
        BIO: "bio",
        EMAIL: "email",
        SOCIALS: "socials",
        BACKCOLOR:"backcolor"
    },
    TABL_NAMES: {
        PROFILE: "profiles"
    }
}

export var BASE_CONF = {
    scheme: "http",
    host: "127.0.0.1",
    port: "",
    path: "",
    full: function () {
        return `${this.scheme}://${this.host}:${this.port}/${this.path}`;
    }
}

export var WS_CONF = {
    scheme: "ws",
    host: "127.0.0.1",
    port: "",
    path: "",
    full: function () {
        return `${this.scheme}://${this.host}:${this.port}/${this.path}`;
    }
}



export const ClientId = "944974151342-marjq0nb00gipf3mta38vvgdjut05g2a.apps.googleusercontent.com";

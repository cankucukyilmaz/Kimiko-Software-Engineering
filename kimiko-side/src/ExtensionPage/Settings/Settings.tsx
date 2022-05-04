import React from 'react';
import './Settings.scss';
import Profile, { ProfileIds } from '../../helpers/Profile';
import { INPUT_CONSTS } from '../../kimiko-common/vars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName, library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

library.add(fab);

function AmediaSocial(props: { disabled: boolean, onChange: any, data: { id: string, account?: boolean, backColor?: string }, value: string }) {


    const mouseEnter = (e: React.BaseSyntheticEvent<any>) => {
        let target = e.target;
        if (target.classList.contains("Amedia-Social")) {
            target.style.backgroundColor = props.data.backColor;
        }

        e.target.onmouseleave = () => {
            target.style.backgroundColor = "";
        }

    }


    return (

        <div className="Amedia-Social"
            onMouseEnter={mouseEnter}>
            <FontAwesomeIcon icon={["fab", props.data.id as IconName]} color="white" size="2x" />

            <input
                id={props.data.id}
                onChange={props.onChange}
                className="Inputue Social"
                type="text"
                value={props.value}
                spellCheck="false"
                autoComplete="off"
                disabled={props.disabled} />
        </div>
    )
}


interface AState {
    profile: Profile;
    signedIn: boolean;
};


interface AProp {
    updateProfile: (info: Profile, send?: boolean) => void;
    requestProfile: () => void;
    profile: Profile;
    show: boolean;
    googleAuth: any;
    innerRef: any;
};


class Settings extends React.Component<AProp, AState> {
    inputRef: any;
    timeout: number | undefined;

    constructor(props: AProp) {
        super(props)
        this.state = { profile: props.profile, signedIn: true };

        this.uploadAvatar = this.uploadAvatar.bind(this);
        this.removeAvatar = this.removeAvatar.bind(this);
        this.avatarUpdate = this.avatarUpdate.bind(this);
        this.saveSettings = this.saveSettings.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.inputRef = React.createRef();


    };


    componentDidMount() {
        // gapi.signin2.render("googleSignIn", {
        //     scope: 'profile email',
        //     theme: 'light',
        //     onsuccess: this.googleSuccess
        // });
    }

    componentWillUnmount() {
        this.props.updateProfile(this.state.profile, true);
    }

    uploadAvatar() {
        if (this.inputRef.current) {
            this.inputRef.current.click();
        }
    };

    removeAvatar(e: any) {
        e.preventDefault();
        this.setState(state => {
            state.profile.avatar = "";
            return state;
        });
    }


    saveSettings() {
        this.props.updateProfile(this.state.profile);
    };

    handleColorChange(e: any) {
        let color = e.target.value;
        this.setState(state => {
            state.profile.backcolor = `hsl(${color}, 55%, 75%)`;
            return state;
        });

    }


    handleInputChange(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {


        let profile = this.state.profile;
        let value = e.target.value;
        let socialIds = Object.values(ProfileIds.Social).map(val => val.id);

        let classList = e.target.classList;
        let targetId = e.target.id;

        classList.remove("NotOk");
        classList.add("Ok");

        if (targetId === ProfileIds.Username && value.length < INPUT_CONSTS.USERNAME) {
            profile.username = value;
        } else if (targetId === ProfileIds.Bio && value.length < INPUT_CONSTS.BIO) {
            profile.bio = value;
        } else if (socialIds.includes(targetId) && value.length < INPUT_CONSTS.SOCIAL) {
            if (value) {
                profile.socials[targetId] = value;
            } else {
                delete profile.socials[targetId];
            }
        } else {
            classList.remove("Ok");
            classList.add("NotOk");
            setTimeout(() => {
                classList.add("Ok");
                classList.remove("NotOk");
            }, 400);
        }

        if (value.length === 0) {
            classList.remove("NotOk");
            classList.remove("Ok");
        }

        this.setState({ profile: profile });
    };



    async avatarUpdate(e: React.ChangeEvent<HTMLInputElement> | undefined) {

        let files = e ? e.target.files : undefined;

        const reader = new FileReader();
        if (files) {
            reader.readAsDataURL(files[0]);
            reader.onload = () => {
                //let res = reader.result;

                const canvas = document.createElement('canvas')
                const img = document.createElement('img');

                img.onload = () => {
                    let width = img.width
                    let height = img.height
                    const maxHeight = 300
                    const maxWidth = 300

                    if (width > height) {
                        if (width > maxWidth) {
                            height = Math.round((height *= maxWidth / width))
                            width = maxWidth
                        }
                    } else {
                        if (height > maxHeight) {
                            width = Math.round((width *= maxHeight / height))
                            height = maxHeight
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (ctx)
                        ctx.drawImage(img, 0, 0, width, height)

                    this.setState((state) => {
                        state.profile.avatar = canvas.toDataURL('image/png', 0.7);
                        return state;
                    });
                }

                img.src = reader.result as string;
            }
        }
    };






    render() {

        let profile = this.state.profile.export();
        let socials = [];

        for (const [id, data] of Object.entries(ProfileIds.Social)) {
            let val = profile.socials[data.id];
            if (val)
            socials.push(<AmediaSocial key={id} onChange={this.handleInputChange} data={data} value={val} disabled={!this.state.signedIn}></AmediaSocial>);
        }
        for (const [id, data] of Object.entries(ProfileIds.Social)) {
            let val = profile.socials[data.id];
            if (!val)
            socials.push(<AmediaSocial key={id} onChange={this.handleInputChange} data={data} value={val} disabled={!this.state.signedIn}></AmediaSocial>);
        }


        let avatar = profile.avatar ?
            <img alt="" src={profile.avatar} id="imagos" draggable="false"></img> :
            <FontAwesomeIcon icon={faUser} size="4x" />

        return (
            <div id="Kimiko-Settings" className={"Settings"} ref={this.props.innerRef}>

                <div className="Avataro-Edit">
                    <div className="Avataro" onClick={this.uploadAvatar} onDoubleClick={this.removeAvatar}>
                        {avatar}
                        <input className="File" onChange={this.avatarUpdate} ref={this.inputRef} id="avatar-input" accept="image/png, image/jpeg" type="file" />
                    </div>
                </div>

                <div className="Usere-Infos" >
                    <div className="Biosphere">
                        <input
                            id={ProfileIds.Username}
                            value={profile.username}
                            onChange={this.handleInputChange}
                            className="Inputue Social"
                            type="text"
                            spellCheck="false"
                            autoComplete="off"
                            placeholder="Just a name" />
                        <textarea
                            rows={3}
                            id={ProfileIds.Bio}
                            value={profile.bio}
                            onChange={this.handleInputChange}
                            className="Biosphere-input Inputue Bio"
                            spellCheck="false"
                            placeholder="Little info..."
                            autoComplete="off"
                            disabled={!this.state.signedIn}
                        ></textarea>

                        <input
                            type="range"
                            className="Kimiko-range"
                            min="0"
                            max="360"
                            style={{ backgroundColor: profile.backcolor }}
                            onChange={this.handleColorChange}></input>

                        <div className="Inputue Profile-Backcolor" style={{ backgroundColor: profile.backcolor }}>
                        </div>

                    </div>
                </div>


                <div className="Social-Media-Cont">
                    {socials}
                </div>

                <div className="Footer">
                    <div id="save" className="Button" onClick={this.saveSettings}>
                        <span>Save</span>
                    </div>

                </div>
            </div>

        )
    }

}

export default React.forwardRef((props: any, ref: any) =>
    <Settings
        innerRef={ref}
        show={props.configMode}
        requestProfile={props.requestProfile}
        updateProfile={props.updateProfile}
        profile={props.profile}
        googleAuth={props.GoogleAuth}
    />
);
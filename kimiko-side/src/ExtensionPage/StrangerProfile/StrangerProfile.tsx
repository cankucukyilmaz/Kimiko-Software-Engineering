import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, IconName } from '@fortawesome/free-solid-svg-icons';

import React from 'react';
import Profile, { ProfileIds } from '../../helpers/Profile';
import './StrangerProfile.scss';


function AmediaSocial(props: { data: { id: string, profileLink?: string, backColor?: string }, value: string }) {

    const goToProfile = () => {
        if (props.data.profileLink) {

            let url = new URL(props.value, props.data.profileLink);
            window.open(url.href, '_blank');
        }
    }

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

            <div
                id={props.data.id}
                className="Inputue Social"
                onClick={goToProfile}>
                {props.value}
            </div>
        </div>
    )
}


interface Props {
    innerRef: any;
    show: boolean;
    profile: Profile;
}

class StrangerProfile extends React.Component<Props, {}> {


    render() {



        let profile = this.props.profile;
        let avatar = profile.avatar ?
            <img alt="" src={profile.avatar} id="imagos" draggable="false"></img> :
            <FontAwesomeIcon icon={faUser} size="4x" />


        let socials = [];
        for (const [key, value] of Object.entries(ProfileIds.Social)) {

            let val = profile.socials[value.id];
            let link = "profileLink" in value ? value.profileLink : "";

            if (val) {
                socials.push(<AmediaSocial key={key} data={value} value={val} ></AmediaSocial>);
            }
        }

        return (
            <div
                id="Kimiko-Stranger"
                className="StrangerProfile"
                style={{ borderColor: profile.backcolor }}
                ref={this.props.innerRef}>
                <div className="Avataro-Edit"
                    style={{ backgroundColor: profile.backcolor }}>
                    <div className="Avataro" >
                        {avatar}
                    </div>
                </div>

                <div className="Usere-Infos" >
                    <div className="Biosphere">
                        <div
                            id={ProfileIds.Username}
                            className="Inputue Social"
                            spellCheck="false"
                            placeholder="Just a name" >
                            {profile.username}
                        </div>
                        <div
                            id={ProfileIds.Bio}
                            className="Biosphere-input Inputue Bio">
                            {profile.bio}
                        </div>


                    </div>
                </div>


                <div className="Social-Media-Cont">
                    {socials}
                </div>

                <div className="Footer" style={{ backgroundColor: profile.backcolor }}>

                </div>
            </div>
        )
    }

}


export default React.forwardRef((props: any, ref: any) =>
    <StrangerProfile
        innerRef={ref}
        show={props.show}
        profile={props.profile}
    />
);
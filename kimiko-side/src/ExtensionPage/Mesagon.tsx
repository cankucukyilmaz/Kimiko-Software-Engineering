import React from 'react';
import { Message, UserInfoMin } from '../kimiko-common/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';


function Amesago(props: any) {

    let content: UserInfoMin = props.content;
    let avatar = content.avatar ?
        <img alt="" src={content.avatar}></img> :
        <FontAwesomeIcon icon={faUser} size="2x"/>;
    let username = content.username ? content.username : "A_User";
    let color = content.backcolor;
    let message = content.message;
    //let time = content.time;
    const getProfile = () => {
        props.strangerRequest(content.absid);
    };

    return (

        <div className="Amesagos" >


            <div className="AmesagoWrapper" style={{backgroundColor:color}}>
                <div className="Avataro">
                    {avatar}
                </div>

                <div className="Mesago" >
                    <div className="Username" onClick={getProfile}>{"" + username}</div>
                    <div className="TheMessage" >
                        {message}
                    </div>
                </div>
            </div>
        </div>
    )
}


class Mesagon extends React.Component<{ mesagons: Message[], strangerRequest:any}, {}>{
    constructor(props: any) {
        super(props);
        this.scrollDown = this.scrollDown.bind(this);
    }

    scrollDown() {
        let elem: Element = document.getElementsByClassName('MesagonCont')[0];
        elem.scrollTop = elem.scrollHeight;
    }

    componentDidMount() {
        this.scrollDown();
    }
    componentDidUpdate() {
        this.scrollDown();
    }


    render() {

        return (
            <div className="MesagonCont">


                <div className="Mesagon">
                    {this.props.mesagons.map((content: Message, ind) => <Amesago key={ind} content={content} strangerRequest={this.props.strangerRequest}></Amesago>)}
                </div>

            </div>
        )
    }
}

export default Mesagon;
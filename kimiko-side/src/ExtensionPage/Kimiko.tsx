import React from 'react';
import './App.scss';
import Header from './Header';
import Mesagon from './Mesagon';
import Inputue from './Inputue';
import Settings from './Settings/Settings';
import StrangerProfile from './StrangerProfile/StrangerProfile';
import { Message, MsgType, WinMsgType } from '../kimiko-common/types';


import { MySocket, MyWindow } from '../helpers/Messenger';
import Profile from '../helpers/Profile';
import { CSSTransition } from 'react-transition-group';
import ContextMenu from './ContextMenu';

interface Aprop {
  socket: MySocket;
  profile: Profile;
  winmessenger: MyWindow;
}

interface Astate {
  mesagons: Message[];
  configMode: boolean;
  profileMode: boolean;
  onlineCo: number;

  strangerProfile: Profile | undefined;
  profile: Profile;
  context: {
    state: boolean,
    top?: number,
    left?: number
  };

};


class App extends React.Component<Aprop, Astate> {
  GoogleAuth: any;
  settingsRef: React.RefObject<HTMLDivElement>;
  profileRef: React.RefObject<HTMLDivElement>;

  constructor(props: Aprop) {
    super(props);

    this.state = {
      mesagons: [], configMode: false, profileMode: false, profile: props.profile, context: { state: false }, strangerProfile: undefined, onlineCo: 0
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.requestProfile = this.requestProfile.bind(this);
    this.loadMessages = this.loadMessages.bind(this);
    this.newMessage = this.newMessage.bind(this);
    this.refreshProfile = this.refreshProfile.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.contextMenuHandler = this.contextMenuHandler.bind(this);
    this.onStrangerProfileRequest = this.onStrangerProfileRequest.bind(this);
    this.settingsRef = React.createRef();
    this.profileRef = React.createRef();


    // gapi.load('auth2', () => {
    //   this.GoogleAuth = gapi.auth2.init({
    //     client_id: ClientId
    //   });
    // });

  }

  componentDidMount() {
    this.props.socket.emitter.on("old-messages", this.loadMessages);
    this.props.socket.emitter.on("new-message", this.newMessage);
    this.props.socket.emitter.on("new-profile", (profile: Profile) => { this.updateProfile(profile, false) });
    this.props.socket.emitter.on("counter-update", (onlineCo: number) => { this.setState({ onlineCo: onlineCo }) });
    this.props.winmessenger.emitter.on("profile-refresh", this.refreshProfile);
  }

  loadMessages(messages: Message[]) {
    this.setState({ mesagons: messages });
  }

  newMessage(message: Message) {
    let mesagons = this.state.mesagons;
    mesagons.push(message);
    this.setState({ mesagons: mesagons });
  }

  sendMessage(messageText: string) {
    //let profile = this.props.profile.export();
    let relid = this.props.profile.RelId;
    let absid = this.props.profile.AbsId;
    let message: Message = { message: messageText, time: Date.now() };
    this.props.socket.sendMessage({ Type: MsgType.MSG, Rel: relid, Abs: absid, Content: message });
  };

  refreshProfile(event: any) {
    this.setState({ profile: event });
  }

  updateProfile(profile: Profile, send: boolean = false) {

    if (true) {
      this.props.winmessenger.sendMessage({ Type: WinMsgType.PROF_UPD, Content: profile.export() });
      if (send) {
        this.props.socket.sendMessage({ Type: MsgType.PRF_UPD, Rel: "", Abs: "", Content: profile.export() })
      }
    }

  }

  requestProfile(local: boolean = false) {

    console.debug("requestProfile", local);
    if (local) {
      this.props.winmessenger.sendMessage({ Type: WinMsgType.PROF_REQ, Content: "" });
    } else {
      let profile = this.state.profile;
      this.props.socket.sendMessage({ Type: MsgType.PRF_REQ, Rel: profile.RelId, Abs: profile.AbsId });
    }
  }

  contextMenuHandler(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    this.setState({ context: { state: true, top: e.clientY, left: e.clientX } });

  }

  onStrangerProfileRequest(absid: string) {
    fetch(`/kimiko/api/v1/profile/${absid}`)
      .then(resp => resp.json())
      .then((data: Profile) => {
        this.setState({ strangerProfile: data, profileMode: true });
      }).catch(reason => { console.log(reason) });
  }


  onClickHandler(e: React.BaseSyntheticEvent<any>) {
    let settingsId = "Kimiko-Settings";
    let strangerId = "Kimiko-Stranger";
    let contextMenuId = "Kimiko-Context-Menu";

    let settings = document.getElementById(settingsId);
    if (settings && !settings.contains(e.target)) {
      this.setState({ configMode: false });
    }


    let context = document.getElementById(contextMenuId);
    if (context && !context.contains(e.target)) {
      this.setState({ context: { state: false } });
    }

    let stranger = document.getElementById(strangerId);
    if (stranger && !stranger.contains(e.target)) {
      this.setState({ profileMode: false });
    }

  }


  render() {

    let context = this.state.context;

    return (

      <div className="App" onContextMenu={this.contextMenuHandler} onClick={this.onClickHandler}>

        {context.state && <ContextMenu
          funcs={{
            closeContext: () => { this.setState({ context: { state: false } }) },
            openSettings: () => { this.setState({ configMode: true }) }
          }}
          poses={{ top: context.top, left: context.left }} />}

        <CSSTransition
          nodeRef={this.settingsRef}
          in={this.state.configMode}
          timeout={500}
          classNames="setto"
          unmountOnExit>
          <Settings
            ref={this.settingsRef}
            show={this.state.configMode}
            requestProfile={this.requestProfile}
            updateProfile={this.updateProfile}
            profile={this.state.profile}
            googleAuth={this.GoogleAuth}>
          </Settings>
        </CSSTransition>


        <CSSTransition
          nodeRef={this.profileRef}
          in={this.state.profileMode}
          timeout={500}
          classNames="stratto"
          unmountOnExit>
          <StrangerProfile
            ref={this.profileRef}
            show={this.state.profileMode}
            profile={this.state.strangerProfile}>
          </StrangerProfile>
        </CSSTransition>




        <Header></Header>
        <Mesagon
          mesagons={this.state.mesagons}
          strangerRequest={this.onStrangerProfileRequest}></Mesagon>
        <Inputue newInput={this.sendMessage} counterData={this.state.onlineCo}></Inputue>

      </div>

    );
  }
}

export default App;

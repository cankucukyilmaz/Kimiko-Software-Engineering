import React from 'react';
import ReactDOM from 'react-dom';
import Kimiko from './ExtensionPage/Kimiko';
import reportWebVitals from './reportWebVitals';
import { WinMsgType } from './kimiko-common/types';
import { WS_CONF } from './kimiko-common/vars';

import Profile from "./helpers/Profile";
import { MySocket, MyWindow } from "./helpers/Messenger";


let profile = new Profile();

fetch('/kimiko/api/v1/port').then(res => res.text()).then(port => {


  let Socket = new MySocket();

  Socket.waitForConnection().then(() => {


    let WinMessenger = new MyWindow(profile);
    let kimiko =
      <Kimiko
        socket={Socket}
        profile={profile}
        winmessenger={WinMessenger}
      />
      ;

    window.addEventListener("message", (event) => { WinMessenger.handler(event, profile, Socket) });
    WinMessenger.sendMessage({ Type: WinMsgType.INIT, Content: "" });


    ReactDOM.render(
      <React.StrictMode>
        {kimiko}
      </React.StrictMode>,
      document.getElementById('root')
    );


  })



})







reportWebVitals();


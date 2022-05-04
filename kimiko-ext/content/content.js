"use strict";
var ConMsgType;

(function (ConMsgType) {
    ConMsgType[ConMsgType["INIT"] = 0] = "INIT";
    ConMsgType[ConMsgType["PROFREQ"] = 1] = "PROFREQ";
    ConMsgType[ConMsgType["PROFUPD"] = 2] = "PROFUPD";
    ConMsgType[ConMsgType["PROFREF"] = 3] = "PROFREF";
})(ConMsgType || (ConMsgType = {}));

var mT = 0;
var kT = 0;
var inter = 500;
var hereIsKimiko = "here-is-kimiko";
var whereIsKimiko = "where-is-kimiko";
var resizeProcess = "resizing-in-process";
var defWidth = 320;
var index = "index.html";
var url = new URL("http://127.0.0.1:8000/"); //Development
var url = new URL("https://cs308-kimiko.herokuapp.com/"); //Development

var frame;
var kimiko;
var resizeBar;


chrome.runtime.onMessage.addListener(function (payload) {
    var indow = frame[0].contentWindow;
    if (payload.Type === ConMsgType.PROFREF) {
        var profileRes = { Type: ConMsgType.PROFREF, Content: payload.Content };
        if (indow) {
            indow.postMessage(profileRes, url.href);
        }
    }
});


window.addEventListener("message", function (event) {
    if (new URL(event.origin).href !== url.href)
        return;
    var payload = event.data;
    var indow = frame[0].contentWindow;
    console.log(event.origin);
    switch (payload.Type) {
        case ConMsgType.INIT:
            chrome.storage.local.get(["kimikoid", "profile"], function (result) {
                var initRes = {
                    Type: ConMsgType.INIT, Content: {
                        uuid: result.kimikoid,
                        profile: result.profile,
                        location: window.location.href
                    }
                };
                if (indow)
                    indow.postMessage(initRes, event.origin);
                
                console.log("initialized", result.profile);
                console.log("ConMessage", initRes);
            });
            break;
        case ConMsgType.PROFUPD:
            chrome.storage.local.set({ "profile": payload.Content });
            var profileRes = { Type: ConMsgType.PROFREF, Content: payload.Content };
            chrome.runtime.sendMessage(profileRes);
            console.log("profile updated", payload.Content);
            break;
        case ConMsgType.PROFREQ:
            chrome.storage.local.get(["profile"], function (respond) {
                var profileRes = { Type: ConMsgType.PROFUPD, Content: respond.profile };
                if (indow)
                    indow.postMessage(profileRes, event.origin);
                console.log("profile sended", respond.profile);
            });
            break;
    }
});


$(function () {
    $.get(chrome.runtime.getURL("content/content.html"), function (data) {
        kimikoSetup(data);
        resizeBarSetup();
        frameSetup();
        $(document.body).append(kimiko);
    });
    console.log(new URL(window.location.href));
    $(document).on('keydown', hotKeyHandler);
    $(document).on("mousedown", clickHandler);
});


var hotKeyHandler = function (event) {
    if (event.key === "Shift") {
        var kTn = Date.now();
        if (kTn - kT < inter) {
            toogleFrame();
        }
        kT = kTn;
    }
};


function mouseDownMoveHandler(event) {
    console.log(event);
    kimiko.css("width", event.clientX + "px");
}


function clickHandler(event) {
    if (event.which === 2) {
        var mTn = Date.now();
        if (mTn - mT < inter) {
            if (kimiko.hasClass(whereIsKimiko)) {
                kimikoDisplay(true);
            }
        }
        mT = mTn;
    }
    else {
        var $target = $(event.target);
        var len = $target.parents().length;
        var childOfKimiko = false;
        for (var i = 0; i < len; i++) {
            var elem = $target.parents()[i];
            if (kimiko[0] === elem) {
                childOfKimiko = true;
            }
        }
        if (!childOfKimiko) {
            kimikoDisplay(false);
        }
        
    }
}


function toogleFrame() {
    if (kimiko.hasClass(whereIsKimiko)) {
        kimikoDisplay(true);
    }
    else {
        kimikoDisplay(false);
    }
}


function kimikoDisplay(show) {
    if (show) {
        kimiko.removeClass(whereIsKimiko);
        kimiko.css("left", "0px");
    }
    else {
        kimiko.addClass(whereIsKimiko);
        kimiko.css("left", "-" + kimiko.width() + "px");
    }
}


function kimikoSetup(data) {
    kimiko = $(data);
    chrome.storage.local.get(["kimikowid"], function (respond) {
        kimiko.css("width", respond.kimikowid + "px");
        kimikoDisplay(false);
    });
}


function resizeBarSetup() {
    resizeBar = kimiko.find(".kimiko-resizer");
    resizeBar.on("mousedown", function () {
        kimiko.addClass(resizeProcess);
        $(window).on("mousemove", mouseDownMoveHandler);
        $(window).on("mouseup", function () {
            kimiko.removeClass(resizeProcess);
            $(window).off("mousemove", mouseDownMoveHandler);
            chrome.storage.local.set({ "kimikowid": kimiko.width() });
        });
    });
}


function frameSetup() {
    frame = kimiko.find("iframe");
    frame.attr("src", url.href);
    frame.on("load", function (event) {
        frame.on("keydown", "body", hotKeyHandler);
    });
}

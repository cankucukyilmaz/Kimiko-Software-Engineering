"use strict";
chrome.storage.local.get(["kimikoid", "kimikowid"], function (result) {
    var id = result.kimikoid;
    if (!result.kimikoid) {
        id = uuid();
        chrome.storage.local.set({ "kimikoid": id });
    }
    if (!result.kimikowid) {
        chrome.storage.local.set({ "kimikowid": 320 });
    }
    console.log(id);
});
chrome.runtime.onMessage.addListener(function (message) {
    if (message.Type === 3) {
        chrome.tabs.query({ active: false }, function (tabs) {
            tabs.forEach(function (tab) {
                if (tab.id)
                    chrome.tabs.sendMessage(tab.id, message);
            });
        });
    }
});
function uuid() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

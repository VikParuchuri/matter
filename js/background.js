// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * @filedescription Initializes the extension's background page.
 */

var doSummary = false;

var create_summary = function(){
    chrome.tabs.executeScript(null, {
        file: "js/summarize.js"
    }, function() {
        if (chrome.extension.lastError) {
            console.error(chrome.extension.lastError);
        }
    });
};

var remove_summary = function(){
    chrome.tabs.executeScript(null, {
        file: "js/unsummarize.js"
    });
};

chrome.tabs.onUpdated.addListener(function(tab_id, change_info, tab){
    if(doSummary && change_info.status === 'complete'){
        create_summary();
    }
});

chrome.extension.onMessage.addListener(function(request, sender) {
    if (request.action == "summary") {
        console.log("Source changed.");
    }
});

// Reset the navigation state on startup. We only want to collect data within a
// session.
chrome.runtime.onStartup.addListener(function() {
    nav.resetDataStorage();
    window.postLogout();
});

function updateIcon() {
    if(doSummary){
        doSummary = false;
        chrome.browserAction.setIcon({path:"icon_inactive.png"});
        remove_summary();
    } else{
        doSummary = true;
        chrome.browserAction.setIcon({path:"icon.png"});
        create_summary();
    }
}

chrome.browserAction.onClicked.addListener(updateIcon);
chrome.browserAction.setIcon({path:"icon_inactive.png"});

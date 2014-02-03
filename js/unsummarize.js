function unsummarize(document_root){
    $("p", document_root).removeClass("key-paragraph");
}

unsummarize(document);

chrome.extension.sendMessage({
    action: "unsummarize"
});
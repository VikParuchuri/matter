function summarize(document_root){
    var paragraphs = $("p", document_root);
    var i;
    var j;
    var text;
    var tokens;
    var token_frequency = Object();
    var max_frequency = [];
    var object_mat = [];
    var mat = [];
    var row;

    for(i=0;i<paragraphs.length;i++){
        row = Object();
        var m = 0;
        text =  paragraphs[i].innerHTML.toLowerCase();
        tokens = text.split(" ");
        for(j=0;j<tokens.length;j++){
            if(row[tokens[j]]!=undefined){
                row[tokens[j]]+=1;
            } else{
                row[tokens[j]]=1;
                if(token_frequency[tokens[j]] != undefined){
                    token_frequency[tokens[j]] += 1;
                } else{
                    token_frequency[tokens[j]] = 1;
                }
            }
            if(row[tokens[j]] > m){
                m = row[tokens[j]];
            }
        }
        max_frequency.push(m);
        object_mat.push(row);
    }

    var row_names = Object.keys(token_frequency);
    if(row_names.length > 5000){
        return;
    }

    for(i=0;i<paragraphs.length;i++){
        row = [];
        var object_row = object_mat[i];
        for(j=0;j<row_names.length;j++){
            if(object_row[row_names[j]] == undefined){
                row.push(0);
            } else{
                var tf = .5 + (.5 * object_row[row_names[j]])/max_frequency[i];
                var idf = Math.log(paragraphs.length/token_frequency[row_names[j]]);
                row.push(tf*idf);
            }
        }
        mat.push(row);
    }

    var full_mat = $M(mat);
    var transpose = full_mat.transpose();
    var similarity = full_mat.multiply(transpose);

    var pagerank = similarity.pagerank(.85);
    var paragraph_count = Math.min(Math.max(Math.floor(paragraphs.length * .1), 4), paragraphs.length);
    var pagerank_clone = pagerank.clone();

    var good_paragraphs = [];
    for(i=0;i<paragraph_count;i++){
        var max_val = Math.max.apply(Math, pagerank_clone);
        good_paragraphs.push(pagerank.indexOf(max_val));
        pagerank_clone.splice(pagerank_clone.indexOf(max_val), 1);
    }

    console.log(good_paragraphs);
    for(i=0;i<paragraph_count;i++){
        $(paragraphs[good_paragraphs[i]]).addClass("key-paragraph");
    }
}

summarize(document);

chrome.extension.sendMessage({
    action: "summary"
});
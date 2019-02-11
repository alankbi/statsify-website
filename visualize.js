var linksChart;
var textChart;
var pagesChart;
var codeMirror;

var stopWords = new Set(["i", "me", "my", "myself", "we", "our", "ours", "ourselves", 
"you", "you're", "you've", "you'll", "you'd", "your", "yours", "yourself", "yourselves", 
"he", "him", "his", "himself", "she", "she's", "her", "hers", "herself", "it", "it's", 
"its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", 
"whom", "this", "that", "that'll", "these", "those", "am", "is", "are", "was", "were", "be", 
"been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", 
"the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", 
"with", "about", "against", "between", "into", "through", "during", "before", "after", "above", 
"below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", 
"then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", 
"more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", 
"too", "very", "s", "t", "can", "will", "just", "don", "don't", "should", "should've", "now", "d", 
"ll", "m", "o", "re", "ve", "y", "ain", "aren", "aren't", "couldn", "couldn't", "didn", "didn't", 
"doesn", "doesn't", "hadn", "hadn't", "hasn", "hasn't", "haven", "haven't", "isn", "isn't", "ma", 
"mightn", "mightn't", "mustn", "mustn't", "needn", "needn't", "shan", "shan't", "shouldn", "shouldn't", 
"wasn", "wasn't", "weren", "weren't", "won", "won't", "wouldn", "wouldn't", ""])

visualize = function (data, searchType) {
    data = data['data'];
    
    var ctx = document.getElementById('links-chart').getContext('2d');
    if (typeof linksChart !== 'undefined') {
        linksChart.destroy();
    }
    linksChart = visualizeLinks(data, ctx, searchType);

    ctx = document.getElementById('text-chart').getContext('2d');
    if (typeof textChart !== 'undefined') {
        textChart.destroy();
    }
    textChart = visualizeText(data, ctx, searchType);

    if (searchType === 'website') {
        var ctx = document.getElementById('pages-chart').getContext('2d');
        if (typeof pagesChart !== 'undefined') {
            pagesChart.destroy();
        }
        pagesChart = visualizePages(data, ctx);
    }
}

visualizePages = function (data, ctx) {
    var items = Object.keys(data['pages']).map(function (key) {
        return [key, data['pages'][key]['freq']];
    });
    
    items.sort(function (first, second) {
        return second[1] - first[1];
    });

    items = items.slice(0, 10)

    pages = [];
    freqs = [];
    for (var i = 0; i < items.length; i++) {
        pages.push(items[i][0]);
        freqs.push(items[i][1]);
    }

    return new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: [{
                data: freqs,
                backgroundColor: '#F95851'
            }],
            labels: pages
        },
        options: {
            responsive: false,
            legend: { display: false },
            title: {
                display: true,
                text: 'Top Linked Pages'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        callback: function(value) {
                            if (value.length > 35) {
                                return value.substr(0, 35) + '...';
                            } else {
                                return value;
                            }
                        },
                        autoSkip: false
                    }
                }]
            }
        }
    });
}

visualizeText = function (data, ctx, searchType) {
    ul = document.getElementById('key-phrases');
    ul.innerHTML = '';
    data['key_phrases'].forEach(function (phrase) {
        var li = document.createElement('li');
        var p = document.createElement('p');
        p.textContent = phrase;
        li.appendChild(p);
        ul.append(li);
    });

    if (searchType === 'page') {
        document.getElementById('word-count-header').innerText = 'Word Count: ';
        document.getElementById('word-count').innerText = data['word_count'];
    } else {
        document.getElementById('word-count-header').innerText = 'Total Word Count: ';
        document.getElementById('word-count').innerText = data['total_word_count'];

        document.getElementById('average-word-count').innerText = data['average_word_count'];
    }

    var textData;
    if (searchType === 'page') {
        textData = createOrderedWordFrequencyMap(data['text']);
    } else {
        text = '';
        Object.keys(data['pages']).forEach(function (key) {
            text += data['pages'][key]['page']['text'];
        });
        textData = createOrderedWordFrequencyMap(text);
    }
    labels = [];
    freqs = [];
    for (var i = 0; i < textData.length; i++) {
        labels.push(textData[i][0]);
        freqs.push(textData[i][1]);
    }

    return new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: [{
                data: freqs,
                backgroundColor: '#55B0D8'
            }],
            labels: labels
        },
        options: {
            responsive: false,
            legend: { display: false },
            title: {
                display: true,
                text: 'Top Occurring Words'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

visualizeLinks = function (data, ctx, searchType) {
    var outboundLinks = data['outbound_links'];
    
    var internalLinks;
    if (searchType === 'page') {
        internalLinks = data['internal_links'];
    } else {
        internalLinks = Object.keys(data['pages']);
    }

    linkData = {
        datasets: [{
            data: [internalLinks.length, outboundLinks.length],
            backgroundColor: ['#55B0D8', '#F95851']
        }],
        labels: [
            'Internal Links',
            'Outbound Links',
        ]
    }

    if (outboundLinks.length > 10) {
        outboundLinks = outboundLinks.slice(0, 9).concat(['...'])
    }
    if (internalLinks.length > 10) {
        internalLinks = internalLinks.slice(0, 9).concat(['...'])
    }

    var ul = document.getElementById('internal-links');
    ul.innerHTML = '';
    for (var i = 0; i < internalLinks.length; i++) {
        ul.appendChild(createListItemWithLink(internalLinks[i]));
    }

    ul = document.getElementById('outbound-links');
    ul.innerHTML = '';
    for (var i = 0; i < outboundLinks.length; i++) {
        ul.appendChild(createListItemWithLink(outboundLinks[i]));
    }

    return new Chart(ctx, {
        type: 'pie',
        data: linkData,
        options: {
            responsive: false,
            title: {
                display: true,
                text: 'Internal vs. Outbound Links'
              }
        }
    });
}

renderJSON = function (json) {
    if (typeof codeMirror !== 'undefined') {
        codeMirror.setValue(JSON.stringify(json, null, 4));
    } else {
        var display = document.getElementById('json-display');
        display.value = JSON.stringify(json, null, 4);
        codeMirror = CodeMirror.fromTextArea(display, {
            lineNumbers: true,
            mode: 'application/ld+json',
            readOnly: true,
            lineWrapping: true,
        });
    }

    var node = JsonHuman.format(json, {
        hyperlinks : {
            enable : true,
            keys: ['internal_links', 'outbound_links'],
            
        },
    });

    var wrapper = document.getElementById('json-wrapper');
    if (wrapper.hasChildNodes()) {
        wrapper.removeChild(wrapper.childNodes[0]);
    }
    wrapper.appendChild(node);
}

createListItemWithLink = function (link) {
    var li = document.createElement('li');

    if (link === '...') {
        var p = document.createElement('p');
        p.textContent = link;
        li.append(p);
    } else {
        var a = document.createElement('a');
        a.textContent = link;
        a.setAttribute('href', link)
        li.appendChild(a);
    }
    return li;
}

createOrderedWordFrequencyMap = function (text) {
    var words = text.replace(/[.]/g, '').split(/\s/);
    var freqMap = {};
    words.forEach(function (w) {
        if (stopWords.has(w.toLowerCase())) {
            return;
        }
        if (!freqMap[w]) {
            freqMap[w] = 0;
        }
        freqMap[w] += 1;
    });

    var items = Object.keys(freqMap).map(function (key) {
        return [key, freqMap[key]];
    });
    
    items.sort(function (first, second) {
        return second[1] - first[1];
    });

    return items.slice(0, 10)
}
var linksChart;
var textChart;

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
        // do extra stuff
    }
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
    //.innerText = data['key_phrases'].toString()
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
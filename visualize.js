var pageLinksChart;
var pageTextChart;

visualize = function (data) {
    data = data['data'];
    
    var ctx = document.getElementById('pageLinksChart').getContext('2d');
    if (typeof pageLinksChart !== 'undefined') {
        pageLinksChart.destroy();
    }
    pageLinksChart = visualizeLinks(data, ctx);

    ctx = document.getElementById('pageTextChart').getContext('2d');
    if (typeof pageTextChart !== 'undefined') {
        pageTextChart.destroy();
    }
    pageTextChart = visualizeText(data, ctx);
}

visualizeText = function (data, ctx) {
    document.getElementById('pageKeyPhrases').innerText = data['key_phrases'].toString()
    document.getElementById('pageWordCount').innerText = data['word_count']

    textData = createOrderedWordFrequencyMap(data['text']);
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

visualizeLinks = function (data, ctx) {
    var internalLinks = data['internal_links'];
    var outboundLinks = data['outbound_links'];

    var ul = document.getElementById('pageInternalLinks');
    ul.innerHTML = '';
    for (var i = 0; i < internalLinks.length; i++) {
        ul.appendChild(createListItemWithLink(internalLinks[i]));
    }

    ul = document.getElementById('pageOutboundLinks');
    ul.innerHTML = '';
    for (var i = 0; i < outboundLinks.length; i++) {
        ul.appendChild(createListItemWithLink(outboundLinks[i]));
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
    var a = document.createElement('a');
    a.textContent = link;
    a.setAttribute('href', link)

    var li = document.createElement('li');
    li.appendChild(a);
    return li;
}

createOrderedWordFrequencyMap = function (text) {
    var words = text.replace(/[.]/g, '').split(/\s/);
    var freqMap = {};
    words.forEach(function(w) {
        if (!freqMap[w]) {
            freqMap[w] = 0;
        }
        freqMap[w] += 1;
    });

    var items = Object.keys(freqMap).map(function(key) {
        return [key, freqMap[key]];
    });
    
    items.sort(function(first, second) {
        return second[1] - first[1];
    });

    return items.slice(0, 10)
}
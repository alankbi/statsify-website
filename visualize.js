visualize = function (data) {
    if (data.hasOwnProperty('error')) {
        alert(data['error']);
        return;
    } 
    data = data['data'];

    var ctx = document.getElementById('pageLinksChart');
    var pageLinksChart = visualizeLinks(data, ctx);
}

visualizeLinks = function (data, ctx) {
    var internalLinks = data['internal_links'];
    var outboundLinks = data['outbound_links'];

    for (var i = 0; i < internalLinks.length; i++) {
        var ul = document.getElementById('pageInternalLinks');
        ul.appendChild(createListItemWithLink(internalLinks[i]));
    }

    for (var i = 0; i < outboundLinks.length; i++) {
        var ul = document.getElementById('pageOutboundLinks');
        ul.appendChild(createListItemWithLink(outboundLinks[i]));
    }

    linkData = {
        datasets: [{
            data: [internalLinks.length, outboundLinks.length],
            backgroundColor: ['#F95851', '#55B0D8']
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
            responsive: false
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
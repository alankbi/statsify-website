var searchOptions = ['PAGE', 'WEBSITE']
var searchOptionIndex = 0;
var extensionMode = false;

onDropdownClicked = function () {
    document.getElementById('dropdown-content').classList.toggle('show');
    document.getElementById('drop-btn').classList.toggle('sharp-bottom-edges');
}

onDropdownOptionClicked = function () {
    searchOptionIndex = 1 - searchOptionIndex;
    var dropBtn = document.getElementById('drop-btn');
    var dropOpt = document.getElementById('drop-option');

    dropBtn.innerHTML = searchOptions[searchOptionIndex];
    dropOpt.innerHTML = searchOptions[1 - searchOptionIndex];

    dropBtn.classList.toggle('page-btn');
    dropBtn.classList.toggle('website-btn');
    dropOpt.classList.toggle('page-btn');
    dropOpt.classList.toggle('website-btn');

    var selectDepth = document.getElementById('select-depth');
    if (searchOptionIndex === 1) {
        selectDepth.style.display = 'inline-block';
    } else {
        selectDepth.style.display = 'none';
    }
}

displayError = function (error) {
    var errorElement = document.getElementById('error-message');
    errorElement.innerText = error;
    errorElement.style.display = 'initial';
    
    document.getElementById('search-url').classList.add('invalid');
}

isValidUrl = function (url) {
    var pattern = new RegExp('^(https?:\\/\\/)?' +
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
    '((\\d{1,3}\\.){3}\\d{1,3}))' +
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
    '(\\?[;&a-z\\d%_.~+=-]*)?' +
    '(\\#[-a-z\\d_]*)?$','i');
    return pattern.test(url);
}

onSearchUrlChange = function () {
    document.getElementById('search-url').classList.remove('invalid');
}

onSearch = function () {
    var searchType = searchOptions[searchOptionIndex].toLowerCase();
    var requestUrl = 'https://statsify.herokuapp.com/' + searchType;
    // var requestUrl = 'http://localhost:8000/' + searchOptions[searchOptionIndex].toLowerCase();

    var searchUrlField = document.getElementById('search-url');
    if (isValidUrl(searchUrlField.value)) {
        requestUrl += '?url=' + searchUrlField.value;
    } else {
        displayError('Please enter a valid URL.')
        return;
    }

    if (searchOptionIndex === 1) {
        var selectDepth = document.getElementById('select-depth');
        var depth = selectDepth.options[selectDepth.selectedIndex].value;
        requestUrl += '&depth=' + depth;
    }
    console.log(requestUrl);

    document.getElementById('visualizations').style.display = 'none';
    Array.prototype.forEach.call(document.getElementsByClassName('website-item'), function (item) {
        item.style.display = 'none';
    });
    document.getElementById('logo').setAttribute('src', 'loading_logo.gif');

    var xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
            document.getElementById('logo').setAttribute('src', 'logo.png');
            data = JSON.parse(this.responseText);
            if (data.hasOwnProperty('error')) {
                displayError(data['error']);
                return;
            }

            var urlHeader = document.getElementById('url-visualization-header');
            urlHeader.innerText = searchUrlField.value;
            if (searchUrlField.value.startsWith('http')) {
                urlHeader.href = searchUrlField.value;
            } else {
                urlHeader.href = 'http://' + searchUrlField.value;
            }
            urlHeader.target = '_blank';
                
            
            document.getElementById('visualizations').style.display = 'block';
            if (searchType === 'website') {
                Array.prototype.forEach.call(document.getElementsByClassName('website-item'), function (item) {
                    item.style.display = 'block';
                });
            }
            visualize(data, searchType)
            if (!extensionMode) {
                renderJSON(data);
            }
        }
      });

    xhr.open('GET', requestUrl);
    xhr.send();
}

window.onclick = function (event) {
    document.getElementById('error-message').style.display = 'none';
    
    if (!event.target.matches('.drop-btn')) {
        var dropdown = document.getElementById('dropdown-content');
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
            document.getElementById('drop-btn').classList.remove('sharp-bottom-edges');
        }
    }
}

checkUrlParameters = function () {
    var params = new URL(window.location.href).searchParams;
    var url = params.get('url');
    var depth = params.get('depth');

    if (params.get('type') === 'website') {
        onDropdownOptionClicked();
    }
    if (depth !== null && !isNaN(depth) && (function (x) { return (x | 0) === x; })(parseFloat(depth))) {
        document.getElementById('select-depth').value = Math.max(0, Math.min(8, depth));
    }
    if (url !== null) {
        document.getElementById('search-url').value = url;
        onSearch();
    }

    extensionMode = (params.get('extensionMode') === 'true');

    if (extensionMode) {
        document.getElementById('body').style.display = 'none';
        document.getElementById('search').style.display = 'none';
        document.getElementById('json-container').style.display = 'none';
        
        var linksChart = document.getElementById('links-chart');
        linksChart.width = 380;
        linksChart.height = 380;

        var linksChart = document.getElementById('links-chart');
        linksChart.width = 360;
        linksChart.height = 360;

        var textChart = document.getElementById('text-chart');
        textChart.style.padding = 5;
        textChart.width = 360;
        textChart.height = 240;

        var baseUrl = [location.protocol, '//', location.host, location.pathname].join('');
        
        params.delete('extensionMode');
        var statsifyLink = document.getElementById('statsify-text-link');
        statsifyLink.setAttribute('href', baseUrl + '?' + params.toString());
        statsifyLink.innerText = 'Statsify.us';

        var a = document.createElement('a');
        a.textContent = 'Statsify this website';
        params.append('type', 'website');
        a.setAttribute('href', baseUrl + '?' + params.toString());
        document.getElementById('visualizations').append(a);

        Array.prototype.forEach.call(document.body.getElementsByTagName('a'), function (link) {
            link.setAttribute('target', '_blank');
        });

    }
}

window.onload = function () {
    checkUrlParameters();
    document.getElementById('search-url').addEventListener('keyup', function (e) {
        e.preventDefault();
        if (e.keyCode === 13) { // ENTER
            document.getElementById('search-btn').click();
        }
    });
}
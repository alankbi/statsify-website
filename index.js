var searchOptions = ['Page', 'Website']
var searchOptionIndex = 0;

onDropdownClicked = function () {
    document.getElementById('dropdown-content').classList.toggle('show');
    document.getElementById('drop-btn').classList.toggle('sharp-bottom-edges');
}

onDropdownOptionClicked = function () {
    searchOptionIndex = 1 - searchOptionIndex;
    document.getElementById('drop-btn').innerHTML = searchOptions[searchOptionIndex];
    document.getElementById('drop-option').innerHTML = searchOptions[1 - searchOptionIndex];

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
    document.getElementById('loading').style.display = 'initial';

    var xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
            document.getElementById('loading').style.display = 'none';
            data = JSON.parse(this.responseText);
            if (data.hasOwnProperty('error')) {
                displayError(data['error']);
                return;
            }
            document.getElementById('visualizations').style.display = 'block';
            if (searchType === 'website') {
                Array.prototype.forEach.call(document.getElementsByClassName('website-item'), function (item) {
                    item.style.display = 'initial';
                });
            }
            visualize(data, searchType)
            renderJSON(data);
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
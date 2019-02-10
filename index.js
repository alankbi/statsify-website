var searchOptions = ['Page', 'Website']
var searchOptionIndex = 0;

onDropdownClicked = function () {
    document.getElementById('dropdown-content').classList.toggle('show');
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
    //var requestUrl = 'https://website-visualizer.herokuapp.com/' + searchOptions[searchOptionIndex].toLowerCase();
    var requestUrl = 'http://localhost:8000/' + searchOptions[searchOptionIndex].toLowerCase();

    var searchUrlField = document.getElementById('search-url');
    if (isValidUrl(searchUrlField.value)) {
        requestUrl += '?url=' + searchUrlField.value;
    } else {
        searchUrlField.classList.add('invalid');
        return;
    }

    if (searchOptionIndex === 1) {
        var selectDepth = document.getElementById('select-depth');
        var depth = selectDepth.options[selectDepth.selectedIndex].value;
        requestUrl += '&depth=' + depth;
    }
    console.log(requestUrl);

    var xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
          console.log(this.responseText);
        }
      });

    xhr.open('GET', requestUrl);
    xhr.send();
}

window.onclick = function(event) {
    if (!event.target.matches('.drop-btn')) {
        var dropdown = document.getElementById('dropdown-content');
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
}
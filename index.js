var searchOptions = ['Page', 'Website']
var searchOptionIndex = 0;

onDropdownClicked = function () {
    document.getElementById('dropdown-content').classList.toggle('show');
}

onDropdownOptionClicked = function () {
    searchOptionIndex = 1 - searchOptionIndex;
    document.getElementById('drop-btn').innerHTML = searchOptions[searchOptionIndex];
    document.getElementById('drop-option').innerHTML = searchOptions[1 - searchOptionIndex];
}

window.onclick = function(event) {
    if (!event.target.matches('.drop-btn')) {
        var dropdown = document.getElementById('dropdown-content');
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
}
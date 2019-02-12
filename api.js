showPageResponse = function () {
    var pageResponse = {
        'data': {
            'internal_links': [
                'http://example.com/example',
                'http://example.com/unique-internal-links'
            ],
            'key_phrases': [
                'Example Key Phrase',
                'Title Capitalization Format',
                'Three Words Each'
            ],
            'outbound_links': [
                'https://google.com',
                'https://yahoo.com'
            ],
            'text': 'Example Website Text.\nLorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'url': 'http://example.com',
            'word_count': 100
        }
    }
    var display = document.getElementById('page-response');
    display.value = JSON.stringify(pageResponse, null, 4);
    codeMirror = CodeMirror.fromTextArea(display, {
        lineNumbers: true,
        mode: 'application/ld+json',
        readOnly: true,
        lineWrapping: true,
    });
}

showWebsiteResponse = function () {
    var websiteResponse = {
        'data': {
            'average_word_count': 100.0,
            'key_phrases': [
                'Example Key Phrase',
                'Title Capitalization Format',
                'Three Words Each'
            ],
            'outbound_links': [
                'https://google.com',
                'https://yahoo.com'
            ],
            'pages': {
                'http://example.com': {
                    'freq': 2,
                    'page': {
                        'internal_links': [
                            'http://example.com/example',
                            'http://example.com/unique-internal-links'
                        ],
                        'key_phrases': [
                            'Example Key Phrase',
                            'Title Capitalization Format',
                            'Three Words Each'
                        ],
                        'outbound_links': [
                            'https://google.com',
                            'https://yahoo.com'
                        ],
                        'text': 'Example Website Text.\nLorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        'url': 'http://example.com',
                        'word_count': 100
                    }
                },
                'http://example.com/example': {
                    'freq': 1,
                    'page': {
                        'internal_links': [
                            'http://example.com',
                        ],
                        'key_phrases': [
                            'Example Key Phrase',
                            'Title Capitalization Format',
                            'Three Words Each'
                        ],
                        'outbound_links': [
                            'https://google.com',
                            'https://yahoo.com'
                        ],
                        'text': 'Example Website Text.\nLorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        'url': 'http://example.com/example',
                        'word_count': 100
                    }
                },
                'http://example.com/unique-internal-links': '...and so on...'
            },
            'total_word_count': 200
        }
    }
    var display = document.getElementById('website-response');
    display.value = JSON.stringify(websiteResponse, null, 4);
    codeMirror = CodeMirror.fromTextArea(display, {
        lineNumbers: true,
        mode: 'application/ld+json',
        readOnly: true,
        lineWrapping: true,
    });
}

showErrorResponse = function () {
    var errorResponse = {
        'error': 'An error occurred when trying to reach this url.'
    }
    var display = document.getElementById('error-response');
    display.value = JSON.stringify(errorResponse, null, 4);
    codeMirror = CodeMirror.fromTextArea(display, {
        lineNumbers: true,
        mode: 'application/ld+json',
        readOnly: true,
        lineWrapping: true,
    });
}

showOtherResponse = function () {
    var otherResponse = {
        'internal_links': [],
        'key_phrases': [],
        'outbound_links': [],
        'text': '',
        'url': '*',
        'word_count': 0
    }
    var display = document.getElementById('other-response');
    display.value = JSON.stringify(otherResponse, null, 4);
    codeMirror = CodeMirror.fromTextArea(display, {
        lineNumbers: true,
        mode: 'application/ld+json',
        readOnly: true,
        lineWrapping: true,
    });
}

window.onload = function () {
    showPageResponse();
    showWebsiteResponse();
    showErrorResponse();
    showOtherResponse();
};

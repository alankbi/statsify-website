showPageResponse = function () {
    var pageResponse = {
        'data': {
            'internal_links': [
                'http://website-visualizer.com/',
                'http://website-visualizer.com/api/'
            ],
            'key_phrases': [
                'Visualize A Website',
                'Show Key Stats',
                'Number Of Pages'
            ],
            'outbound_links': [
                'https://github.com/alankbi/'
            ],
            'text': 'Visualize a Website\nShow key stats such as word count, number of pages, and more... (continued)',
            'url': 'website-visualizer.com',
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
                'Visualize A Website',
                'Show Key Stats',
                'Number Of Pages'
            ],
            'outbound_links': [
                'https://github.com/alankbi'
            ],
            'pages': {
                'http://website-visualizer.com/': {
                    'freq': 1,
                    'page': {
                        'internal_links': [
                            'http://website-visualizer.com/',
                            'http://website-visualizer.com/api/',
                        ],
                        'key_phrases': [
                            'Visualize A Website',
                            'Show Key Stats',
                            'Number Of Pages'
                        ],
                        'outbound_links': [
                            'https://github.com/alankbi'
                        ],
                        'text': 'Visualize a Website\nShow key stats such as word count, number of pages, and more... (continued)',
                        'url': 'http://website-visualizer.com/',
                        'word_count': 100
                    }
                },
                'http://website-visualizer.com/api/': {
                    'freq': 1,
                    'page': {
                        'internal_links': [
                            'http://website-visualizer.com/',
                            'http://website-visualizer.com/api/'
                        ],
                        'key_phrases': [
                            'Visualize A Website',
                            'Show Key Stats',
                            'Number Of Pages'
                        ],
                        'outbound_links': [
                            'https://github.com/alankbi/news-app'
                        ],
                        'text': 'API Documentation\nPage Endpoint... (continued)',
                        'url': 'http://website-visualizer.com/api/',
                        'word_count': 100
                    }
                }
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

window.onload = function () {
    showPageResponse();
    showWebsiteResponse();
};

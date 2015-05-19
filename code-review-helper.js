// ==UserScript==
// @name         GitHub code review helper
// @namespace    https://github.com/victor-homyakov/
// @version      0.4.0
// @description  Open/hide GitHub diff when clicking on diff header
// @author       Victor Homyakov
// @copyright    2013+, Victor Homyakov
// @include      http*://github.com/*/*/commit/*
// @include      http*://github.com/*/*/pull/*
// @include      http*://github.com/*/*/compare/*
// @grant none
// ==/UserScript==

function hasClass(/*HTMLElement*/element, className) {
    return element && element.classList && element.classList.contains(className);
}

function isDiffHeader(element) {
    return hasClass(element, 'file-header');
}

function isDiffContent(element) {
    return hasClass(element, 'image') || hasClass(element, 'data') || hasClass(element, 'render-wrapper');
}

function isDiffFileName(/*HTMLElement*/element) {
    return element && element.tagName === 'SPAN' && element.title && isDiffHeader(element.parentElement.parentElement);
}

function toggle(element) {
    element.hidden = !element.hidden;
    element.style.display = element.hidden ? 'none' : '';
}

function toggleDiff(target) {
    while (target) {
        if (hasClass(target, 'file-actions')) {
            break;
        }
        if (isDiffHeader(target)) {
            var next = target;

            next = next.nextElementSibling;
            if (isDiffContent(next)) {
                toggle(next);
            }

            next = next.nextElementSibling;
            if (isDiffContent(next)) {
                toggle(next);
            }

            break;
        }
        target = target.parentElement;
    }
}

document.body.addEventListener('click', function(/*Event*/event) {
    var /*HTMLElement*/element = event.target;
    if (event.ctrlKey && isDiffFileName(element)) {
        var fileExt = element.title.replace(/^.*(\.\w+)$/, '$1');
        var similarFileNames = document.querySelectorAll('.file-header span[title$="' + fileExt + '"]');
        for (var i = 0; i < similarFileNames.length; i++) {
            toggleDiff(similarFileNames[i]);
        }
    } else {
        toggleDiff(element);
    }
});

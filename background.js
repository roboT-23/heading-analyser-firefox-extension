browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "analyzeHeadings") {
        browser.tabs.executeScript({
            code: `(${analyzeHeadings.toString()})()`
        }).then(results => {
            if (results && results[0]) {
                sendResponse(results[0]);
            } else {
                sendResponse(undefined);
            }
        }).catch(error => {
            sendResponse(undefined);
        });
    }
    return true;
});

function analyzeHeadings() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const counts = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
    const headingData = [];

    headings.forEach(heading => {
        counts[heading.tagName.toLowerCase()]++;
        headingData.push({ tag: heading.tagName, text: heading.textContent.trim() });
    });

    return { headings: headingData, counts: counts };
}

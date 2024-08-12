document.addEventListener('DOMContentLoaded', function() {
    browser.runtime.sendMessage({ action: "analyzeHeadings" }, function(result) {
        if (result) {
            const accordionDiv = document.getElementById('accordion');
            const summaryDiv = document.getElementById('summary');
            const headingGroups = {};

            result.headings.forEach(heading => {
                if (!headingGroups[heading.tag]) {
                    headingGroups[heading.tag] = [];
                }
                headingGroups[heading.tag].push(heading.text);
            });

            Object.keys(headingGroups).forEach(tag => {
                const accordion = document.createElement('button');
                accordion.className = 'accordion';
                accordion.textContent = `${tag.toUpperCase()} (${headingGroups[tag].length})`;

                const panel = document.createElement('div');
                panel.className = 'panel';

                headingGroups[tag].forEach(text => {
                    const p = document.createElement('p');
                    p.textContent = text;
                    panel.appendChild(p);
                });

                accordionDiv.appendChild(accordion);
                accordionDiv.appendChild(panel);

                accordion.addEventListener('click', function() {
                    this.classList.toggle('active');
                    const panel = this.nextElementSibling;
                    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
                });
            });

            // Vytvorenie sumarizácie
            for (let tag in result.counts) {
                const p = document.createElement('p');
                p.textContent = `${tag.toUpperCase()}: ${result.counts[tag]}`;
                summaryDiv.appendChild(p);
            }
        } else {
            console.error('No results returned.');
        }
    });
});

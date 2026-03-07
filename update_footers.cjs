const fs = require('fs');
const path = require('path');

// Source of truth
const templateHtml = fs.readFileSync('footer_template.html', 'utf8');

// Extract the inner content of the footer from the template
// Template has Join Arkan (Top Half) + Bottom Half
const templateFooterMatch = templateHtml.match(/<footer[^>]*>([\s\S]*?)<\/footer>/);
if (!templateFooterMatch) {
    console.error("Could not find footer in footer_template.html");
    process.exit(1);
}
const templateFooterInner = templateFooterMatch[1];

// Extract just the bottom half for pages that don't want the Join Arkan section
// The bottom half starts with <!-- Bottom Half: Links & Copyright -->
const bottomHalfMatch = templateFooterInner.match(/(<!-- Bottom Half: Links & Copyright -->[\s\S]*)/);
const bottomHalfInner = bottomHalfMatch ? bottomHalfMatch[1] : templateFooterInner;

const filesToUpdate = [
    { name: 'index.html', type: 'full' },
    { name: 'about.html', type: 'full' },
    { name: 'journal.html', type: 'full' },
    { name: 'journal-detail.html', type: 'full' },
    { name: 'portfolio.html', type: 'full' },
    { name: 'portfolio-detail.html', type: 'full' },
    { name: 'sustainability.html', type: 'full' },
    { name: 'arkan-about.html', type: 'full' },
    { name: 'contact.html', type: 'bottom' },
    { name: 'careers.html', type: 'bottom' },
    { name: 'careers-detail.html', type: 'bottom' }
];

filesToUpdate.forEach(fileObj => {
    const file = fileObj.name;
    if (!fs.existsSync(file)) return;
    
    let content = fs.readFileSync(file, 'utf8');

    // Find the footer tag and its attributes
    const footerRegex = /<footer([^>]*)>([\s\S]*?)<\/footer>/;
    const match = content.match(footerRegex);

    if (match) {
        const attributes = match[1];
        const inner = match[2];
        let replacementInner = fileObj.type === 'full' ? templateFooterInner : bottomHalfInner;
        
        // Special case for index.html: it has a <div> inside that needs to stay for the GSAP animation
        if (file === 'index.html') {
            const innerDivRegex = /(<div[^>]*max-w-\[1920px\][^>]*>)([\s\S]*?)(<\/div>)/;
            const innerDivMatch = inner.match(innerDivRegex);
            if (innerDivMatch) {
                replacementInner = `${innerDivMatch[1]}\n${replacementInner}\n${innerDivMatch[3]}`;
            }
        }

        const newFooterTag = `<footer${attributes}>${replacementInner}</footer>`;
        const newContent = content.replace(footerRegex, newFooterTag);
        fs.writeFileSync(file, newContent);
        console.log(`Updated ${file} (${fileObj.type})`);
    } else {
        console.error(`Could not find <footer> in ${file}`);
    }
});

const fs = require('fs');
const path = require('path');

const contactHtml = fs.readFileSync('contact.html', 'utf8');

// The footer we want to copy
const footerMatch = contactHtml.match(/(<!-- Footer -->[\s\S]*?<\/footer>)/);
if (!footerMatch) {
    console.error("Could not find footer in contact.html");
    process.exit(1);
}
const newFooter = footerMatch[1];

const filesToUpdate = [
    'index.html',
    'about.html',
    'journal.html',
    'journal-detail.html',
    'portfolio.html',
    'portfolio-detail.html'
];

filesToUpdate.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // They have both <!-- Careers Section --> and <!-- Footer -->
    // Replace from <!-- Careers Section --> up to the end of </footer>
    const startMarker = '<!-- Careers Section -->';
    const startIndex = content.indexOf(startMarker);

    if (startIndex !== -1) {
        const endMarker = '</footer>';
        const endIndex = content.indexOf(endMarker, startIndex) + endMarker.length;

        if (endIndex > endMarker.length) {
            const before = content.substring(0, startIndex);
            const after = content.substring(endIndex);
            fs.writeFileSync(file, before + newFooter + after);
            console.log(`Updated ${file}`);
        } else {
            console.error(`Could not find </footer> in ${file}`);
        }
    } else {
        // If there is no careers section, just replace the footer
        const footerStartIndex = content.indexOf('<!-- Footer -->');
        if (footerStartIndex !== -1) {
            const endMarker = '</footer>';
            const endIndex = content.indexOf(endMarker, footerStartIndex) + endMarker.length;
            if (endIndex > endMarker.length) {
                const before = content.substring(0, footerStartIndex);
                const after = content.substring(endIndex);
                fs.writeFileSync(file, before + newFooter + after);
                console.log(`Updated ${file} (Footer only)`);
            }
        } else {
            console.log(`Could not find <!-- Careers Section --> or <!-- Footer --> in ${file}`);
        }
    }
});

const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'erolo', 'OneDrive', 'Desktop', 'Özcan Gaming Store', 'js', 'app.js');
let content = fs.readFileSync(filePath, 'utf8');

// Fix the spaces introduced by the formatter
content = content.replace(/<\s+([a-zA-Z0-9_-]+)/g, '<$1');
content = content.replace(/<\/\s+([a-zA-Z0-9_-]+)\s*>/g, '</$1>');
content = content.replace(/<\s*\/\s*>/g, '/>');

// Specific fixes for attributes
// < div class= "container" > -> <div class="container">
content = content.replace(/class\s*=\s*"/g, 'class="');
content = content.replace(/id\s*=\s*"/g, 'id="');
content = content.replace(/style\s*=\s*"/g, 'style="');
content = content.replace(/href\s*=\s*"/g, 'href="');
content = content.replace(/src\s*=\s*"/g, 'src="');
content = content.replace(/onclick\s*=\s*"/g, 'onclick="');

// Fix closing tags that got spaced out: < div ... > -> <div ...>
content = content.replace(/"\s*>/g, '">');

// Specific fix for: < i data - lucide="${icon}" ></i >
content = content.replace(/data\s*-\s*lucide/g, 'data-lucide');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Fixed HTML tags in app.js");

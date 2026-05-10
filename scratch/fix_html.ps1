$path = ".\js\app.js"
$content = [System.IO.File]::ReadAllText($path)

# Fix spaces after opening tags: < div -> <div
$content = [System.Text.RegularExpressions.Regex]::Replace($content, '<\s+([a-zA-Z0-9_-]+)', '<$1')

# Fix spaces in closing tags: </ div > -> </div>
$content = [System.Text.RegularExpressions.Regex]::Replace($content, '<\/\s+([a-zA-Z0-9_-]+)\s*>', '</$1>')

# Fix spaces before closing tags: >
$content = [System.Text.RegularExpressions.Regex]::Replace($content, '\s+>', '>')

# Fix self closing: < / >
$content = [System.Text.RegularExpressions.Regex]::Replace($content, '<\s*\/\s*>', '/>')

# Fix data-lucide attribute
$content = [System.Text.RegularExpressions.Regex]::Replace($content, 'data\s*-\s*lucide', 'data-lucide')

# Fix class/id/style attributes
$content = [System.Text.RegularExpressions.Regex]::Replace($content, 'class\s*=\s*"', 'class="')
$content = [System.Text.RegularExpressions.Regex]::Replace($content, 'id\s*=\s*"', 'id="')
$content = [System.Text.RegularExpressions.Regex]::Replace($content, 'style\s*=\s*"', 'style="')
$content = [System.Text.RegularExpressions.Regex]::Replace($content, 'href\s*=\s*"', 'href="')

# Fix quotes and closing brace
$content = [System.Text.RegularExpressions.Regex]::Replace($content, '"\s*>', '">')

[System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
Write-Output "Done"

$files = Get-ChildItem 'c:\Users\Ancimmm\Documents\tokoandis\src' -Recurse -Filter '*.tsx'
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    if ($content -match '6281234567890') {
        $updated = $content -replace '6281234567890', '6282125523466'
        Set-Content $f.FullName -Value $updated -NoNewline
        Write-Output "Updated: $($f.Name)"
    }
}

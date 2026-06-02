$content = Get-Content 'C:\Users\Ancimmm\.gemini\antigravity-ide\brain\a59c42b0-afb8-4858-8702-140455b4393e\.system_generated\steps\19\content.md' -Raw
$matches = [regex]::Matches($content, 'font-bold text-slate-900 text-sm.*?>(.*?)<')
foreach($m in $matches){
    Write-Output $m.Groups[1].Value
}

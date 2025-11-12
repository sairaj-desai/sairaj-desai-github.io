Param(
    [int]$Port = 8000
)

$base = (Get-Location).Path
Add-Type -AssemblyName System.Net
$listener = [System.Net.HttpListener]::new()
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host ("Serving $base at $prefix")

function Get-ContentType($file) {
    $lower = $file.ToLower()
    if ($lower.EndsWith('.html')) { return 'text/html' }
    elseif ($lower.EndsWith('.css')) { return 'text/css' }
    elseif ($lower.EndsWith('.js')) { return 'application/javascript' }
    elseif ($lower.EndsWith('.png')) { return 'image/png' }
    elseif ($lower.EndsWith('.jpg') -or $lower.EndsWith('.jpeg')) { return 'image/jpeg' }
    elseif ($lower.EndsWith('.svg')) { return 'image/svg+xml' }
    elseif ($lower.EndsWith('.webm')) { return 'video/webm' }
    elseif ($lower.EndsWith('.mp4')) { return 'video/mp4' }
    else { return 'application/octet-stream' }
}

while ($true) {
    $context = $listener.GetContext()
    $rel = $context.Request.Url.AbsolutePath.TrimStart('/')
    if ([string]::IsNullOrEmpty($rel)) { $rel = 'index.html' }
    $file = Join-Path $base $rel
    if (Test-Path $file) {
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $context.Response.ContentType = Get-ContentType $file
        $context.Response.StatusCode = 200
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $context.Response.StatusCode = 404
    }
    $context.Response.Close()
}
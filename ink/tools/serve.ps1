try {
    # HttpListener is available in modern PowerShell/.NET, no explicit Add-Type needed
    [void][System.Reflection.Assembly]::LoadWithPartialName('System')
} catch {
    # Continue; type should still be resolvable
}
$root = Join-Path $PSScriptRoot ".."
$root = Resolve-Path $root

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8000/")
$listener.Start()
Write-Host "Server running at http://localhost:8000/ (root: $root)"

while ($true) {
    $context = $listener.GetContext()
    $requestPath = $context.Request.Url.AbsolutePath.TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($requestPath)) {
        $file = Join-Path $root "index.html"
    } else {
        $file = Join-Path $root $requestPath
        if (!(Test-Path $file)) {
            $file = Join-Path $root "index.html"
        }
    }
    try {
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $context.Response.ContentType = "text/html"
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } catch {
        $context.Response.StatusCode = 404
    } finally {
        $context.Response.Close()
    }
}
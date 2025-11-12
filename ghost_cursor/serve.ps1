param(
  [int]$Port = 5500
)

$ErrorActionPreference = 'Stop'

$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Preview URL: $prefix"

function Get-MimeType($path) {
  switch ([IO.Path]::GetExtension($path).ToLower()) {
    '.html' { return 'text/html' }
    '.css'  { return 'text/css' }
    '.js'   { return 'application/javascript' }
    '.png'  { return 'image/png' }
    '.jpg'  { return 'image/jpeg' }
    '.jpeg' { return 'image/jpeg' }
    '.mp4'  { return 'video/mp4' }
    '.svg'  { return 'image/svg+xml' }
    default { return 'text/plain' }
  }
}

while ($true) {
  $context = $listener.GetContext()
  $request = $context.Request
  $localPath = $request.Url.LocalPath.TrimStart('/')
  if ([string]::IsNullOrWhiteSpace($localPath)) { $localPath = 'index.html' }
  $path = Join-Path (Get-Location) $localPath

  try {
    if (-not (Test-Path $path)) {
      $context.Response.StatusCode = 404
      $bytes = [Text.Encoding]::UTF8.GetBytes('Not Found')
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    else {
      $bytes = [IO.File]::ReadAllBytes($path)
      $context.Response.ContentType = Get-MimeType $path
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
  }
  catch {
    $context.Response.StatusCode = 500
    $err = $_.Exception.Message
    $bytes = [Text.Encoding]::UTF8.GetBytes($err)
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  }
  finally {
    $context.Response.Close()
  }
}
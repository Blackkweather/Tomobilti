# Requires: psql (PostgreSQL client) in PATH
# Purpose: Tries provided passwords, sets/persists DATABASE_URL, and applies schema

param(
    [string]$DbHost = 'localhost',
    [int]$Port = 5432,
    [string]$DbName = 'Tomobilti',
    [string]$User = 'postgres',
    [string[]]$Passwords = @('Brams324brams','brams324brams'),
    [switch]$RequireSSL
)

$ErrorActionPreference = 'Stop'

function Test-CommandExists {
    param([string]$Name)
    $cmd = Get-Command $Name -ErrorAction SilentlyContinue
    return $null -ne $cmd
}

if (-not (Test-CommandExists -Name 'psql')) {
    Write-Error 'psql command not found. Please install PostgreSQL client tools and ensure psql is in PATH.'
}

function Try-Connect {
    param([string]$Url)
    try {
        $out = & psql "$Url" -t -A -c 'select 1;' 2>$null
        if ($LASTEXITCODE -eq 0 -and $out -match '^1$') { return $true }
        return $false
    } catch { return $false }
}

Write-Host '=== Database setup starting ==='
Write-Host "Host: $DbHost  Port: $Port  DB: $DbName  User: $User"

$sslSuffix = if ($RequireSSL) { '?sslmode=require' } else { '' }
$workingUrl = $null

foreach ($pw in $Passwords) {
    # Build URL using -f format operator to avoid interpolation ambiguities
    $candidate = ("postgres://{0}:{1}@{2}:{3}/{4}{5}" -f $User, $pw, $DbHost, $Port, $DbName, $sslSuffix)
    Write-Host "Trying password candidate: $pw"
    if (Try-Connect -Url $candidate) {
        $workingUrl = $candidate
        Write-Host 'Connection successful.'
        break
    } else {
        Write-Host 'Connection failed.'
    }
}

if (-not $workingUrl) {
    Write-Error 'None of the provided passwords worked. Update Passwords or reset the role password.'
}

# Set for current session
$env:DATABASE_URL = $workingUrl
$env:NODE_ENV = 'production'

Write-Host "Using DATABASE_URL: $workingUrl"

# Persist to user environment
try {
    & setx DATABASE_URL "$workingUrl" | Out-Null
    & setx NODE_ENV 'production' | Out-Null
    Write-Host 'Persisted DATABASE_URL and NODE_ENV to user environment.'
} catch {
    Write-Warning 'Failed to persist env vars with setx.'
}

# Apply schema if present
$schemaPath = Join-Path $PSScriptRoot 'complete-schema.sql'
if (Test-Path $schemaPath) {
    Write-Host "Applying schema: $schemaPath"
    & psql "$workingUrl" -f "$schemaPath"
    if ($LASTEXITCODE -ne 0) { Write-Error 'Schema application failed.' }
    else { Write-Host 'Schema applied successfully.' }
} else {
    Write-Warning "Schema file not found at $schemaPath. Skipping."
}

Write-Host '=== Database setup complete ==='



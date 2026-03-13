$files = Get-ChildItem -Recurse -Include "*.tsx","*.ts" | Where-Object { $_.FullName -notmatch "\.next|node_modules" }
$replacements = @(
  @{ Old = "#070711"; New = "#0e0c0a" },
  @{ Old = "#0a0a18"; New = "#110e0b" },
  @{ Old = "#040410"; New = "#0a0806" },
  @{ Old = "#0d0c1d"; New = "#13110f" },
  @{ Old = "#0a0a1a"; New = "#110e0b" },
  @{ Old = "#0d0d2b"; New = "#110e0b" },
  @{ Old = "#f0ece0"; New = "#f5f0e8" }
)
foreach ($file in $files) {
  $content = Get-Content $file.FullName -Raw
  $changed = $false
  foreach ($r in $replacements) {
    if ($content -match [regex]::Escape($r.Old)) {
      $content = $content -replace [regex]::Escape($r.Old), $r.New
      $changed = $true
    }
  }
  if ($changed) {
    Set-Content $file.FullName $content -NoNewline
    Write-Host "Updated: $($file.Name)"
  }
}
Write-Host "Done"

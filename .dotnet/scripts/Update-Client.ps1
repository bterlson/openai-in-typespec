$repoRoot = Join-Path $PSScriptRoot .. .. -Resolve
$dotnetFolder = Join-Path $repoRoot .dotnet

function Invoke([scriptblock]$script) {
  $scriptString = $script | Out-String
  Write-Host "--------------------------------------------------------------------------------`n> $scriptString"
  & $script
}

Push-Location $repoRoot
try {
  Invoke { npm ci }
  Invoke { npm exec --no -- tsp compile main.tsp --emit @typespec/openapi3 }
  Invoke { npm exec --no -- tsp compile main.tsp --emit @azure-tools/typespec-csharp --option @azure-tools/typespec-csharp.emitter-output-dir="$dotnetFolder" }
  Invoke { .dotnet\scripts\Update-ClientModel.ps1 }
  Invoke { .dotnet\scripts\ConvertTo-Internal.ps1 }
  Invoke { .dotnet\scripts\Add-Customizations.ps1 }
}
finally {
  Pop-Location
}

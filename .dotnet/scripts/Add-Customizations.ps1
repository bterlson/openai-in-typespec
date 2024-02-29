function Update-SystemTextJsonPackage {
    $current = Get-Location
    $root = Split-Path $PSScriptRoot -Parent

    # Update System.Text.Json package to 8.0.2 in OpenAI.csproj
    $directory = Join-Path -Path $root -ChildPath "src"
    Set-Location -Path $directory
    dotnet remove "OpenAI.csproj" package "System.Text.Json"
    dotnet add "OpenAI.csproj" package "System.Text.Json" --version "8.0.2"

    Set-Location -Path $current
}

function Update-MicrosoftBclAsyncInterfacesPackage {
    $current = Get-Location
    $root = Split-Path $PSScriptRoot -Parent

    # Update Microsoft.Bcl.AsyncInterfaces package to 8.0.0 in OpenAI.Tests.csproj
    $directory = Join-Path -Path $root -ChildPath "tests"
    Set-Location -Path $directory
    dotnet remove "OpenAI.Tests.csproj" package "Microsoft.Bcl.AsyncInterfaces"
    dotnet add "OpenAI.Tests.csproj" package "Microsoft.Bcl.AsyncInterfaces" --version "8.0.0"

    Set-Location -Path $current
}

Update-SystemTextJsonPackage
Update-MicrosoftBclAsyncInterfacesPackage
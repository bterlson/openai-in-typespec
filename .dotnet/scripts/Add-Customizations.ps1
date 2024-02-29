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

function Set-LangVersionToLatest {
    $root = Split-Path $PSScriptRoot -Parent
    $filePath = Join-Path -Path $root -ChildPath "tests\OpenAI.Tests.csproj"
    $xml = [xml](Get-Content -Path $filePath)
    $element = $xml.CreateElement("LangVersion")
    $element.InnerText = "latest"
    $xml.Project.PropertyGroup.AppendChild($element) | Out-Null
    $xml.Save($filePath)
}

Update-SystemTextJsonPackage
Update-MicrosoftBclAsyncInterfacesPackage
Set-LangVersionToLatest
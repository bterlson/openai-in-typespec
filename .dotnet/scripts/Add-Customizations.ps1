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

    $xml.Project.PropertyGroup.TargetFramework = "net8.0"

    $element = $xml.CreateElement("LangVersion")
    $element.InnerText = "latest"
    $xml.Project.PropertyGroup.AppendChild($element) | Out-Null
    
    $xml.Save($filePath)
}

function Edit-RunObjectSerialization {
    $root = Split-Path $PSScriptRoot -Parent
    $directory = Join-Path -Path $root -ChildPath "src\Generated\Models"

    $file = Get-ChildItem -Path $directory -Filter "RunObject.Serialization.cs"
    $content = Get-Content -Path $file -Raw

    Write-Output "Editing $($file.FullName)"

    $content = $content -creplace "expiresAt = property\.Value\.GetDateTimeOffset\(`"O`"\);", "// BUG: https://github.com/Azure/autorest.csharp/issues/4296`r`n                    // expiresAt = property.Value.GetDateTimeOffset(`"O`");`r`n                    expiresAt = DateTimeOffset.FromUnixTimeSeconds(property.Value.GetInt64());"
    $content = $content -creplace "startedAt = property\.Value\.GetDateTimeOffset\(`"O`"\);", "// BUG: https://github.com/Azure/autorest.csharp/issues/4296`r`n                    // startedAt = property.Value.GetDateTimeOffset(`"O`");`r`n                    startedAt = DateTimeOffset.FromUnixTimeSeconds(property.Value.GetInt64());"
    $content = $content -creplace "cancelledAt = property\.Value\.GetDateTimeOffset\(`"O`"\);", "// BUG: https://github.com/Azure/autorest.csharp/issues/4296`r`n                    // cancelledAt = property.Value.GetDateTimeOffset(`"O`");`r`n                    cancelledAt = DateTimeOffset.FromUnixTimeSeconds(property.Value.GetInt64());"
    $content = $content -creplace "failedAt = property\.Value\.GetDateTimeOffset\(`"O`"\);", "// BUG: https://github.com/Azure/autorest.csharp/issues/4296`r`n                    // failedAt = property.Value.GetDateTimeOffset(`"O`");`r`n                    failedAt = DateTimeOffset.FromUnixTimeSeconds(property.Value.GetInt64());"
    $content = $content -creplace "completedAt = property\.Value\.GetDateTimeOffset\(`"O`"\);", "// BUG: https://github.com/Azure/autorest.csharp/issues/4296`r`n                    // completedAt = property.Value.GetDateTimeOffset(`"O`");`r`n                    completedAt = DateTimeOffset.FromUnixTimeSeconds(property.Value.GetInt64());"

    $content | Set-Content -Path $file.FullName -NoNewline
}

Update-SystemTextJsonPackage
Update-MicrosoftBclAsyncInterfacesPackage
Set-LangVersionToLatest
Edit-RunObjectSerialization
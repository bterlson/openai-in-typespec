function Edit-GeneratedSources {
    $root = Split-Path $PSScriptRoot -Parent

    $directory = Join-Path -Path $root -ChildPath "src\Generated"
    $files = Get-ChildItem -Path $($directory + "\*") -Include "*.cs" -Recurse

    foreach ($file in $files) {
        $content = Get-Content -Path $file -Raw

        Write-Output "Editing $($file.FullName)"

        $content = $content -creplace "public partial class", "internal partial class"
        $content = $content -creplace "public readonly partial struct", "internal readonly partial struct"
        $content = $content -creplace "public static partial class", "internal static partial class"
        $content = $content -creplace "namespace OpenAI", "namespace OpenAI.Internal"
        $content = $content -creplace "using OpenAI.Models;", "using OpenAI.Internal.Models;"

        $content | Set-Content -Path $file.FullName -NoNewline
    }

    $file = Get-ChildItem -Path $directory -Filter "OpenAIClient.cs"
    $content = Get-Content -Path $file -Raw

    Write-Output "Editing $($file.FullName)"

    $content = $content -creplace "private (OpenAI.)?(?<var>\w+) _cached(\w+);", "private OpenAI.Internal.`${var} _cached`${var};"
    $content = $content -creplace "public virtual (OpenAI.)?(?<var>\w+) Get(\w+)Client", "public virtual OpenAI.Internal.`${var} Get`${var}Client"
    $content = $content -creplace "ref _cached(\w+), new (OpenAI.)?(?<var>\w+)", "ref _cached`${var}, new OpenAI.Internal.`${var}"

    $content | Set-Content -Path $file.FullName -NoNewline
}

function Remove-GeneratedTests {
    $root = Split-Path $PSScriptRoot -Parent

    $directory = Join-Path -Path $root -ChildPath "tests\Generated"
    Remove-Item -LiteralPath $directory -Recurse -Force
}

Edit-GeneratedSources
Remove-GeneratedTests

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
# CONTRIBUTING

## How to run code generation

1. Run the following command to install the necessary tools:
    `npm install`
1. Regenerate the OpenAPI spec by running the following command:
    `npx tsp compile .\openai-in-typespec\main.tsp --emit @typespec/openapi3`
1. Regenerate the library by running the following command:
    `npx tsp compile .\openai-in-typespec\main.tsp --emit @azure-tools/typespec-csharp --option @azure-tools/typespec-csharp.emitter-output-dir=.\openai-in-typespec\.dotnet`
1. Run the following script:
    `.\openai-in-typespec\.dotnet\scripts\Update-ClientModel.ps1`
1. Run the following script:
    `.\openai-in-typespec\.dotnet\scripts\ConvertTo-Internal.ps1`
1. Run the following script:
    `.\openai-in-typespec\.dotnet\scripts\Add-Customizations.ps1`

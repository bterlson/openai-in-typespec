function Update-SystemClientModelPackage {
    $current = Get-Location
    $root = Split-Path $PSScriptRoot -Parent

    # Update System.ClientModel package in OpenAI.csproj
    $directory = Join-Path -Path $root -ChildPath "src"
    Set-Location -Path $directory
    dotnet remove "OpenAI.csproj" package "System.ClientModel"
    dotnet add "OpenAI.csproj" package "System.ClientModel" --version "1.1.0-alpha.20240227.1" --source "https://pkgs.dev.azure.com/azure-sdk/public/_packaging/azure-sdk-for-net/nuget/v3/index.json"

    # Update System.ClientModel package in OpenAI.Tests.csproj
    $directory = Join-Path -Path $root -ChildPath "tests"
    Set-Location -Path $directory
    dotnet remove "OpenAI.Tests.csproj" package "System.ClientModel"
    dotnet add "OpenAI.Tests.csproj" package "System.ClientModel" --version "1.1.0-alpha.20240227.1" --source "https://pkgs.dev.azure.com/azure-sdk/public/_packaging/azure-sdk-for-net/nuget/v3/index.json"

    Set-Location -Path $current
}

function Update-OpenAIClient {
    $root = Split-Path $PSScriptRoot -Parent
    $directory = Join-Path -Path $root -ChildPath "src\Generated"
    $file = Get-ChildItem -Path $directory -Filter "OpenAIClient.cs"
    $content = Get-Content -Path $file -Raw

    Write-Output "Editing $($file.FullName)"

    $content = $content -creplace "\s+#nullable disable", ""
    $content = $content -creplace "\s+using System\.ClientModel\.Internal;", ""
    $content = $content -creplace "\s+using System\.ClientModel\.Primitives\.Pipeline;", ""
    $content = $content -creplace " KeyCredential ", " ApiKeyCredential "
    $content = $content -creplace " _keyCredential", " _credential"
    $content = $content -creplace " MessagePipeline ", " ClientPipeline "
    $content = $content -creplace "\s+\/\/\/ <summary> The ClientDiagnostics is used to provide tracing support for the client library. </summary>", ""
    $content = $content -creplace "\s+internal TelemetrySource ClientDiagnostics { get; }", ""
    $content = $content -creplace "\(KeyCredential", "(ApiKeyCredential"
    $content = $content -creplace "ClientUtilities.AssertNotNull\((?<var>\w+), nameof\((\w+)\)\);", "if (`${var} is null) throw new ArgumentNullException(nameof(`${var}));"
    $content = $content -creplace "\s+ClientDiagnostics = new TelemetrySource\(options, true\);", ""
    $content = $content -creplace "_pipeline = MessagePipeline\.Create\(options, new IPipelinePolicy<PipelineMessage>\[\] \{ new KeyCredentialPolicy\(_keyCredential, AuthorizationHeader, AuthorizationApiKeyPrefix\) \}, Array\.Empty<IPipelinePolicy<PipelineMessage>>\(\)\);", "var authenticationPolicy = ApiKeyAuthenticationPolicy.CreateBearerAuthorizationPolicy(_credential);`r`n            _pipeline = ClientPipeline.Create(options,`r`n                perCallPolicies: ReadOnlySpan<PipelinePolicy>.Empty,`r`n                perTryPolicies: new PipelinePolicy[] { authenticationPolicy },`r`n                beforeTransportPolicies: ReadOnlySpan<PipelinePolicy>.Empty);"
    $content = $content -creplace "\(ClientDiagnostics, ", "("

    $content | Set-Content -Path $file.FullName -NoNewline
}

function Update-OpenAIClientOptions {
    $root = Split-Path $PSScriptRoot -Parent
    $directory = Join-Path -Path $root -ChildPath "src\Generated"
    $file = Get-ChildItem -Path $directory -Filter "OpenAIClientOptions.cs"
    $content = Get-Content -Path $file -Raw

    Write-Output "Editing $($file.FullName)"

    $content = $content -creplace "\s+#nullable disable", ""
    $content = $content -creplace "using System\.ClientModel;", "using System.ClientModel.Primitives;"
    $content = $content -creplace ": RequestOptions", ": ClientPipelineOptions"

    $content | Set-Content -Path $file.FullName -NoNewline
}

function Update-Subclients {
    $root = Split-Path $PSScriptRoot -Parent
    $directory = Join-Path -Path $root -ChildPath "src\Generated"
    $files = Get-ChildItem -Path $($directory + "\*") -Include "*.cs" -Exclude "OpenAIClient.cs", "OpenAIClientOptions.cs"

    foreach ($file in $files) {
        $content = Get-Content -Path $file -Raw

        Write-Output "Editing $($file.FullName)"

        # Delete #nullable
        $content = $content -creplace "\s+#nullable disable", ""

        # Fix using statements
        $content = $content -creplace "\s+using System.ClientModel.Internal;", ""
        $content = $content -creplace "\s+using System.ClientModel.Primitives.Pipeline;", ""
        $content = $content -creplace "using System.ClientModel.Primitives;", "using System.ClientModel.Primitives;`r`nusing System.Text;"

        # Fix ClientUtilities
        $content = $content -creplace "ClientUtilities.AssertNotNull\((?<var>\w+), nameof\((\w+)\)\);", "if (`${var} is null) throw new ArgumentNullException(nameof(`${var}));"
        $content = $content -creplace "ClientUtilities.AssertNotNullOrEmpty\((?<var>\w+), nameof\((\w+)\)\);", "if (`${var} is null) throw new ArgumentNullException(nameof(`${var}));`r`n            if (string.IsNullOrEmpty(`${var})) throw new ArgumentException(nameof(`${var}));"

        # Delete TelemetrySource
        $content = $content -creplace "\s+\/\/\/ <summary> The ClientDiagnostics is used to provide tracing support for the client library. </summary>", ""
        $content = $content -creplace "\s+internal TelemetrySource ClientDiagnostics { get; }", ""

        # Delete FromCancellationToken
        $content = $content -creplace "(?s)\s+internal static RequestOptions FromCancellationToken\(CancellationToken cancellationToken = default\).*?return new RequestOptions\(\) \{ CancellationToken = cancellationToken \};.*?\}", ""

        # Modify constructor
        $content = $content -creplace "\s+\/\/\/ <param name=`"clientDiagnostics`"> The handler for diagnostic messaging in the client. </param>", ""
        $content = $content -creplace "<param name=`"keyCredential`">", "<param name=`"credential`">"
        $content = $content -creplace "internal (?<name>\w+)\(TelemetrySource clientDiagnostics, MessagePipeline pipeline, KeyCredential keyCredential, Uri endpoint\)", "internal `${name}(ClientPipeline pipeline, ApiKeyCredential credential, Uri endpoint)"
        $content = $content -creplace "\s+ClientDiagnostics = clientDiagnostics;", ""

        # # Modify convenience methods
        $content = $content -creplace "\s+\/\/\/ <param name=`"cancellationToken`"> The cancellation token to use. </param>", ""
        $content = $content -creplace "\(CancellationToken cancellationToken = default\)", "()"
        $content = $content -creplace ", CancellationToken cancellationToken = default\)", ")"
        $content = $content -creplace "RequestOptions context = FromCancellationToken\(cancellationToken\);\s+", ""
        $content = $content -creplace "using RequestBody content = (?<var>\w+)\.ToRequestBody\(\);", "using BinaryContent content = BinaryContent.Create(`${var});"
        $content = $content -creplace "using RequestBody content0 = (?<var>\w+)\.ToRequestBody\(\);", "using BinaryContent content0 = BinaryContent.Create(`${var});"
        $content = $content -creplace "Result result = await (?<method>\w+)\(context\)\.ConfigureAwait\(false\);", "ClientResult result = await `${method}(DefaultRequestContext).ConfigureAwait(false);"
        $content = $content -creplace "Result result = (?<method>\w+)\(context\);", "ClientResult result = `${method}(DefaultRequestContext);"
        $content = $content -creplace "Result result = await (?<method>\w+)\((?<params>[(\w+)(\?.ToString\(\)*)(,\s\w+)]*), context\)\.ConfigureAwait\(false\);", "ClientResult result = await `${method}(`${params}, DefaultRequestContext).ConfigureAwait(false);"
        $content = $content -creplace "Result result = (?<method>\w+)\((?<params>[(\w+)(\?.ToString\(\)*)(,\s\w+)]*), context\);", "ClientResult result = `${method}(`${params}, DefaultRequestContext);"

        # Modify protocol methods
        $content = $content -creplace "\/\/\/ Please try the simpler <see cref=`"(?<method>\w+)\(CancellationToken\)`"/> convenience overload with strongly typed models first.", "/// Please try the simpler <see cref=`"`${method}()`"/> convenience overload with strongly typed models first."
        $content = $content -creplace "\/\/\/ Please try the simpler <see cref=`"(?<method>\w+)\((?<params>[(\w+)(\?*)(,\s\w+)]*),CancellationToken\)`"/> convenience overload with strongly typed models first.", "/// Please try the simpler <see cref=`"`${method}(`${params})`"/> convenience overload with strongly typed models first."
        $content = $content -creplace "\/\/\/ <param name=`"context`"> The request context, which can override default behaviors of the client pipeline on a per-call basis. </param>", "/// <param name=`"options`"> The request options, which can override default behaviors of the client pipeline on a per-call basis. </param>"
        $content = $content -creplace "\/\/\/ <exception cref=`"MessageFailedException`">", "/// <exception cref=`"ClientResultException`">"
        $content = $content -creplace " Task<Result> ", " Task<ClientResult> "
        $content = $content -creplace " Result ", " ClientResult "
        $content = $content -creplace "\(RequestBody content", "(BinaryContent content"
        $content = $content -creplace " RequestBody content", " BinaryContent content"
        $content = $content -creplace "\(RequestOptions context", "(RequestOptions options"
        $content = $content -creplace " RequestOptions context", " RequestOptions options"
        $content = $content -creplace "\s+using var scope = ClientDiagnostics\.CreateSpan\(`"(\w+\.\w+)`"\);", ""
        $content = $content -creplace "\s+scope\.Start\(\);", ""
        $content = $content -creplace "(?s)\s+try\s+\{\s+using PipelineMessage message = (?<method>\w+)\((?<params>[(\w+)(,\s\w+)]*)context\);\s+return Result\.FromResponse\(await _pipeline\.ProcessMessageAsync\(message, context\)\.ConfigureAwait\(false\)\);\s+\}", "`r`n            options ??= new RequestOptions();`r`n            using PipelineMessage message = `${method}(`${params}options);`r`n            await _pipeline.SendAsync(message).ConfigureAwait(false);`r`n            PipelineResponse response = message.Response!;`r`n`r`n            if (response.IsError && options.ErrorOptions == ClientErrorBehaviors.Default)`r`n            {`r`n                throw await ClientResultException.CreateAsync(response).ConfigureAwait(false);`r`n            }`r`n`r`n            return ClientResult.FromResponse(response);"
        $content = $content -creplace "(?s)\s+try\s+\{\s+using PipelineMessage message = (?<method>\w+)\((?<params>[(\w+)(,\s\w+)]*)context\);\s+return Result\.FromResponse\(_pipeline.ProcessMessage\(message, context\)\);\s+\}", "`r`n            options ??= new RequestOptions();`r`n            using PipelineMessage message = `${method}(`${params}options);`r`n            _pipeline.Send(message);`r`n            PipelineResponse response = message.Response!;`r`n`r`n            if (response.IsError && options.ErrorOptions == ClientErrorBehaviors.Default)`r`n            {`r`n                throw new ClientResultException(response);`r`n            }`r`n`r`n            return ClientResult.FromResponse(response);"
        $content = $content -creplace "(?s)\s+catch \(Exception e\)\s+\{\s+scope\.Failed\(e\);\s+throw;\s+\}", ""

        # Create request
        $content = $content -creplace "\(RequestBody content", "(BinaryContent content"
        $content = $content -creplace " RequestBody content", " BinaryContent content"
        $content = $content -creplace " RequestOptions context", " RequestOptions options"
        $content = $content -creplace "var message = _pipeline\.CreateMessage\(context, ResponseErrorClassifier200\);", "PipelineMessage message = _pipeline.CreateMessage();`r`n            message.ResponseClassifier = ResponseErrorClassifier200;"
        $content = $content -creplace "var request = message\.Request;", "PipelineRequest request = message.Request;"
        $content = $content -creplace "request\.SetMethod\(`"(?<name>[\w\/]+)`"\);", "request.Method = `"`${name}`";"
        $content = $content -creplace "var uri = new RequestUri\(\);", "UriBuilder uriBuilder = new(_endpoint.ToString());"
        $content = $content -creplace "uri\.Reset\(_endpoint\);", "StringBuilder path = new();"
        $content = $content -creplace "uri\.AppendPath\((?<path>`"?[\w\/]+`"?), (\w+)\);", "path.Append(`${path});"
        $content = $content -creplace "uri\.AppendQuery\(`"(?<key>\w+)`", (?<value>\w+(\.Value)?), (\w+)\);", "if (uriBuilder.Query != null && uriBuilder.Query.Length > 1)`r`n                {`r`n                    uriBuilder.Query += $`"&`${key}={`${value}}`";`r`n                }`r`n                else`r`n                {`r`n                    uriBuilder.Query = $`"`${key}={`${value}}`";`r`n                }"
        $content = $content -creplace "request\.Uri = uri\.ToUri\(\);", "uriBuilder.Path += path.ToString();`r`n            request.Uri = uriBuilder.Uri;"
        $content = $content -creplace "request\.SetHeaderValue", "request.Headers.Set"
        $content = $content -creplace "request\.Content = content;", "request.Content = content;`r`n            message.Apply(options);"

        # Delete DefaultRequestContext
        # $content = $content -creplace "\s+private static RequestOptions DefaultRequestContext = new RequestOptions\(\);", ""

        # Clean up ApiKeyCredential
        $content = $content -creplace " KeyCredential", " ApiKeyCredential"
        $content = $content -creplace "_keyCredential", "_credential"
        $content = $content -creplace " keyCredential", " credential"

        # Clean up ClientPipeline
        $content = $content -creplace " MessagePipeline ", " ClientPipeline "

        # Clean up ClientResult
        $content = $content -creplace " Result", " ClientResult"
        $content = $content -creplace "Task<Result", "Task<ClientResult"

        # Clean up PipelineMessageClassifiers
        $content = $content -creplace "private static ResponseErrorClassifier _responseErrorClassifier200;", "private static PipelineMessageClassifier _responseErrorClassifier200;"
        $content = $content -creplace "private static ResponseErrorClassifier ResponseErrorClassifier200 => _responseErrorClassifier200 \?\?= new StatusResponseClassifier\(stackalloc ushort\[\] \{ 200 \}\);", "private static PipelineMessageClassifier ResponseErrorClassifier200 => _responseErrorClassifier200 ??= PipelineMessageClassifier.Create(stackalloc ushort[] { 200 });"

        $content | Set-Content -Path $file.FullName -NoNewline
    }
}

function Update-Models {
    $root = Split-Path $PSScriptRoot -Parent
    $directory = Join-Path -Path $root -ChildPath "src\Generated\Models"
    $files = Get-ChildItem -Path $directory -Filter "*.cs"

    foreach ($file in $files) {
        $content = Get-Content -Path $file -Raw

        Write-Output "Editing $($file.FullName)"

        $content = $content -creplace "\s+#nullable disable", ""
        $content = $content -creplace "ClientUtilities.AssertNotNull\((?<var>@?\w+), nameof\((@?\w+)\)\);", "if (`${var} is null) throw new ArgumentNullException(nameof(`${var}));"
        $content = $content -creplace "using System.ClientModel.Internal;", "using OpenAI.ClientShared.Internal;"
        $content = $content -creplace ": IUtf8JsonWriteable,", ":"
        $content = $content -creplace "\s+void IUtf8JsonWriteable\.Write\(Utf8JsonWriter writer\) => \(\(IJsonModel<(\w+)>\)this\)\.Write\(writer, new ModelReaderWriterOptions\(`"W`"\)\);`r`n", ""
        $content = $content -creplace "(?s)\s+\/\/\/ <summary> Convert into a Utf8JsonRequestBody\. </summary>.*?return content;.*?\}", ""

        $content | Set-Content -Path $file.FullName -NoNewline
    }
}

function Update-Tests {
    $root = Split-Path $PSScriptRoot -Parent
    $directory = Join-Path -Path $root -ChildPath "tests\Generated\Tests"
    $files = Get-ChildItem -Path $directory -Filter "*.cs"

    foreach ($file in $files) {
        $content = Get-Content -Path $file -Raw

        Write-Output "Editing $($file.FullName)"

        $content = $content -creplace " KeyCredential", " ApiKeyCredential"

        $content | Set-Content -Path $file.FullName -NoNewline
    }
}

Update-SystemClientModelPackage
Update-OpenAIClient
Update-OpenAIClientOptions
Update-Subclients
Update-Models
Update-Tests
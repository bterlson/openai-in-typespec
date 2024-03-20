using System;
using System.ClientModel;

namespace OpenAI.LegacyCompletions;

/// <summary>
///     The basic, protocol-level service client for OpenAI legacy completion operations.
///     <para>
///         <b>Note</b>: pre-chat completions are a legacy feature. New solutions should consider the use of chat
///         completions or assistants, instead.
///     </para>
/// </summary>
public partial class LegacyCompletionClient
{
    private readonly OpenAIClientConnector _clientConnector;
    private Internal.Completions Shim => _clientConnector.InternalClient.GetCompletionsClient();

    /// <summary>
    /// Initializes a new instance of <see cref="LegacyCompletionClient"/>, used for legacy completion requests. 
    /// </summary>
    /// <remarks>
    /// <para>
    ///     If an endpoint is not provided, the client will use the <c>OPENAI_ENDPOINT</c> environment variable if it
    ///     defined and otherwise use the default OpenAI v1 endpoint.
    /// </para>
    /// <para>
    ///    If an authentication credential is not defined, the client use the <c>OPENAI_API_KEY</c> environment variable
    ///    if it is defined.
    /// </para>
    /// </remarks>
    /// <param name="credential">The API key used to authenticate with the service endpoint.</param>
    /// <param name="options">Additional options to customize the client.</param>
    public LegacyCompletionClient(ApiKeyCredential credential = default, OpenAIClientOptions options = default)
    {
        _clientConnector = new(model: null, credential, options);
    }
}

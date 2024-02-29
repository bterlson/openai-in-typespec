using System;
using System.ClientModel;
using System.ClientModel;
using System.ClientModel.Primitives;
using System.ComponentModel;
using System.Threading.Tasks;

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
    private OpenAIClientConnector _clientConnector;
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
    /// <param name="endpoint">The connection endpoint to use.</param>
    /// <param name="credential">The API key used to authenticate with the service endpoint.</param>
    /// <param name="options">Additional options to customize the client.</param>
    public LegacyCompletionClient(Uri endpoint, ApiKeyCredential credential, OpenAIClientOptions options = null)
    {
        _clientConnector = new("protocol", endpoint, credential, options);
    }

    /// <summary>
    /// Initializes a new instance of <see cref="LegacyCompletionClient"/>, used for legacy completion operation requests. 
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
    /// <param name="endpoint">The connection endpoint to use.</param>
    /// <param name="options">Additional options to customize the client.</param>
    public LegacyCompletionClient(Uri endpoint, OpenAIClientOptions options = null)
        : this(endpoint, credential: null, options)
    { }

    /// <summary>
    /// Initializes a new instance of <see cref="LegacyCompletionClient"/>, used for legacy completion operation requests. 
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
    public LegacyCompletionClient(ApiKeyCredential credential, OpenAIClientOptions options = null)
        : this(endpoint: null, credential, options)
    { }

    /// <summary>
    /// Initializes a new instance of <see cref="LegacyCompletionClient"/>, used for legacy completion operation requests. 
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
    /// <param name="options">Additional options to customize the client.</param>
    public LegacyCompletionClient(OpenAIClientOptions options = null)
        : this(endpoint: null, credential: null, options)
    { }

    /// <inheritdoc cref="Internal.Completions.CreateCompletion(BinaryContent, RequestOptions)"/>
    public virtual ClientResult GenerateLegacyCompletions(BinaryContent content, RequestOptions context = null)
        => Shim.CreateCompletion(content, context);

    /// <inheritdoc cref="Internal.Completions.CreateCompletionAsync(BinaryContent, RequestOptions)"/>
    public virtual Task<ClientResult> GenerateLegacyCompletionsAsync(BinaryContent content, RequestOptions context = null)
        => Shim.CreateCompletionAsync(content, context);
}

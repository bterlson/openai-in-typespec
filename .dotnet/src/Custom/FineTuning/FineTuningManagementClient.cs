using System;
using System.ClientModel;

namespace OpenAI.FineTuningManagement;

/// <summary>
///     The service client for OpenAI fine-tuning operations.
/// </summary>
public partial class FineTuningManagementClient
{
    private readonly OpenAIClientConnector _clientConnector;
    private Internal.FineTuning FineTuningShim => _clientConnector.InternalClient.GetFineTuningClient();

    /// <summary>
    /// Initializes a new instance of <see cref="FineTuningClient"/>, used for fine-tuning operation requests. 
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
    public FineTuningManagementClient(Uri endpoint, ApiKeyCredential credential, OpenAIClientOptions options = null)
    {
        _clientConnector = new("none", endpoint, credential, options);
    }

    /// <summary>
    /// Initializes a new instance of <see cref="FineTuningClient"/>, used for fine-tuning operation requests. 
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
    public FineTuningManagementClient(Uri endpoint, OpenAIClientOptions options = null)
        : this(endpoint, credential: null, options)
    { }

    /// <summary>
    /// Initializes a new instance of <see cref="FineTuningClient"/>, used for fine-tuning operation requests. 
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
    public FineTuningManagementClient(ApiKeyCredential credential, OpenAIClientOptions options = null)
        : this(endpoint: null, credential, options)
    { }

    /// <summary>
    /// Initializes a new instance of <see cref="FineTuningClient"/>, used for fine-tuning operation requests. 
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
    public FineTuningManagementClient(OpenAIClientOptions options = null)
        : this(endpoint: null, credential: null, options)
    { }
}

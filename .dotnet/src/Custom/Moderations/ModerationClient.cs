using System.ClientModel;

namespace OpenAI.Moderations;

/// <summary>
///     The service client for OpenAI moderation operations.
/// </summary>
public partial class ModerationClient
{
    private readonly OpenAIClientConnector _clientConnector;
    private Internal.Moderations Shim => _clientConnector.InternalClient.GetModerationsClient();

    /// <summary>
    /// Initializes a new instance of <see cref="ModerationClient"/>, used for moderation operation requests. 
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
    public ModerationClient(ApiKeyCredential credential = default, OpenAIClientOptions options = default)
    {
        _clientConnector = new(model: null, credential, options);
    }
}

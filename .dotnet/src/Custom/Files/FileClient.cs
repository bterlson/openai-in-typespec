using OpenAI.Internal;
using System;
using System.ClientModel;
using System.ClientModel.Primitives;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace OpenAI.Files;

/// <summary>
///     The service client for OpenAI file operations.
/// </summary>
public partial class FileClient
{
    private readonly OpenAIClientConnector _clientConnector;
    private Internal.Files Shim => _clientConnector.InternalClient.GetFilesClient();

    /// <summary>
    /// Initializes a new instance of <see cref="FileClient"/>, used for file operation requests. 
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
    public FileClient(Uri endpoint, ApiKeyCredential credential, OpenAIClientOptions options = null)
    {
        _clientConnector = new("none", endpoint, credential, options);
    }

    /// <summary>
    /// Initializes a new instance of <see cref="FileClient"/>, used for file operation requests. 
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
    public FileClient(Uri endpoint, OpenAIClientOptions options = null)
        : this(endpoint, credential: null, options)
    { }

    /// <summary>
    /// Initializes a new instance of <see cref="FileClient"/>, used for file operation requests. 
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
    public FileClient(ApiKeyCredential credential, OpenAIClientOptions options = null)
        : this(endpoint: null, credential, options)
    { }

    /// <summary>
    /// Initializes a new instance of <see cref="FileClient"/>, used for file operation requests. 
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
    public FileClient(OpenAIClientOptions options = null)
        : this(endpoint: null, credential: null, options)
    { }

    // convenience method - sync; Stream overload
    // TODO: add refdoc comment
    public virtual ClientResult<OpenAIFileInfo> UploadFile(Stream fileStream, string fileName, OpenAIFilePurpose purpose)
    {
        Argument.AssertNotNull(fileStream, nameof(fileStream));
        Argument.AssertNotNull(fileName, nameof(fileName));

        using MultipartFormDataBinaryContent content = UploadFileOptions.ToMultipartContent(fileStream, fileName, purpose);

        ClientResult result = UploadFile(content, content.ContentType);

        PipelineResponse response = result.GetRawResponse();

        Internal.Models.OpenAIFile internalFile = Internal.Models.OpenAIFile.FromResponse(response);
        OpenAIFileInfo fileInfo = new(internalFile);

        return ClientResult.FromValue(fileInfo, response);
    }

    // convenience method - sync
    // TODO: add refdoc comment
    public virtual ClientResult<OpenAIFileInfo> UploadFile(BinaryData file, string fileName, OpenAIFilePurpose purpose)
    {
        Argument.AssertNotNull(file, nameof(file));
        Argument.AssertNotNull(fileName, nameof(fileName));

        using MultipartFormDataBinaryContent content = UploadFileOptions.ToMultipartContent(file, fileName, purpose);

        ClientResult result = UploadFile(content, content.ContentType);

        PipelineResponse response = result.GetRawResponse();

        Internal.Models.OpenAIFile internalFile = Internal.Models.OpenAIFile.FromResponse(response);
        OpenAIFileInfo fileInfo = new(internalFile);

        return ClientResult.FromValue(fileInfo, response);
    }

    // convenience method - async; Stream overload
    // TODO: add refdoc comment
    public virtual async Task<ClientResult<OpenAIFileInfo>> UploadFileAsync(Stream file, string fileName, OpenAIFilePurpose purpose)
    {
        Argument.AssertNotNull(file, nameof(file));
        Argument.AssertNotNull(fileName, nameof(fileName));

        using MultipartFormDataBinaryContent content = UploadFileOptions.ToMultipartContent(file, fileName, purpose);

        ClientResult result = await UploadFileAsync(content, content.ContentType).ConfigureAwait(false);

        PipelineResponse response = result.GetRawResponse();

        Internal.Models.OpenAIFile internalFile = Internal.Models.OpenAIFile.FromResponse(response);
        OpenAIFileInfo fileInfo = new(internalFile);

        return ClientResult.FromValue(fileInfo, response);
    }

    // convenience method - async
    // TODO: add refdoc comment
    public virtual async Task<ClientResult<OpenAIFileInfo>> UploadFileAsync(BinaryData file, string fileName, OpenAIFilePurpose purpose)
    {
        Argument.AssertNotNull(file, nameof(file));
        Argument.AssertNotNull(fileName, nameof(fileName));

        using MultipartFormDataBinaryContent content = UploadFileOptions.ToMultipartContent(file, fileName, purpose);

        ClientResult result = await UploadFileAsync(content, content.ContentType).ConfigureAwait(false);

        PipelineResponse response = result.GetRawResponse();

        Internal.Models.OpenAIFile internalFile = Internal.Models.OpenAIFile.FromResponse(response);
        OpenAIFileInfo fileInfo = new(internalFile);

        return ClientResult.FromValue(fileInfo, response);
    }

    // protocol method - sync
    // TODO: add refdoc comment
    public virtual ClientResult UploadFile(BinaryContent content, string contentType, RequestOptions options = null)
    {
        Argument.AssertNotNull(content, nameof(content));
        Argument.AssertNotNull(contentType, nameof(contentType));

        options ??= new RequestOptions();

        using PipelineMessage message = CreateUploadFileRequest(content, contentType, options);

        Shim.Pipeline.Send(message);

        PipelineResponse response = message.Response!;

        if (response.IsError && options.ErrorOptions == ClientErrorBehaviors.Default)
        {
            throw new ClientResultException(response);
        }

        return ClientResult.FromResponse(response);
    }

    // protocol method - async
    // TODO: add refdoc comment
    public virtual async Task<ClientResult> UploadFileAsync(BinaryContent content, string contentType, RequestOptions options = null)
    {
        Argument.AssertNotNull(content, nameof(content));
        Argument.AssertNotNull(contentType, nameof(contentType));

        options ??= new RequestOptions();

        using PipelineMessage message = CreateUploadFileRequest(content, contentType, options);

        Shim.Pipeline.Send(message);

        PipelineResponse response = message.Response!;

        if (response.IsError && options.ErrorOptions == ClientErrorBehaviors.Default)
        {
            throw await ClientResultException.CreateAsync(response).ConfigureAwait(false);
        }

        return ClientResult.FromResponse(response);
    }

    public virtual ClientResult<OpenAIFileInfo> GetFileInfo(string fileId)
    {
        ClientResult<Internal.Models.OpenAIFile> internalResult = Shim.RetrieveFile(fileId);
        return ClientResult.FromValue(new OpenAIFileInfo(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual async Task<ClientResult<OpenAIFileInfo>> GetFileInfoAsync(string fileId)
    {
        ClientResult<Internal.Models.OpenAIFile> internalResult = await Shim.RetrieveFileAsync(fileId);
        return ClientResult.FromValue(new OpenAIFileInfo(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual ClientResult<OpenAIFileInfoCollection> GetFileInfoList(OpenAIFilePurpose? purpose = null)
    {
        Internal.Models.OpenAIFilePurpose? internalPurpose = ToInternalFilePurpose(purpose);
        string internalPurposeText = null;
        if (internalPurpose != null)
        {
            internalPurposeText = internalPurpose.ToString();
        }
        ClientResult<Internal.Models.ListFilesResponse> result = Shim.GetFiles(internalPurposeText);
        List<OpenAIFileInfo> infoItems = [];
        foreach (Internal.Models.OpenAIFile internalFile in result.Value.Data)
        {
            infoItems.Add(new(internalFile));
        }
        return ClientResult.FromValue(new OpenAIFileInfoCollection(infoItems), result.GetRawResponse());
    }

    public virtual async Task<ClientResult<OpenAIFileInfoCollection>> GetFileInfoListAsync(OpenAIFilePurpose? purpose = null)
    {
        Internal.Models.OpenAIFilePurpose? internalPurpose = ToInternalFilePurpose(purpose);
        string internalPurposeText = null;
        if (internalPurpose != null)
        {
            internalPurposeText = internalPurpose.ToString();
        }
        ClientResult<Internal.Models.ListFilesResponse> result = await Shim.GetFilesAsync(internalPurposeText).ConfigureAwait(false);
        List<OpenAIFileInfo> infoItems = [];
        foreach (Internal.Models.OpenAIFile internalFile in result.Value.Data)
        {
            infoItems.Add(new(internalFile));
        }
        return ClientResult.FromValue(new OpenAIFileInfoCollection(infoItems), result.GetRawResponse());
    }

    public virtual ClientResult<BinaryData> DownloadFile(string fileId)
    {
        PipelineMessage message = Shim.Pipeline.CreateMessage();
        message.ResponseClassifier = ResponseErrorClassifier200;
        PipelineRequest request = message.Request;
        request.Method = "GET";
        UriBuilder uriBuilder = new(_clientConnector.Endpoint.AbsoluteUri);
        StringBuilder path = new();
        path.Append($"/files/{fileId}/content");
        uriBuilder.Path += path.ToString();
        request.Uri = uriBuilder.Uri;
        request.Headers.Set("content-type", "multipart/form-data");
        Shim.Pipeline.Send(message);

        if (message.Response.IsError)
        {
            throw new ClientResultException(message.Response);
        }

        return ClientResult.FromValue(message.Response.Content, message.Response);
    }

    public virtual async Task<ClientResult<BinaryData>> DownloadFileAsync(string fileId)
    {
        PipelineMessage message = Shim.Pipeline.CreateMessage();
        message.ResponseClassifier = ResponseErrorClassifier200;
        PipelineRequest request = message.Request;
        request.Method = "GET";
        UriBuilder uriBuilder = new(_clientConnector.Endpoint.AbsoluteUri);
        StringBuilder path = new();
        path.Append($"/files/{fileId}/content");
        uriBuilder.Path += path.ToString();
        request.Uri = uriBuilder.Uri;
        request.Headers.Set("content-type", "multipart/form-data");

        await Shim.Pipeline.SendAsync(message).ConfigureAwait(false);

        if (message.Response.IsError)
        {
            throw new ClientResultException(message.Response);
        }

        return ClientResult.FromValue(message.Response.Content, message.Response);
    }

    public virtual void DeleteFile(string fileId)
    {
        _ = Shim.DeleteFile(fileId);
    }

    public virtual async Task DeleteFileAsync(string fileId)
    {
        _ = Shim.DeleteFileAsync(fileId);
    }

    private PipelineMessage CreateUploadFileRequest(BinaryContent content, string contentType, RequestOptions options)
    {
        PipelineMessage message = Shim.Pipeline.CreateMessage();
        message.ResponseClassifier = ResponseErrorClassifier200;

        PipelineRequest request = message.Request;
        request.Method = "POST";

        UriBuilder uriBuilder = new(_clientConnector.Endpoint.AbsoluteUri);

        StringBuilder path = new();
        path.Append("/files");
        uriBuilder.Path += path.ToString();

        request.Uri = uriBuilder.Uri;

        request.Headers.Set("Accept", "application/json");
        request.Headers.Set("Content-Type", contentType);

        request.Content = content;

        message.Apply(options);

        return message;
    }

    private static Internal.Models.OpenAIFilePurpose? ToInternalFilePurpose(OpenAIFilePurpose? purpose)
    {
        if (purpose == null)
        {
            return null;
        }
        return purpose switch
        {
            OpenAIFilePurpose.FineTuning => Internal.Models.OpenAIFilePurpose.FineTune,
            OpenAIFilePurpose.FineTuningResults => Internal.Models.OpenAIFilePurpose.FineTuneResults,
            OpenAIFilePurpose.Assistants => Internal.Models.OpenAIFilePurpose.Assistants,
            OpenAIFilePurpose.AssistantOutputs => Internal.Models.OpenAIFilePurpose.AssistantsOutput,
            _ => throw new ArgumentException($"Unsupported file purpose: {purpose}"),
        };
    }

    private static PipelineMessageClassifier _responseErrorClassifier200;
    private static PipelineMessageClassifier ResponseErrorClassifier200 => _responseErrorClassifier200 ??= PipelineMessageClassifier.Create(stackalloc ushort[] { 200 });
}

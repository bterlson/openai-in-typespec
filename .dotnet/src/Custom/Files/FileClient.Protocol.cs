using System;
using System.ClientModel;
using System.ClientModel.Primitives;
using System.ComponentModel;
using System.IO;
using System.Threading.Tasks;

namespace OpenAI.Files;

public partial class FileClient
{
    /// <summary>
    /// [Protocol Method] Upload a file that can be used across various endpoints. The size of all the files uploaded by
    /// one organization can be up to 100 GB.
    ///
    /// The size of individual files can be a maximum of 512 MB or 2 million tokens for Assistants. See
    /// the [Assistants Tools guide](/docs/assistants/tools) to learn more about the types of files
    /// supported. The Fine-tuning API only supports `.jsonl` files.
    ///
    /// Please [contact us](https://help.openai.com/) if you need to increase these storage limits.
    /// <list type="bullet">
    /// <item>
    /// <description>
    /// This <see href="https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Azure.Core/samples/ProtocolMethods.md">protocol method</see> allows explicit creation of the request and processing of the response for advanced scenarios.
    /// </description>
    /// </item>
    /// <item>
    /// <description>
    /// Please try the simpler <see cref="UploadFile(BinaryData, string, OpenAIFilePurpose)"/> or <see cref="UploadFile(Stream, string, OpenAIFilePurpose)"/> convenience overload with strongly typed models first.
    /// </description>
    /// </item>
    /// </list>
    /// </summary>
    /// <param name="content"> The content to send as the body of the request. </param>
    /// <param name="contentType"> The content type of the request. </param>
    /// <param name="options"> The request options, which can override default behaviors of the client pipeline on a per-call basis. </param>
    /// <exception cref="ArgumentNullException"> <paramref name="content"/> is null. </exception>
    /// <exception cref="ArgumentException"> <paramref name="contentType"/> is an empty string, and was expected to be non-empty. </exception>
    /// <exception cref="ClientResultException"> Service returned a non-success status code. </exception>
    /// <returns> The response returned from the service. </returns>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult UploadFile(BinaryContent content, string contentType, RequestOptions options = null)
    {
        Argument.AssertNotNull(content, nameof(content));
        Argument.AssertNotNullOrEmpty(contentType, nameof(contentType));

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

    /// <summary>
    /// [Protocol Method] Upload a file that can be used across various endpoints. The size of all the files uploaded by
    /// one organization can be up to 100 GB.
    ///
    /// The size of individual files can be a maximum of 512 MB or 2 million tokens for Assistants. See
    /// the [Assistants Tools guide](/docs/assistants/tools) to learn more about the types of files
    /// supported. The Fine-tuning API only supports `.jsonl` files.
    ///
    /// Please [contact us](https://help.openai.com/) if you need to increase these storage limits.
    /// <list type="bullet">
    /// <item>
    /// <description>
    /// This <see href="https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Azure.Core/samples/ProtocolMethods.md">protocol method</see> allows explicit creation of the request and processing of the response for advanced scenarios.
    /// </description>
    /// </item>
    /// <item>
    /// <description>
    /// Please try the simpler <see cref="UploadFileAsync(BinaryData, string, OpenAIFilePurpose)"/> or <see cref="UploadFileAsync(Stream, string, OpenAIFilePurpose)"/> convenience overload with strongly typed models first.
    /// </description>
    /// </item>
    /// </list>
    /// </summary>
    /// <param name="content"> The content to send as the body of the request. </param>
    /// <param name="contentType"> The content type of the request. </param>
    /// <param name="options"> The request options, which can override default behaviors of the client pipeline on a per-call basis. </param>
    /// <exception cref="ArgumentNullException"> <paramref name="content"/> is null. </exception>
    /// <exception cref="ArgumentException"> <paramref name="contentType"/> is an empty string, and was expected to be non-empty. </exception>
    /// <exception cref="ClientResultException"> Service returned a non-success status code. </exception>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> UploadFileAsync(BinaryContent content, string contentType, RequestOptions options = null)
    {
        Argument.AssertNotNull(content, nameof(content));
        Argument.AssertNotNullOrEmpty(contentType, nameof(contentType));

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

    /// <inheritdoc cref="Internal.Files.RetrieveFile(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetFileInfo(string fileId, RequestOptions options)
        => Shim.RetrieveFile(fileId, options);

    /// <inheritdoc cref="Internal.Files.RetrieveFileAsync(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> GetFileInfoAsync(string fileId, RequestOptions options)
        => await Shim.RetrieveFileAsync(fileId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Files.GetFiles(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetFileInfoList(string purpose, RequestOptions options)
        => Shim.GetFiles(purpose, options);

    /// <inheritdoc cref="Internal.Files.GetFilesAsync(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> GetFileInfoListAsync(string purpose, RequestOptions options)
        => await Shim.GetFilesAsync(purpose, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Files.DownloadFile(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult DownloadFile(string fileId, RequestOptions options)
        => Shim.DownloadFile(fileId, options);

    /// <inheritdoc cref="Internal.Files.DownloadFileAsync(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> DownloadFileAsync(string fileId, RequestOptions options)
        => await Shim.DownloadFileAsync(fileId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Files.DeleteFile(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult DeleteFile(string fileId, RequestOptions options)
        => Shim.DeleteFile(fileId, options);

    /// <inheritdoc cref="Internal.Files.DeleteFileAsync(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> DeleteFileAsync(string fileId, RequestOptions options)
        => await Shim.DeleteFileAsync(fileId, options).ConfigureAwait(false);
}

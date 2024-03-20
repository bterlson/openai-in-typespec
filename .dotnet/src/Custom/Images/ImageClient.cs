using OpenAI.Internal;
using System;
using System.ClientModel;
using System.ClientModel.Primitives;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Threading.Tasks;

namespace OpenAI.Images;

/// <summary> The service client for OpenAI image operations. </summary>
public partial class ImageClient
{
    private readonly OpenAIClientConnector _clientConnector;
    private Internal.Images Shim => _clientConnector.InternalClient.GetImagesClient();

    /// <summary>
    /// Initializes a new instance of <see cref="ImageClient"/>, used for image operation requests. 
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
    /// <param name="model">The model name for image operations that the client should use.</param>
    /// <param name="credential">The API key used to authenticate with the service endpoint.</param>
    /// <param name="options">Additional options to customize the client.</param>
    public ImageClient(Uri endpoint, string model, ApiKeyCredential credential, OpenAIClientOptions options = null)
    {
        _clientConnector = new(model, endpoint, credential, options);
    }

    /// <summary>
    /// Initializes a new instance of <see cref="ImageClient"/>, used for image operation requests. 
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
    /// <param name="model">The model name for image operations that the client should use.</param>
    /// <param name="options">Additional options to customize the client.</param>
    public ImageClient(Uri endpoint, string model, OpenAIClientOptions options = null)
        : this(endpoint, model, credential: null, options)
    { }

    /// <summary>
    /// Initializes a new instance of <see cref="ImageClient"/>, used for image operation requests. 
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
    /// <param name="model">The model name for image operations that the client should use.</param>
    /// <param name="credential">The API key used to authenticate with the service endpoint.</param>
    /// <param name="options">Additional options to customize the client.</param>
    public ImageClient(string model, ApiKeyCredential credential, OpenAIClientOptions options = null)
        : this(endpoint: null, model, credential, options)
    { }

    /// <summary>
    /// Initializes a new instance of <see cref="ImageClient"/>, used for image operation requests. 
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
    /// <param name="model">The model name for image operations that the client should use.</param>
    /// <param name="options">Additional options to customize the client.</param>
    public ImageClient(string model, OpenAIClientOptions options = null)
        : this(endpoint: null, model, credential: null, options)
    { }

    /// <summary>
    /// Generates a single image for a provided prompt.
    /// </summary>
    /// <param name="prompt"> The description and instructions for the image. </param>
    /// <param name="options"> Additional options for the image generation request. </param>
    /// <param name="cancellationToken"> The cancellation token for the operation. </param>
    /// <returns> A result for a single image generation. </returns>
    public virtual ClientResult<GeneratedImage> GenerateImage(
        string prompt,
        ImageGenerationOptions options = null)
    {
        ClientResult<GeneratedImageCollection> multiResult = GenerateImages(prompt, imageCount: null, options);
        return ClientResult.FromValue(multiResult.Value[0], multiResult.GetRawResponse());
    }

    /// <summary>
    /// Generates a single image for a provided prompt.
    /// </summary>
    /// <param name="prompt"> The description and instructions for the image. </param>
    /// <param name="options"> Additional options for the image generation request. </param>
    /// <param name="cancellationToken"> The cancellation token for the operation. </param>
    /// <returns> A result for a single image generation. </returns>
    public virtual async Task<ClientResult<GeneratedImage>> GenerateImageAsync(
        string prompt,
        ImageGenerationOptions options = null)
    {
        ClientResult<GeneratedImageCollection> multiResult = await GenerateImagesAsync(prompt, imageCount: null, options).ConfigureAwait(false);
        return ClientResult.FromValue(multiResult.Value[0], multiResult.GetRawResponse());
    }

    /// <summary>
    /// Generates a collection of image alternatives for a provided prompt.
    /// </summary>
    /// <param name="prompt"> The description and instructions for the image. </param>
    /// <param name="imageCount">
    ///     The number of alternative images to generate for the prompt.
    /// </param>
    /// <param name="options"> Additional options for the image generation request. </param>
    /// <param name="cancellationToken"> The cancellation token for the operation. </param>
    /// <returns> A result for a single image generation. </returns>
    public virtual ClientResult<GeneratedImageCollection> GenerateImages(
        string prompt,
        int? imageCount = null,
        ImageGenerationOptions options = null)
    {
        Internal.Models.CreateImageRequest request = CreateInternalImageRequest(prompt, imageCount, options);
        ClientResult<Internal.Models.ImagesResponse> response = Shim.CreateImage(request);

        List<GeneratedImage> images = [];
        for (int i = 0; i < response.Value.Data.Count; i++)
        {
            images.Add(new GeneratedImage(response.Value, i));
        }

        return ClientResult.FromValue(new GeneratedImageCollection(images), response.GetRawResponse());
    }

    /// <summary>
    /// Generates a collection of image alternatives for a provided prompt.
    /// </summary>
    /// <param name="prompt"> The description and instructions for the image. </param>
    /// <param name="imageCount">
    ///     The number of alternative images to generate for the prompt.
    /// </param>
    /// <param name="options"> Additional options for the image generation request. </param>
    /// <param name="cancellationToken"> The cancellation token for the operation. </param>
    /// <returns> A result for a single image generation. </returns>
    public virtual async Task<ClientResult<GeneratedImageCollection>> GenerateImagesAsync(
        string prompt,
        int? imageCount = null,
        ImageGenerationOptions options = null)
    {
        Internal.Models.CreateImageRequest request = CreateInternalImageRequest(prompt, imageCount, options);
        ClientResult<Internal.Models.ImagesResponse> response = await Shim.CreateImageAsync(request).ConfigureAwait(false);

        List<GeneratedImage> images = [];
        for (int i = 0; i < response.Value.Data.Count; i++)
        {
            images.Add(new GeneratedImage(response.Value, i));
        }

        return ClientResult.FromValue(new GeneratedImageCollection(images), response.GetRawResponse());
    }

    // convenience method - sync; Stream overload
    // TODO: add refdoc comment
    public virtual ClientResult<GeneratedImageCollection> GenerateImageEdits(
        Stream fileStream,
        string fileName,
        string prompt,
        int? imageCount = null,
        ImageEditOptions options = null)
    {
        Argument.AssertNotNull(fileStream, nameof(fileStream));
        Argument.AssertNotNull(fileName, nameof(fileName));
        Argument.AssertNotNull(prompt, nameof(prompt));

        if (options?.MaskBytes is not null)
        {
            Argument.AssertNotNull(options.MaskFileName, nameof(options.MaskFileName));
        }

        options ??= new();

        using MultipartFormDataBinaryContent content = options.ToMultipartContent(fileStream, fileName, prompt, _clientConnector.Model, imageCount);

        ClientResult result = GenerateImageEdits(content, content.ContentType);

        PipelineResponse response = result.GetRawResponse();

        GeneratedImageCollection value = GeneratedImageCollection.Deserialize(response.Content!);

        return ClientResult.FromValue(value, response);
    }

    // convenience method - sync
    // TODO: add refdoc comment
    public virtual ClientResult<GeneratedImageCollection> GenerateImageEdits(
        BinaryData imageBytes,
        string fileName,
        string prompt,
        int? imageCount = null,
        ImageEditOptions options = null)
    {
        Argument.AssertNotNull(imageBytes, nameof(imageBytes));
        Argument.AssertNotNull(fileName, nameof(fileName));
        Argument.AssertNotNull(prompt, nameof(prompt));

        if (options?.MaskBytes is not null)
        {
            Argument.AssertNotNull(options.MaskFileName, nameof(options.MaskFileName));
        }

        options ??= new();

        using MultipartFormDataBinaryContent content = options.ToMultipartContent(imageBytes, fileName, prompt, _clientConnector.Model, imageCount);

        ClientResult result = GenerateImageEdits(content, content.ContentType);

        PipelineResponse response = result.GetRawResponse();

        GeneratedImageCollection value = GeneratedImageCollection.Deserialize(response.Content!);

        return ClientResult.FromValue(value, response);
    }

    // convenience method - async; Stream overload
    // TODO: add refdoc comment
    public virtual async Task<ClientResult<GeneratedImageCollection>> GenerateImageEditsAsync(
        Stream fileStream,
        string fileName,
        string prompt,
        int? imageCount = null,
        ImageEditOptions options = null)
    {
        Argument.AssertNotNull(fileStream, nameof(fileStream));
        Argument.AssertNotNull(fileName, nameof(fileName));
        Argument.AssertNotNull(prompt, nameof(prompt));

        if (options?.MaskBytes is not null)
        {
            Argument.AssertNotNull(options.MaskFileName, nameof(options.MaskFileName));
        }

        options ??= new();

        using MultipartFormDataBinaryContent content = options.ToMultipartContent(fileStream, fileName, prompt, _clientConnector.Model, imageCount);

        ClientResult result = await GenerateImageEditsAsync(content, content.ContentType).ConfigureAwait(false);

        PipelineResponse response = result.GetRawResponse();

        GeneratedImageCollection value = GeneratedImageCollection.Deserialize(response.Content!);

        return ClientResult.FromValue(value, response);
    }

    // convenience method - async
    // TODO: add refdoc comment
    public virtual async Task<ClientResult<GeneratedImageCollection>> GenerateImageEditsAsync(
        BinaryData imageBytes,
        string fileName,
        string prompt,
        int? imageCount = null,
        ImageEditOptions options = null)
    {
        Argument.AssertNotNull(imageBytes, nameof(imageBytes));
        Argument.AssertNotNull(fileName, nameof(fileName));
        Argument.AssertNotNull(prompt, nameof(prompt));

        if (options?.MaskBytes is not null)
        {
            Argument.AssertNotNull(options.MaskFileName, nameof(options.MaskFileName));
        }

        options ??= new();

        using MultipartFormDataBinaryContent content = options.ToMultipartContent(imageBytes, fileName, prompt, _clientConnector.Model, imageCount);

        ClientResult result = await GenerateImageEditsAsync(content, content.ContentType).ConfigureAwait(false);

        PipelineResponse response = result.GetRawResponse();

        GeneratedImageCollection value = GeneratedImageCollection.Deserialize(response.Content!);

        return ClientResult.FromValue(value, response);
    }

    // convenience method - sync
    // TODO: add refdoc comment
    public virtual ClientResult<GeneratedImageCollection> GenerateImageVariations(
        Stream fileStream,
        string fileName,
        int? imageCount = null,
        ImageVariationOptions options = null)
    {
        Argument.AssertNotNull(fileStream, nameof(fileStream));
        Argument.AssertNotNull(fileName, nameof(fileName));

        options ??= new();

        using MultipartFormDataBinaryContent content = options.ToMultipartContent(fileStream, fileName, _clientConnector.Model, imageCount);

        ClientResult result = GenerateImageVariations(content, content.ContentType);

        PipelineResponse response = result.GetRawResponse();

        GeneratedImageCollection value = GeneratedImageCollection.Deserialize(response.Content!);

        return ClientResult.FromValue(value, response);
    }

    // convenience method - sync
    // TODO: add refdoc comment
    public virtual ClientResult<GeneratedImageCollection> GenerateImageVariations(
        BinaryData imageBytes,
        string fileName,
        int? imageCount = null,
        ImageVariationOptions options = null)
    {
        Argument.AssertNotNull(imageBytes, nameof(imageBytes));
        Argument.AssertNotNull(fileName, nameof(fileName));

        options ??= new();

        using MultipartFormDataBinaryContent content = options.ToMultipartContent(imageBytes, fileName, _clientConnector.Model, imageCount);

        ClientResult result = GenerateImageVariations(content, content.ContentType);

        PipelineResponse response = result.GetRawResponse();

        GeneratedImageCollection value = GeneratedImageCollection.Deserialize(response.Content!);

        return ClientResult.FromValue(value, response);
    }

    // convenience method - async; Stream overload
    // TODO: add refdoc comment
    public virtual async Task<ClientResult<GeneratedImageCollection>> GenerateImageVariationsAsync(
        Stream fileStream,
        string fileName,
        int? imageCount = null,
        ImageVariationOptions options = null)
    {
        Argument.AssertNotNull(fileStream, nameof(fileStream));
        Argument.AssertNotNull(fileName, nameof(fileName));

        options ??= new();

        using MultipartFormDataBinaryContent content = options.ToMultipartContent(fileStream, fileName, _clientConnector.Model, imageCount);

        ClientResult result = await GenerateImageVariationsAsync(content, content.ContentType).ConfigureAwait(false);

        PipelineResponse response = result.GetRawResponse();

        GeneratedImageCollection value = GeneratedImageCollection.Deserialize(response.Content!);

        return ClientResult.FromValue(value, response);
    }

    // convenience method - async
    // TODO: add refdoc comment
    public virtual async Task<ClientResult<GeneratedImageCollection>> GenerateImageVariationsAsync(
        BinaryData imageBytes,
        string fileName,
        int? imageCount = null,
        ImageVariationOptions options = null)
    {
        Argument.AssertNotNull(imageBytes, nameof(imageBytes));
        Argument.AssertNotNull(fileName, nameof(fileName));

        options ??= new();

        using MultipartFormDataBinaryContent content = options.ToMultipartContent(imageBytes, fileName, _clientConnector.Model, imageCount);

        ClientResult result = await GenerateImageVariationsAsync(content, content.ContentType).ConfigureAwait(false);

        PipelineResponse response = result.GetRawResponse();

        GeneratedImageCollection value = GeneratedImageCollection.Deserialize(response.Content!);

        return ClientResult.FromValue(value, response);
    }

    private Internal.Models.CreateImageRequest CreateInternalImageRequest(
        string prompt,
        int? imageCount = null,
        ImageGenerationOptions options = null)
    {
        options ??= new();
        Internal.Models.CreateImageRequestQuality? internalQuality = null;
        if (options.Quality != null)
        {
            internalQuality = options.Quality switch
            {
                ImageQuality.Standard => Internal.Models.CreateImageRequestQuality.Standard,
                ImageQuality.High => Internal.Models.CreateImageRequestQuality.Hd,
                _ => throw new ArgumentException(nameof(options.Quality)),
            };
        }

        Internal.Models.CreateImageRequestResponseFormat? internalFormat = null;
        if (options.ResponseFormat != null)
        {
            internalFormat = options.ResponseFormat switch
            {
                ImageResponseFormat.Bytes => Internal.Models.CreateImageRequestResponseFormat.B64Json,
                ImageResponseFormat.Uri => Internal.Models.CreateImageRequestResponseFormat.Url,
                _ => throw new ArgumentException(nameof(options.ResponseFormat)),
            };
        }

        Internal.Models.CreateImageRequestSize? internalSize = null;
        if (options.Size != null)
        {
            internalSize = options.Size switch
            {
                ImageSize.Size256x256 => Internal.Models.CreateImageRequestSize._256x256,
                ImageSize.Size512x512 => Internal.Models.CreateImageRequestSize._512x512,
                ImageSize.Size1024x1024 => Internal.Models.CreateImageRequestSize._1024x1024,
                ImageSize.Size1024x1792 => Internal.Models.CreateImageRequestSize._1024x1792,
                ImageSize.Size1792x1024 => Internal.Models.CreateImageRequestSize._1792x1024,
                _ => throw new ArgumentException(nameof(options.Size)),
            };
        }

        Internal.Models.CreateImageRequestStyle? internalStyle = null;
        if (options.Style != null)
        {
            internalStyle = options.Style switch
            {
                ImageStyle.Vivid => Internal.Models.CreateImageRequestStyle.Vivid,
                ImageStyle.Natural => Internal.Models.CreateImageRequestStyle.Natural,
                _ => throw new ArgumentException(nameof(options.Style)),
            };
        }

        return new Internal.Models.CreateImageRequest(
            prompt,
            _clientConnector.Model,
            imageCount,
            quality: internalQuality,
            responseFormat: internalFormat,
            size: internalSize,
            style: internalStyle,
            options.User,
            serializedAdditionalRawData: null);
    }

    private PipelineMessage CreateCreateImageEditsRequest(BinaryContent content, string contentType, RequestOptions options)
    {
        PipelineMessage message = Shim.Pipeline.CreateMessage();
        message.ResponseClassifier = ResponseErrorClassifier200;

        PipelineRequest request = message.Request;
        request.Method = "POST";

        UriBuilder uriBuilder = new(_clientConnector.Endpoint.AbsoluteUri);

        StringBuilder path = new();
        path.Append("/images/edits");
        uriBuilder.Path += path.ToString();

        request.Uri = uriBuilder.Uri;

        request.Headers.Set("Content-Type", contentType);

        request.Content = content;

        message.Apply(options);

        return message;
    }

    private PipelineMessage CreateImageVariationsRequest(BinaryContent content, string contentType, RequestOptions options)
    {
        PipelineMessage message = Shim.Pipeline.CreateMessage();
        message.ResponseClassifier = ResponseErrorClassifier200;

        PipelineRequest request = message.Request;
        request.Method = "POST";

        UriBuilder uriBuilder = new(_clientConnector.Endpoint.AbsoluteUri);

        StringBuilder path = new();
        path.Append("/images/variations");
        uriBuilder.Path += path.ToString();

        request.Uri = uriBuilder.Uri;

        request.Headers.Set("Content-Type", contentType);

        request.Content = content;

        message.Apply(options);

        return message;
    }

    private static PipelineMessageClassifier _responseErrorClassifier200;
    private static PipelineMessageClassifier ResponseErrorClassifier200 => _responseErrorClassifier200 ??= PipelineMessageClassifier.Create(stackalloc ushort[] { 200 });
}

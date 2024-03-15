using OpenAI.Audio;
using OpenAI.ClientShared.Internal;
using System;
using System.ClientModel;
using System.ClientModel.Primitives;
using System.Collections.Generic;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Text.Json;
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

    public virtual ClientResult<GeneratedImageCollection> GenerateImageEdits(
        BinaryData imageBytes,
        string prompt,
        int? imageCount = null,
        ImageEditOptions options = null)
    {
        PipelineMessage message = CreateInternalImageEditsPipelineMessage(imageBytes, prompt, imageCount, options);
        Shim.Pipeline.Send(message);

        if (message.Response.IsError)
        {
            throw new ClientResultException(message.Response);
        }

        using JsonDocument responseDocument = JsonDocument.Parse(message.Response.Content);
        Internal.Models.ImagesResponse response = Internal.Models.ImagesResponse.DeserializeImagesResponse(responseDocument.RootElement);

        List<GeneratedImage> images = [];
        for (int i = 0; i < response.Data.Count; i++)
        {
            images.Add(new GeneratedImage(response, i));
        }

        return ClientResult.FromValue(new GeneratedImageCollection(images), message.Response);
    }

    public virtual async Task<ClientResult<GeneratedImageCollection>> GenerateImageEditsAsync(
        BinaryData imageBytes,
        string prompt,
        int? imageCount = null,
        ImageEditOptions options = null)
    {
        PipelineMessage message = CreateInternalImageEditsPipelineMessage(imageBytes, prompt, imageCount, options);
        await Shim.Pipeline.SendAsync(message).ConfigureAwait(false);

        if (message.Response.IsError)
        {
            throw new ClientResultException(message.Response);
        }

        using JsonDocument responseDocument = JsonDocument.Parse(message.Response.Content);
        Internal.Models.ImagesResponse response = Internal.Models.ImagesResponse.DeserializeImagesResponse(responseDocument.RootElement);

        List<GeneratedImage> images = [];
        for (int i = 0; i < response.Data.Count; i++)
        {
            images.Add(new GeneratedImage(response, i));
        }

        return ClientResult.FromValue(new GeneratedImageCollection(images), message.Response);
    }

    public virtual ClientResult<GeneratedImageCollection> GenerateImageVariations(
        BinaryData imageBytes,
        int? imageCount = null,
        ImageVariationOptions options = null)
    {
        PipelineMessage message = CreateInternalImageVariationsPipelineMessage(imageBytes, imageCount, options);
        Shim.Pipeline.Send(message);

        if (message.Response.IsError)
        {
            throw new ClientResultException(message.Response);
        }

        using JsonDocument responseDocument = JsonDocument.Parse(message.Response.Content);
        Internal.Models.ImagesResponse response = Internal.Models.ImagesResponse.DeserializeImagesResponse(responseDocument.RootElement);

        List<GeneratedImage> images = [];
        for (int i = 0; i < response.Data.Count; i++)
        {
            images.Add(new GeneratedImage(response, i));
        }

        return ClientResult.FromValue(new GeneratedImageCollection(images), message.Response);
    }

    public virtual async Task<ClientResult<GeneratedImageCollection>> GenerateImageVariationsAsync(
        BinaryData imageBytes,
        int? imageCount = null,
        ImageVariationOptions options = null)
    {
        PipelineMessage message = CreateInternalImageVariationsPipelineMessage(imageBytes, imageCount, options);
        await Shim.Pipeline.SendAsync(message).ConfigureAwait(false);

        if (message.Response.IsError)
        {
            throw new ClientResultException(message.Response);
        }

        using JsonDocument responseDocument = JsonDocument.Parse(message.Response.Content);
        Internal.Models.ImagesResponse response = Internal.Models.ImagesResponse.DeserializeImagesResponse(responseDocument.RootElement);

        List<GeneratedImage> images = [];
        for (int i = 0; i < response.Data.Count; i++)
        {
            images.Add(new GeneratedImage(response, i));
        }

        return ClientResult.FromValue(new GeneratedImageCollection(images), message.Response);
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

    private PipelineMessage CreateInternalImageEditsPipelineMessage(
        BinaryData imageBytes,
        string prompt,
        int? imageCount = null,
        ImageEditOptions options = null)
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

        options ??= new();
        MultipartFormDataContent requestContent = CreateInternalImageEditsMultipartFormDataContent(
            imageBytes,
            prompt,
            options.MaskBytes,
            imageCount,
            options.ResponseFormat,
            options.Size,
            options.User);
        requestContent.ApplyToRequest(request);

        return message;
    }

    private MultipartFormDataContent CreateInternalImageEditsMultipartFormDataContent(
        BinaryData imageBytes,
        string prompt,
        BinaryData maskBytes,
        int? imageCount,
        ImageResponseFormat? imageResponseFormat,
        ImageSize? imageSize,
        string user)
    {
        MultipartFormDataContent content = new();

        content.Add(MultipartContent.Create(imageBytes), name: "image", fileName: "image.png", headers: []);

        content.Add(MultipartContent.Create(BinaryData.FromString(prompt)), name: "prompt", headers: []);

        content.Add(MultipartContent.Create(BinaryData.FromString(_clientConnector.Model)), name: "model", headers: []);

        if (Optional.IsDefined(maskBytes))
        {
            content.Add(MultipartContent.Create(maskBytes), name: "mask", fileName: "mask.png", headers: []);
        }

        if (Optional.IsDefined(imageCount))
        {
            content.Add(MultipartContent.Create(BinaryData.FromString(imageCount.ToString())), name: "n", headers: []);
        }

        if (Optional.IsDefined(imageResponseFormat))
        {
            content.Add(MultipartContent.Create(
                BinaryData.FromString(
                    imageResponseFormat switch
                    {
                        ImageResponseFormat.Uri => "url",
                        ImageResponseFormat.Bytes => "b64_json",
                        _ => throw new ArgumentException(nameof(imageResponseFormat)),
                    })
                ),
                name: "response_format",
                headers: []);
        }

        if (Optional.IsDefined(imageSize))
        {
            content.Add(MultipartContent.Create(
                BinaryData.FromString(
                    imageSize switch
                    {
                        ImageSize.Size256x256 => "256x256",
                        ImageSize.Size512x512 => "512x512",
                        ImageSize.Size1024x1024 => "1024x1024",
                        // TODO: 1024x1792 and 1792x1024 are currently not supported in image edits.
                        ImageSize.Size1024x1792 => "1024x1792",
                        ImageSize.Size1792x1024 => "1792x1024",
                        _ => throw new ArgumentException(nameof(imageSize))
                    })
                ),
                name: "size",
                headers: []);
        }

        if (Optional.IsDefined(user))
        {
            content.Add(MultipartContent.Create(BinaryData.FromString(user)), "user", []);
        }

        return content;
    }

    private PipelineMessage CreateInternalImageVariationsPipelineMessage(
        BinaryData imageBytes,
        int? imageCount = null,
        ImageVariationOptions options = null)
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

        options ??= new();
        MultipartFormDataContent requestContent = CreateInternalImageVariationsMultipartFormDataContent(
            imageBytes,
            imageCount,
            options.ResponseFormat,
            options.Size,
            options.User);
        requestContent.ApplyToRequest(request);

        return message;
    }

    private MultipartFormDataContent CreateInternalImageVariationsMultipartFormDataContent(
        BinaryData imageBytes,
        int? imageCount,
        ImageResponseFormat? imageResponseFormat,
        ImageSize? imageSize,
        string user)
    {
        MultipartFormDataContent content = new();

        content.Add(MultipartContent.Create(imageBytes), name: "image", fileName: "image.png", headers: []);

        content.Add(MultipartContent.Create(BinaryData.FromString(_clientConnector.Model)), name: "model", headers: []);

        if (Optional.IsDefined(imageCount))
        {
            content.Add(MultipartContent.Create(BinaryData.FromString(imageCount.ToString())), name: "n", headers: []);
        }

        if (Optional.IsDefined(imageResponseFormat))
        {
            content.Add(MultipartContent.Create(
                BinaryData.FromString(
                    imageResponseFormat switch
                    {
                        ImageResponseFormat.Uri => "url",
                        ImageResponseFormat.Bytes => "b64_json",
                        _ => throw new ArgumentException(nameof(imageResponseFormat)),
                    })
                ),
                name: "response_format",
                headers: []);
        }

        if (Optional.IsDefined(imageSize))
        {
            content.Add(MultipartContent.Create(
                BinaryData.FromString(
                    imageSize switch
                    {
                        ImageSize.Size256x256 => "256x256",
                        ImageSize.Size512x512 => "512x512",
                        ImageSize.Size1024x1024 => "1024x1024",
                        // TODO: 1024x1792 and 1792x1024 are currently not supported in image variations.
                        ImageSize.Size1024x1792 => "1024x1792",
                        ImageSize.Size1792x1024 => "1792x1024",
                        _ => throw new ArgumentException(nameof(imageSize))
                    })
                ),
                name: "size",
                headers: []);
        }

        if (Optional.IsDefined(user))
        {
            content.Add(MultipartContent.Create(BinaryData.FromString(user)), "user", []);
        }

        return content;
    }

    private static PipelineMessageClassifier _responseErrorClassifier200;
    private static PipelineMessageClassifier ResponseErrorClassifier200 => _responseErrorClassifier200 ??= PipelineMessageClassifier.Create(stackalloc ushort[] { 200 });

    private Internal.Models.CreateImageEditRequest CreateInternalImageEditRequest(
        BinaryData imageBytes,
        string prompt,
        int? imageCount = null,
        ImageEditOptions options = null)
    {
        options ??= new();

        
        Internal.Models.CreateImageEditRequestSize? internalSize = null;
        if (options.Size != null)
        {
            internalSize = options.Size switch
            {

                ImageSize.Size256x256 => Internal.Models.CreateImageEditRequestSize._256x256,
                ImageSize.Size512x512 => Internal.Models.CreateImageEditRequestSize._512x512,
                ImageSize.Size1024x1024 => Internal.Models.CreateImageEditRequestSize._1024x1024,
                // TODO: 1024x1792 and 1792x1024 are currently not supported in image edits.
                ImageSize.Size1024x1792 => new Internal.Models.CreateImageEditRequestSize("1024x1792"),
                ImageSize.Size1792x1024 => new Internal.Models.CreateImageEditRequestSize("1792x1024"),
                _ => throw new ArgumentException(nameof(options.Size)),
            };
        }

        Internal.Models.CreateImageEditRequestResponseFormat? internalFormat = null;
        if (options.ResponseFormat != null)
        {
            internalFormat = options.ResponseFormat switch
            {
                ImageResponseFormat.Bytes => Internal.Models.CreateImageEditRequestResponseFormat.B64Json,
                ImageResponseFormat.Uri => Internal.Models.CreateImageEditRequestResponseFormat.Url,
                _ => throw new ArgumentException(nameof(options.ResponseFormat)),
            };
        }

        return new Internal.Models.CreateImageEditRequest(
            imageBytes,
            prompt,
            options.MaskBytes,
            _clientConnector.Model,
            imageCount,
            internalSize,
            internalFormat,
            options.User,
            serializedAdditionalRawData: null);
    }
}

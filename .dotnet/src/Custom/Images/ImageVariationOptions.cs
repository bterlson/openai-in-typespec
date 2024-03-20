using OpenAI.Internal;
using System;
using System.IO;

namespace OpenAI.Images;

/// <summary>
/// Represents additional options available to control the behavior of an image generation operation.
/// </summary>
public partial class ImageVariationOptions
{
    /// <inheritdoc cref="Internal.Models.CreateImageEditRequest.Size"/>
    public ImageSize? Size { get; set; }

    /// <inheritdoc cref="Internal.Models.CreateImageEditRequest.ResponseFormat"/>
    public ImageResponseFormat? ResponseFormat { get; set; }

    /// <inheritdoc cref="Internal.Models.CreateImageEditRequest.User"/>
    public string User { get; set; }

    internal MultipartFormDataBinaryContent ToMultipartContent(Stream fileStream, string fileName,  string model, int? imageCount)
    {
        MultipartFormDataBinaryContent content = new();

        content.Add(fileStream, "image", fileName);

        AddContent(model, imageCount, content);

        return content;
    }

    internal MultipartFormDataBinaryContent ToMultipartContent(BinaryData imageBytes, string fileName, string model, int? imageCount)
    {
        MultipartFormDataBinaryContent content = new();

        content.Add(imageBytes, "image", fileName);

        AddContent(model, imageCount, content);

        return content;
    }

    private void AddContent(string model, int? imageCount, MultipartFormDataBinaryContent content)
    {
        content.Add(model, "model");

        if (imageCount is not null)
        {
            content.Add(imageCount.Value, "n");
        }

        if (ResponseFormat is not null)
        {
            string format = ResponseFormat switch
            {
                ImageResponseFormat.Uri => "url",
                ImageResponseFormat.Bytes => "b64_json",
                _ => throw new ArgumentException(nameof(ResponseFormat)),
            };

            content.Add(format, "response_format");
        }

        if (Size is not null)
        {
            string imageSize = Size switch
            {
                ImageSize.Size256x256 => "256x256",
                ImageSize.Size512x512 => "512x512",
                ImageSize.Size1024x1024 => "1024x1024",
                // TODO: 1024x1792 and 1792x1024 are currently not supported in image edits.
                ImageSize.Size1024x1792 => "1024x1792",
                ImageSize.Size1792x1024 => "1792x1024",
                _ => throw new ArgumentException(nameof(imageSize))
            };

            content.Add(imageSize, "size");
        }

        if (User is not null)
        {
            content.Add(User, "user");
        }
    }
}
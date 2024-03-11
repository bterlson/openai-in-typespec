using System;

namespace OpenAI.Images;

/// <summary>
/// Represents additional options available to control the behavior of an image generation operation.
/// </summary>
public partial class ImageEditOptions
{
    /// <inheritdoc cref="Internal.Models.CreateImageEditRequest.Mask"/>
    public BinaryData MaskBytes { get; set; }

    /// <inheritdoc cref="Internal.Models.CreateImageEditRequest.Size"/>
    public ImageSize? Size { get; set; }

    /// <inheritdoc cref="Internal.Models.CreateImageEditRequest.ResponseFormat"/>
    public ImageResponseFormat? ResponseFormat { get; set; }

    /// <inheritdoc cref="Internal.Models.CreateImageEditRequest.User"/>
    public string User { get; set; }
}
using System;

namespace OpenAI.Chat;

/// <summary>
/// Represents the common base type for a piece of message content used for chat completions.
/// </summary>
public partial class ChatMessageContent
{
    /// <summary>
    /// The type of message content data, e.g. text or image, that this <see cref="ChatMessageContent"/> instance
    /// represents.
    /// </summary>
    public ChatMessageContentKind ContentKind { get; }

    private object _contentValue;
    private string _contentMediaTypeName;

    internal ChatMessageContent(object value,  ChatMessageContentKind kind, string contentMediaTypeName = null)
    {
        _contentValue = value;
        ContentKind = kind;
        _contentMediaTypeName = contentMediaTypeName;
    }

    /// <summary>
    /// Creates a new instance of <see cref="ChatMessageContent"/> that encapsulates text content.
    /// </summary>
    /// <param name="text"> The content for the new instance. </param>
    /// <returns> A new instance of <see cref="ChatMessageContent"/>. </returns>
    public static ChatMessageContent CreateText(string text) => new(text, ChatMessageContentKind.Text);

    /// <summary>
    /// Creates a new instance of <see cref="ChatMessageContent"/> that encapsulates image content obtained from
    /// an internet location that will be accessible to the model when evaluating a message with this content.
    /// </summary>
    /// <param name="imageUri">
    ///     An internet location pointing to an image. This must be accessible to the model.
    /// </param>
    /// <returns> A new instance of <see cref="ChatMessageContent"/>. </returns>
    public static ChatMessageContent CreateImage(Uri imageUri) => new(imageUri, ChatMessageContentKind.Image);

    /// <summary>
    /// Creates a new instance of <see cref="ChatMessageContent"/> that encapsulates binary image content.
    /// </summary>
    /// <param name="imageBytes"> The binary representation of the image content. </param>
    /// <param name="mediaType"> The media type name, e.g. image/png, for the image. </param>
    /// <returns> A new instance of <see cref="ChatMessageContent"/>. </returns>
    public static ChatMessageContent CreateImage(BinaryData imageBytes, string mediaType)
        => new(imageBytes, ChatMessageContentKind.Image, mediaType);

    /// <summary>
    /// Provides the <see cref="string"/> associated with a content item using
    /// <see cref="ChatMessageContentKind.Text"/>.
    /// </summary>
    /// <remarks>
    /// <see cref="ToString"/> will infer from the content type and `ChatMessageContent` known to be text can typically
    /// be treated like a string without calling this explicitly.
    /// </remarks>
    /// <returns> The content string for the text content item. </returns>
    /// <exception cref="InvalidOperationException"> The content does not support a text representation. </exception>
    public string ToText()
        => ContentKind switch
        {
            ChatMessageContentKind.Text => _contentValue?.ToString(),
            _ => throw new InvalidOperationException(
                $"{nameof(ToText)} conversion not supported for content kind: {ContentKind}"),
        };

    /// <summary>
    /// Provides a <see cref="Uri"/> associated with a content item. These URIs can refer to an internet location
    /// accessible to the target model or can be base64-encoded data URIs.
    /// </summary>
    /// <returns> A URI representation of the content item. </returns>
    /// <exception cref="InvalidOperationException"> The content does not support a URI representation. </exception>
    public Uri ToUri()
        => ContentKind switch
        {
            ChatMessageContentKind.Image => _contentValue switch
            {
                Uri imageUri => imageUri,
                BinaryData imageData => new Uri($"data:{_contentMediaTypeName};base64,{Convert.ToBase64String(imageData.ToArray())}"),
                _ => throw new InvalidOperationException(
                    $"Cannot convert underlying image data type '{_contentValue?.GetType()}' to a {nameof(Uri)}"),
            },
            _ => throw new InvalidOperationException(
                $"{nameof(ToText)} conversion not supported for content kind: {ContentKind}"),
        };

    /// <summary>
    /// The implicit conversion operator that infers an equivalent <see cref="ChatMessageContent"/> instance from
    /// a plain <see cref="string"/>.
    /// </summary>
    /// <param name="value"> The text for the message content. </param>
    public static implicit operator ChatMessageContent(string value) => CreateText(value);

    /// <summary>
    /// An implicit operator allowing a content item to be treated as a string.
    /// </summary>
    /// <param name="content"></param>
    public static implicit operator string(ChatMessageContent content) => content.ToText();

    /// <inheritdoc/>
    public override string ToString()
    {
        if (ContentKind == ChatMessageContentKind.Text)
        {
            return ToText();
        }
        return base.ToString();
    }
}

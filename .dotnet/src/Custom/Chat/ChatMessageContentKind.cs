namespace OpenAI.Chat;

/// <summary>
/// Represents the possibles of underlying data for a chat message's <c>content</c> property.
/// </summary>
public enum ChatMessageContentKind
{
    /// <summary>
    /// Plain text content, represented as a <see cref="string"/>.
    /// </summary>
    Text,
    /// <summary>
    /// Image content, as used exclusively by <c>gpt-4-vision-preview</c> when providing an array of content items
    /// into a chat completion request.
    /// </summary>
    Image,
    // Audio,
    // Video,
}
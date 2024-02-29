namespace OpenAI.Chat;

/// <summary>
/// Represents computed token consumption statistics for a chat completion request.
/// </summary>
public class ChatTokenUsage
{
    /// <inheritdoc cref="Internal.Models.CompletionUsage.PromptTokens"/>
    public long InputTokens { get; }
    /// <inheritdoc cref="Internal.Models.CompletionUsage.CompletionTokens"/>
    public long OutputTokens { get; }
    /// <inheritdoc cref="Internal.Models.CompletionUsage.TotalTokens"/>
    public long TotalTokens { get; }

    internal ChatTokenUsage(Internal.Models.CompletionUsage internalUsage)
    {
        InputTokens = internalUsage.PromptTokens;
        OutputTokens = internalUsage.CompletionTokens;
        TotalTokens = internalUsage.TotalTokens;
    }
}
namespace OpenAI.Chat;

/// <summary>
/// Represents computed token consumption statistics for a chat completion request.
/// </summary>
public class ChatTokenUsage
{
    /// <inheritdoc cref="Internal.Models.CompletionUsage.PromptTokens"/>
    public int InputTokens { get; }
    /// <inheritdoc cref="Internal.Models.CompletionUsage.CompletionTokens"/>
    public int OutputTokens { get; }
    /// <inheritdoc cref="Internal.Models.CompletionUsage.TotalTokens"/>
    public int TotalTokens { get; }

    internal ChatTokenUsage(Internal.Models.CompletionUsage internalUsage)
    {
        InputTokens = (int)internalUsage.PromptTokens;
        OutputTokens = (int)internalUsage.CompletionTokens;
        TotalTokens = (int)internalUsage.TotalTokens;
    }
}
namespace OpenAI.Assistants;

public partial class RunTokenUsage
{
    public long InputTokens { get; }
    public long OutputTokens { get; }
    public long TotalTokens { get; }

    internal RunTokenUsage(long inputTokens, long outputTokens, long totalTokens)
    {
        InputTokens = inputTokens;
        OutputTokens = outputTokens;
        TotalTokens = totalTokens;
    }

    internal RunTokenUsage(Internal.Models.RunCompletionUsage internalUsage)
        : this(internalUsage.PromptTokens, internalUsage.CompletionTokens, internalUsage.TotalTokens)
    {
    }
}
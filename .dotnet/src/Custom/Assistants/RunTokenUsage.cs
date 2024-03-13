namespace OpenAI.Assistants;

public partial class RunTokenUsage
{
    public int InputTokens { get; }
    public int OutputTokens { get; }
    public int TotalTokens { get; }

    internal RunTokenUsage(int inputTokens, int outputTokens, int totalTokens)
    {
        InputTokens = inputTokens;
        OutputTokens = outputTokens;
        TotalTokens = totalTokens;
    }

    internal RunTokenUsage(Internal.Models.RunCompletionUsage internalUsage)
        : this((int)internalUsage.PromptTokens, (int)internalUsage.CompletionTokens, (int)internalUsage.TotalTokens)
    {
    }
}
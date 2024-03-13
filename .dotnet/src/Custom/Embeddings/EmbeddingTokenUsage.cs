namespace OpenAI.Embeddings;

public partial class EmbeddingTokenUsage
{
    private Internal.Models.EmbeddingUsage _internalUsage;

    /// <inheritdoc cref="Internal.Models.EmbeddingUsage.PromptTokens"/>
    public int InputTokens => (int)_internalUsage.PromptTokens;
    /// <inheritdoc cref="Internal.Models.EmbeddingUsage.TotalTokens"/>
    public int TotalTokens => (int)_internalUsage.TotalTokens;

    internal EmbeddingTokenUsage(Internal.Models.EmbeddingUsage internalUsage)
    {
        _internalUsage = internalUsage;
    }
}
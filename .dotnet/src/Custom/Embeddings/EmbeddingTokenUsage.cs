namespace OpenAI.Embeddings;

public partial class EmbeddingTokenUsage
{
    private Internal.Models.EmbeddingUsage _internalUsage;

    /// <inheritdoc cref="Internal.Models.EmbeddingUsage.PromptTokens"/>
    public long InputTokens => _internalUsage.PromptTokens;
    /// <inheritdoc cref="Internal.Models.EmbeddingUsage.TotalTokens"/>
    public long TotalTokens => _internalUsage.TotalTokens;

    internal EmbeddingTokenUsage(Internal.Models.EmbeddingUsage internalUsage)
    {
        _internalUsage = internalUsage;
    }
}
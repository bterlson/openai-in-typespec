using System.ClientModel;
using System.ClientModel.Primitives;
using System.ComponentModel;
using System.Threading.Tasks;

namespace OpenAI.Embeddings;

public partial class EmbeddingClient
{
    /// <inheritdoc cref="Internal.Embeddings.CreateEmbedding(BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GenerateEmbeddings(BinaryContent content, RequestOptions options = null)
        => Shim.CreateEmbedding(content, options);

    /// <inheritdoc cref="Internal.Embeddings.CreateEmbeddingAsync(BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> GenerateEmbeddingsAsync(BinaryContent content, RequestOptions options = null)
        => await Shim.CreateEmbeddingAsync(content, options).ConfigureAwait(false);
}
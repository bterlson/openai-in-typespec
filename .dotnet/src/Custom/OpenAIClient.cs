using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace OpenAI
{
    public partial class OpenAIClient
    {
        // TODO: This needs to be suppressed.
        internal virtual Embeddings GetEmbeddingsClient()
        {
            return Volatile.Read(ref _cachedEmbeddings) ?? Interlocked.CompareExchange(ref _cachedEmbeddings, new Embeddings(_pipeline, _credential, _endpoint), null) ?? _cachedEmbeddings;
        }

        /// <summary> Initializes a new instance of Embeddings. </summary>
        public virtual Embeddings GetEmbeddingsClient(string model)
        {
            return Volatile.Read(ref _cachedEmbeddings) ?? Interlocked.CompareExchange(ref _cachedEmbeddings, new Embeddings(model, _pipeline, _credential, _endpoint), null) ?? _cachedEmbeddings;
        }
    }
}

using OpenAI.Models;
using System;

namespace OpenAI
{
    /// <summary> Model factory for models. </summary>
    public static partial class OpenAIModelFactory
    {
        /// <summary> Initializes a new instance of <see cref="Models.Embedding"/>. </summary>
        /// <param name="index"> The index of the embedding in the list of embeddings. </param>
        /// <param name="embeddingAsFloats">
        /// The embedding vector, which is a list of floats. The length of vector depends on the model as
        /// listed in the [embedding guide](/docs/guides/embeddings).
        /// </param>
        /// <param name="object"> The object type, which is always "embedding". </param>
        /// <returns> A new <see cref="Models.Embedding"/> instance for mocking. </returns>
        public static Embedding Embedding(long index = default, ReadOnlyMemory<float>? embeddingAsFloats = null)
        {
            // TODO: We need to populate the embedding property from the embeddingAsFloats parameter.
            return new Embedding(index, embeddingProperty: null, EmbeddingObject.Embedding, serializedAdditionalRawData: null, embeddingAsFloats, embeddingAsBase64Data: null);
        }

        /// <summary> Initializes a new instance of <see cref="Models.Embedding"/>. </summary>
        /// <param name="index"> The index of the embedding in the list of embeddings. </param>
        /// <param name="embeddingAsBase64Data">
        /// The embedding vector, which is a list of floats. The length of vector depends on the model as
        /// listed in the [embedding guide](/docs/guides/embeddings).
        /// </param>
        /// <param name="object"> The object type, which is always "embedding". </param>
        /// <returns> A new <see cref="Models.Embedding"/> instance for mocking. </returns>
        public static Embedding Embedding(long index = default, BinaryData embeddingAsBase64Data = default)
        {
            return new Embedding(index, embeddingAsBase64Data, EmbeddingObject.Embedding, serializedAdditionalRawData: null, embeddingAsFloats: null, embeddingAsBase64Data);
        }
    }
}

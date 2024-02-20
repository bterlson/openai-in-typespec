using System;
using System.Collections.Generic;

#nullable disable

namespace OpenAI.Models
{
    public partial class Embedding
    {
        /// <summary>
        /// The embedding vector, which is a list of floats. The length of vector depends on the model as
        /// listed in the [embedding guide](/docs/guides/embeddings).
        /// <para>
        /// To assign an object to this property use <see cref="BinaryData.FromObjectAsJson{T}(T, System.Text.Json.JsonSerializerOptions?)"/>.
        /// </para>
        /// <para>
        /// To assign an already formatted json string to this property use <see cref="BinaryData.FromString(string)"/>.
        /// </para>
        /// <para>
        /// <remarks>
        /// Supported types:
        /// <list type="bullet">
        /// <item>
        /// <description><see cref="IList{T}"/> where <c>T</c> is of type <see cref="double"/></description>
        /// </item>
        /// <item>
        /// <description><see cref="string"/></description>
        /// </item>
        /// </list>
        /// </remarks>
        /// Examples:
        /// <list type="bullet">
        /// <item>
        /// <term>BinaryData.FromObjectAsJson("foo")</term>
        /// <description>Creates a payload of "foo".</description>
        /// </item>
        /// <item>
        /// <term>BinaryData.FromString("\"foo\"")</term>
        /// <description>Creates a payload of "foo".</description>
        /// </item>
        /// <item>
        /// <term>BinaryData.FromObjectAsJson(new { key = "value" })</term>
        /// <description>Creates a payload of { "key": "value" }.</description>
        /// </item>
        /// <item>
        /// <term>BinaryData.FromString("{\"key\": \"value\"}")</term>
        /// <description>Creates a payload of { "key": "value" }.</description>
        /// </item>
        /// </list>
        /// </para>
        /// </summary>
        internal BinaryData EmbeddingProperty { get; }
        /// <summary> The object type, which is always "embedding". </summary>
        internal EmbeddingObject Object { get; } = EmbeddingObject.Embedding;

        internal Embedding(long index, BinaryData embeddingProperty, EmbeddingObject @object, IDictionary<string, BinaryData> serializedAdditionalRawData, ReadOnlyMemory<float>? embeddingAsFloats, BinaryData embeddingAsBase64Data)
            : this(index, embeddingProperty, @object, serializedAdditionalRawData)
        {
            EmbeddingAsFloats = embeddingAsFloats;
            EmbeddingAsBase64Data = embeddingAsBase64Data;
        }

        /// <summary> The embedding represented as a vector of floats. </summary>
        public ReadOnlyMemory<float>? EmbeddingAsFloats { get; }
        /// <summary> The embedding represented as a Base64-encoded string. </summary>
        public BinaryData EmbeddingAsBase64Data { get; }
    }
}

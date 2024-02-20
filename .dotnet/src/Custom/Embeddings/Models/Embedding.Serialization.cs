using System;
using System.ClientModel.Primitives;
using System.Collections.Generic;
using System.Text.Json;

namespace OpenAI.Models
{
    public partial class Embedding
    {
        internal static Embedding DeserializeEmbedding(JsonElement element, ModelReaderWriterOptions options = null)
        {
            options ??= new ModelReaderWriterOptions("W");

            if (element.ValueKind == JsonValueKind.Null)
            {
                return null;
            }
            long index = default;
            BinaryData embedding = default;
            EmbeddingObject @object = default;
            IDictionary<string, BinaryData> serializedAdditionalRawData = default;
            Dictionary<string, BinaryData> additionalPropertiesDictionary = new Dictionary<string, BinaryData>();
            foreach (var property in element.EnumerateObject())
            {
                if (property.NameEquals("index"u8))
                {
                    index = property.Value.GetInt64();
                    continue;
                }
                if (property.NameEquals("embedding"u8))
                {
                    embedding = BinaryData.FromString(property.Value.GetRawText());
                    continue;
                }
                if (property.NameEquals("object"u8))
                {
                    @object = new EmbeddingObject(property.Value.GetString());
                    continue;
                }
                if (options.Format != "W")
                {
                    additionalPropertiesDictionary.Add(property.Name, BinaryData.FromString(property.Value.GetRawText()));
                }
            }

            ReadOnlyMemory<float>? embeddingAsFloats = default;
            BinaryData embeddingAsBase64Data = default;
            JsonDocument doc = JsonDocument.Parse(embedding);

            if (doc.RootElement.ValueKind == JsonValueKind.Array)
            {
                List<float> floats = new();
                foreach (var item in doc.RootElement.EnumerateArray())
                {
                    floats.Add(item.GetSingle());
                }
                embeddingAsFloats = new ReadOnlyMemory<float>(floats.ToArray());
            }
            else if (doc.RootElement.ValueKind == JsonValueKind.String)
            {
                embeddingAsBase64Data = embedding;
            }

            return new(index, embedding, @object, serializedAdditionalRawData, embeddingAsFloats, embeddingAsBase64Data);
        }
    }
}

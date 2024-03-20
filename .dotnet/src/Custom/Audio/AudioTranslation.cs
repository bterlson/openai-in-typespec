using System;
using System.ClientModel.Primitives;
using System.Text.Json;

namespace OpenAI.Audio;

public partial class AudioTranslation
{
    public string Text { get; }

    internal AudioTranslation(string text)
    {
        Text = text;
    }

    internal static AudioTranslation Deserialize(BinaryData content)
    {
        using JsonDocument responseDocument = JsonDocument.Parse(content);
        return DeserializeAudioTranslation(responseDocument.RootElement);
    }

    internal static AudioTranslation DeserializeAudioTranslation(JsonElement element, ModelReaderWriterOptions options = default)
    {
        string text = null;

        foreach (JsonProperty property in element.EnumerateObject())
        {
            if (property.NameEquals("text"u8))
            {
                text = property.Value.GetString();
                continue;
            }
        }

        return new AudioTranslation(text);
    }
}
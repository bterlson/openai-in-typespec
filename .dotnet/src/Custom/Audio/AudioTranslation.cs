using System;
using System.ClientModel.Primitives;
using System.Collections.Generic;
using System.Text.Json;

namespace OpenAI.Audio;

public partial class AudioTranslation
{
    public string Text { get; }

    internal AudioTranslation(string text)
    {
        Text = text;
    }

    internal static AudioTranslation DeserializeAudioTranscription(JsonElement element, ModelReaderWriterOptions options = default)
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
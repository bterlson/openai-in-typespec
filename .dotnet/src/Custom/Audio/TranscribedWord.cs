using System;
using System.ClientModel.Primitives;
using System.Text.Json;

namespace OpenAI.Audio;

public partial class TranscribedWord
{
    public string Word { get; }
    public TimeSpan Start { get; }
    public TimeSpan End { get; }

    internal TranscribedWord(string word, TimeSpan start, TimeSpan end)
    {
        Word = word;
        Start = start;
        End = end;
    }

    internal static TranscribedWord DeserializeTranscribedWord(JsonElement element, ModelReaderWriterOptions options = default)
    {
        string word = null;
        TimeSpan? start = null;
        TimeSpan? end = null;
        foreach (JsonProperty wordProperty in element.EnumerateObject())
        {
            if (wordProperty.NameEquals("word"u8))
            {
                word = wordProperty.Value.GetString();
                continue;
            }
            if (wordProperty.NameEquals("start"u8))
            {
                start = TimeSpan.FromSeconds(wordProperty.Value.GetSingle());
                continue;
            }
            if (wordProperty.NameEquals("end"u8))
            {
                end = TimeSpan.FromSeconds(wordProperty.Value.GetSingle());
                continue;
            }
        }
        return new TranscribedWord(word, start.Value, end.Value);
    }
}
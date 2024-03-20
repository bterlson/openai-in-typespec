using System;
using System.ClientModel.Primitives;
using System.Collections.Generic;
using System.Text.Json;

namespace OpenAI.Audio;

public partial class AudioTranscription
{
    public string Language { get; }
    public TimeSpan? Duration { get; }
    public string Text { get; }
    public IReadOnlyList<TranscribedWord> Words { get; }
    public IReadOnlyList<TranscriptionSegment> Segments { get; }

    internal AudioTranscription(string language, TimeSpan? duration, string text, IReadOnlyList<TranscribedWord> words, IReadOnlyList<TranscriptionSegment> segments)
    {
        Language = language;
        Duration = duration;
        Text = text;
        Words = words;
        Segments = segments;
    }

    internal static AudioTranscription Deserialize(BinaryData content)
    {
        using JsonDocument responseDocument = JsonDocument.Parse(content);
        return DeserializeAudioTranscription(responseDocument.RootElement);
    }

    internal static AudioTranscription DeserializeAudioTranscription(JsonElement element, ModelReaderWriterOptions options = default)
    {
        string language = null;
        TimeSpan? duration = null;
        string text = null;
        List<TranscribedWord> words = null;
        List<TranscriptionSegment> segments = null;

        foreach (JsonProperty topLevelProperty in element.EnumerateObject())
        {
            if (topLevelProperty.NameEquals("language"u8))
            {
                language = topLevelProperty.Value.GetString();
                continue;
            }
            if (topLevelProperty.NameEquals("duration"u8))
            {
                duration = TimeSpan.FromSeconds(topLevelProperty.Value.GetSingle());
                continue;
            }
            if (topLevelProperty.NameEquals("text"u8))
            {
                text = topLevelProperty.Value.GetString();
                continue;
            }
            if (topLevelProperty.NameEquals("words"u8))
            {
                words = [];
                foreach (JsonElement wordElement in topLevelProperty.Value.EnumerateArray())
                {
                    words.Add(TranscribedWord.DeserializeTranscribedWord(wordElement, options));
                }
                continue;
            }
            if (topLevelProperty.NameEquals("segments"u8))
            {
                segments = [];
                foreach (JsonElement segmentElement in topLevelProperty.Value.EnumerateArray())
                {
                    segments.Add(TranscriptionSegment.DeserializeTranscriptionSegment(segmentElement, options));
                }
                continue;
            }
        }

        return new AudioTranscription(language, duration, text, words, segments);
    }
}
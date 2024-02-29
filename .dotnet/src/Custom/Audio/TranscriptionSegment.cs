using System;
using System.ClientModel.Primitives;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading;

namespace OpenAI.Audio;

public partial class TranscriptionSegment
{
    public int Id { get; }
    public int SeekOffset { get; }
    public TimeSpan Start { get; }
    public TimeSpan End { get; }
    public string Text { get; }
    public IReadOnlyList<int> TokenIds { get; }
    public float Temperature { get; }
    public float AverageLogProbability { get; }
    public float CompressionRatio { get; }
    public float NoSpeechProbability { get; }

    internal TranscriptionSegment(int id, int seekOffset, TimeSpan start, TimeSpan end, string text, IReadOnlyList<int> tokenIds, float temperature, float averageLogProbability, float compressionRatio, float noSpeechProbability)
    {
        Id = id;
        SeekOffset = seekOffset;
        Start = start;
        End = end;
        Text = text;
        TokenIds = tokenIds;
        Temperature = temperature;
        AverageLogProbability = averageLogProbability;
        CompressionRatio = compressionRatio;
        NoSpeechProbability = noSpeechProbability;
    }

    internal static TranscriptionSegment DeserializeTranscriptionSegment(JsonElement element, ModelReaderWriterOptions options = default)
    {
        int id = 0;
        int seekOffset = 0;
        TimeSpan start = default;
        TimeSpan end = default;
        string text = null;
        List<int> tokenIds = null;
        float temperature = 0;
        float averageLogProbability = 0;
        float compressionRatio = 0;
        float noSpeechProbability = 0;

        foreach (JsonProperty topLevelProperty in element.EnumerateObject())
        {
            if (topLevelProperty.NameEquals("id"u8))
            {
                id = topLevelProperty.Value.GetInt32();
                continue;
            }
            if (topLevelProperty.NameEquals("seek"u8))
            {
                seekOffset = topLevelProperty.Value.GetInt32();
                continue;
            }
            if (topLevelProperty.NameEquals("start"u8))
            {
                start = TimeSpan.FromSeconds(topLevelProperty.Value.GetSingle());
                continue;
            }
            if (topLevelProperty.NameEquals("end"u8))
            {
                end = TimeSpan.FromSeconds(topLevelProperty.Value.GetSingle());
                continue;
            }
            if (topLevelProperty.NameEquals("text"u8))
            {
                text = topLevelProperty.Value.GetString();
                continue;
            }
            if (topLevelProperty.NameEquals("tokens"u8))
            {
                tokenIds = [];
                foreach (JsonElement tokenIdElement in topLevelProperty.Value.EnumerateArray())
                {
                    tokenIds.Add(tokenIdElement.GetInt32());
                }
                continue;
            }
            if (topLevelProperty.NameEquals("temperature"u8))
            {
                temperature = topLevelProperty.Value.GetSingle();
                continue;
            }
            if (topLevelProperty.NameEquals("avg_logprob"u8))
            {
                averageLogProbability = topLevelProperty.Value.GetSingle();
                continue;
            }
            if (topLevelProperty.NameEquals("compression_ratio"u8))
            {
                compressionRatio = topLevelProperty.Value.GetSingle();
                continue;
            }
            if (topLevelProperty.NameEquals("no_speech_prob"u8))
            {
                noSpeechProbability = topLevelProperty.Value.GetSingle();
                continue;
            }
        }

        return new TranscriptionSegment(id, seekOffset, start, end, text, tokenIds, temperature, averageLogProbability, compressionRatio, noSpeechProbability);
    }
}
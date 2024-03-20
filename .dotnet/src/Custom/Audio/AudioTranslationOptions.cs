using OpenAI.Internal;
using System;
using System.IO;

namespace OpenAI.Audio;

public partial class AudioTranslationOptions
{
    public string Prompt { get; set;  }
    public AudioTranscriptionFormat? ResponseFormat { get; set; }
    public float? Temperature { get; set; }

    internal MultipartFormDataBinaryContent ToMultipartContent(Stream fileStream, string fileName, string model)
    {
        MultipartFormDataBinaryContent content = new();

        content.Add(fileStream, "file", fileName);

        AddContent(model, content);

        return content;
    }

    internal MultipartFormDataBinaryContent ToMultipartContent(BinaryData audioBytes, string fileName, string model)
    {
        MultipartFormDataBinaryContent content = new();

        content.Add(audioBytes, "file", fileName);

        AddContent(model, content);

        return content;
    }

    private void AddContent(string model, MultipartFormDataBinaryContent content)
    { 
        content.Add(model, "model");

        if (Prompt is not null)
        {
            content.Add(Prompt, "prompt");
        }

        if (ResponseFormat is not null)
        {
            string value = ResponseFormat switch
            {
                AudioTranscriptionFormat.Simple => "json",
                AudioTranscriptionFormat.Detailed => "verbose_json",
                AudioTranscriptionFormat.Srt => "srt",
                AudioTranscriptionFormat.Vtt => "vtt",
                _ => throw new ArgumentException(nameof(ResponseFormat))
            };

            content.Add(value, "response_format");
        }
    }
}
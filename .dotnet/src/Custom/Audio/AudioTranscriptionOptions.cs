using System;
using System.Collections.Generic;

namespace OpenAI.Audio;

public partial class AudioTranscriptionOptions
{
    public string Language { get; set; }
    public string Prompt { get; set;  }
    public AudioTranscriptionFormat? ResponseFormat { get; set; }
    public float? Temperature { get; set; }
    public bool? EnableWordTimestamps { get; set; }
    public bool? EnableSegmentTimestamps { get; set; }
}
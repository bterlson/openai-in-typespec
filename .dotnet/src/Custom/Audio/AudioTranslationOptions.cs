using System;
using System.Collections.Generic;

namespace OpenAI.Audio;

public partial class AudioTranslationOptions
{
    public string Prompt { get; set;  }
    public AudioTranscriptionFormat? ResponseFormat { get; set; }
    public float? Temperature { get; set; }
}
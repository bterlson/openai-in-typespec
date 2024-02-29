namespace OpenAI.Audio;

/// <summary>
/// A representation of additional options available to control the behavior of a text-to-speech audio generation
/// operation.
/// </summary>
public partial class TextToSpeechOptions
{
    /// <summary>
    /// The desired format of the generated text-to-speech audio. If not specified, a default value of <c>mp3</c> will
    /// be used.
    /// <para>
    /// Supported output formats include:
    /// <list type="bullet">
    /// <item><c>mp3</c> - <see cref="AudioDataFormat.Mp3"/></item>
    /// <item><c>opus</c> - <see cref="AudioDataFormat.Opus"/></item>
    /// <item><c>aac</c> - <see cref="AudioDataFormat.Aac"/></item>
    /// <item><c>flac</c> - <see cref="AudioDataFormat.Flac"/></item>
    /// </list>
    /// </para>
    /// </summary>
    public AudioDataFormat? ResponseFormat { get; set; }

    /// <summary>
    /// A multiplicative <c>speed</c> factor to apply to the generated audio, with 1.0 being the default and valid
    /// values ranging from 0.25 to 4.0.
    /// </summary>
    public float? SpeedMultiplier { get; set; }
}
namespace OpenAI.Audio;

/// <summary>
/// Represents an audio data format available as either input or output into an audio operation.
/// </summary>
public enum AudioDataFormat
{
    /// <summary>
    /// MP3, an all-purpose audio compression format with a moderate tradeoff of quality for data size.
    /// <para>
    /// <c>mp3</c> is supported for input into translation and transcription as well as for output from text-to-speech.
    /// </para>
    /// </summary>
    Mp3,
    /// <summary>
    /// AAC, an alternative all-purpose format to MP3 preferred by YouTube, Android, and iOS.
    /// <para>
    /// <c>aac</c> is supported for input into translation and transcription as well as for output from text-to-speech.
    /// </para>
    /// </summary>
    Aac,
    /// <summary>
    /// OGG, a balanced, open-source, general use format favored by Spotify.
    /// <para>
    /// <c>ogg</c> is supported as input into translation and transcription but is <b>not</b> available for
    /// text-to-speech output.
    /// </para>
    /// </summary>
    Ogg,
    /// <summary>
    /// FLAC, a high-quality, lossless compression format preferred for audio archival and enthusiast use.
    /// <para>
    /// <c>flac</c> is supported for input into translation and transcription as well as for output from text-to-speech.
    /// </para>
    /// </summary>
    Flac,
    /// <summary>
    /// MP4, a multimedia container format that generally features bigger sizes and higher quality relative to MP3.
    /// <para>
    /// <c>mp4</c> is supported as input into translation and transcription but is <b>not</b> available for
    /// text-to-speech output.
    /// </para>
    /// </summary>
    Mp4,
    /// <summary>
    /// MPEG, a multimedia container format that can contain any of several different underlying audio formats.
    /// <para>
    /// <c>mpeg</c> is supported as input into translation and transcription but is <b>not</b> available for
    /// text-to-speech output.
    /// </para>
    /// </summary>
    Mpeg,
    /// <summary>
    /// MPGA, effectively an alias for MP3.
    /// <para>
    /// <c>mpga</c> is supported as input into translation and transcription but is <b>not</b> available for
    /// text-to-speech output.
    /// </para>
    /// </summary>
    Mpga,
    /// <summary>
    /// M4A, the audio-only counterpart to MP4 that generally features larger data sizes and higher quality than MP3.
    /// <para>
    /// <c>m4a</c> is supported as input into translation and transcription but is <b>not</b> available for
    /// text-to-speech output.
    /// </para>
    /// </summary>
    M4a,
    /// <summary>
    /// Opus, a higher-quality compression format that features integrated optimizations for speech.
    /// <para>
    /// <c>opus</c> is supported for input into translation and transcription as well as for output from text-to-speech.
    /// </para>
    /// </summary>
    Opus,
    /// <summary>
    /// WAV, an uncompressed, lossless format with maximum quality, highest file size, and minimal decoding.
    /// <para>
    /// <c>wav</c> is supported as input into translation and transcription but is <b>not</b> available for
    /// text-to-speech output.
    /// </para>
    /// </summary>
    Wav,
    /// <summary>
    /// WebM, a multimedia container that generally uses Opus or OGG audio.
    /// <para>
    /// <c>webm</c> is supported as input into translation and transcription but is <b>not</b> available for
    /// text-to-speech output.
    /// </para>
    /// </summary>
    Webm,
}
using System;

namespace OpenAI.Audio;

/// <summary>
/// Represents the available text-to-speech voices.
/// </summary>
public readonly struct TextToSpeechVoice : IEquatable<TextToSpeechVoice>
{
    private readonly Internal.Models.CreateSpeechRequestVoice _internalVoice;

    /// <summary>
    /// Creates a new instance of <see cref="TextToSpeechVoice"/>.
    /// </summary>
    /// <param name="value"> The textual representation of the value to use. </param>
    public TextToSpeechVoice(string value)
        : this(new Internal.Models.CreateSpeechRequestVoice(value))
    { }

    internal TextToSpeechVoice(Internal.Models.CreateSpeechRequestVoice internalVoice)
    {
        _internalVoice = internalVoice;
    }

    /// <summary>
    /// The <c>onyx</c> voice.
    /// </summary>
    public static TextToSpeechVoice Onyx { get; } = new TextToSpeechVoice(Internal.Models.CreateSpeechRequestVoice.Onyx);
    /// <summary>
    /// The <c>shimmer</c> voice.
    /// </summary>
    public static TextToSpeechVoice Shimmer { get; } = new TextToSpeechVoice(Internal.Models.CreateSpeechRequestVoice.Shimmer);
    /// <summary>
    /// The <c>alloy</c> voice.
    /// </summary>
    public static TextToSpeechVoice Alloy { get; } = new TextToSpeechVoice(Internal.Models.CreateSpeechRequestVoice.Alloy);
    /// <summary>
    /// The <c>fable</c> voice.
    /// </summary>
    public static TextToSpeechVoice Fable { get; } = new TextToSpeechVoice(Internal.Models.CreateSpeechRequestVoice.Fable);
    /// <summary>
    /// The <c>echo</c> voice.
    /// </summary>
    public static TextToSpeechVoice Echo { get; } = new TextToSpeechVoice(Internal.Models.CreateSpeechRequestVoice.Echo);

    /// <inheritdoc/>
    public static bool operator ==(TextToSpeechVoice left, TextToSpeechVoice right)
        => left._internalVoice == right._internalVoice;
    /// <inheritdoc/>
    public static implicit operator TextToSpeechVoice(string value)
        => new TextToSpeechVoice(new Internal.Models.CreateSpeechRequestVoice(value));
    /// <inheritdoc/>
    public static bool operator !=(TextToSpeechVoice left, TextToSpeechVoice right)
        => left._internalVoice != right._internalVoice;
    /// <inheritdoc/>
    public bool Equals(TextToSpeechVoice other) => _internalVoice.Equals(other._internalVoice);
    /// <inheritdoc/>
    public override string ToString() => _internalVoice.ToString();
    /// <inheritdoc/>
    public override bool Equals(object obj) =>
        (obj is TextToSpeechVoice voice && this.Equals(voice)) || _internalVoice.Equals(obj);
    /// <inheritdoc/>
    public override int GetHashCode() => _internalVoice.GetHashCode();
}
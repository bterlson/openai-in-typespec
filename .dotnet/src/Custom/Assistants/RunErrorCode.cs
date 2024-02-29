using System;
using System.ComponentModel;

namespace OpenAI.Assistants;

public readonly struct RunErrorCode : IEquatable<RunErrorCode>
{
    private readonly string _value;

    public static RunErrorCode ServerError { get; } = new(Internal.Models.RunObjectLastErrorCode.ServerError.ToString());
    public static RunErrorCode RateLimitExceeded { get; } = new(Internal.Models.RunObjectLastErrorCode.RateLimitExceeded.ToString());
    public static RunErrorCode InvalidPrompt { get; } = new("invalid_prompt");

    public RunErrorCode(string status)
    {
        _value = status;
    }

    /// <summary> Determines if two <see cref="RunErrorCode"/> values are the same. </summary>
    public static bool operator ==(RunErrorCode left, RunErrorCode right) => left.Equals(right);
    /// <summary> Determines if two <see cref="RunErrorCode"/> values are not the same. </summary>
    public static bool operator !=(RunErrorCode left, RunErrorCode right) => !left.Equals(right);
    /// <summary> Converts a string to a <see cref="RunErrorCode"/>. </summary>
    public static implicit operator RunErrorCode(string value) => new RunErrorCode(value);

    /// <inheritdoc />
    [EditorBrowsable(EditorBrowsableState.Never)]
    public override bool Equals(object obj) => obj is RunErrorCode other && Equals(other);
    /// <inheritdoc />
    public bool Equals(RunErrorCode other) => string.Equals(_value, other._value, StringComparison.InvariantCultureIgnoreCase);

    /// <inheritdoc />
    [EditorBrowsable(EditorBrowsableState.Never)]
    public override int GetHashCode() => _value?.GetHashCode() ?? 0;
    /// <inheritdoc />
    public override string ToString() => _value;
}
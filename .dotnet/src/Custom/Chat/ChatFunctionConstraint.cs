using System;

namespace OpenAI.Chat;

/// <summary>
/// Represents a desired manner in which the model should use the functions defined in a chat completion request.
/// </summary>
public readonly partial struct ChatFunctionConstraint : IEquatable<ChatFunctionConstraint>
{
    private readonly string _value;
    private readonly bool _isPredefined;

    /// <summary>
    /// <c>auto</c> specifies that the model should freely call any or none of the provided functions.
    /// This is the implied default when not otherwise specified.
    /// </summary>
    public static ChatFunctionConstraint Auto { get; } = new("auto", isPredefined: true);
    /// <summary>
    /// <c>none</c> specifies that the model should not call any of the provided functions. Note that the definition
    /// of the functions may still influence the chat completion content even when not called.
    /// </summary>
    public static ChatFunctionConstraint None { get; } = new("none", isPredefined: true);

    /// <summary>
    /// Creates a new instance of <see cref="ChatFunctionConstraint"/> that specifies that the model should invoke a
    /// specific, named function.
    /// </summary>
    /// <param name="functionName"> The name of the function that the model should call. </param>
    public ChatFunctionConstraint(string functionName)
    : this(functionName, isPredefined: false)
    {
    }

    internal ChatFunctionConstraint(string functionNameOrPredefinedLabel, bool isPredefined)
    {
        _value = functionNameOrPredefinedLabel;
        _isPredefined = isPredefined;
    }

    /// <inheritdoc/>
    public static bool operator ==(ChatFunctionConstraint left, ChatFunctionConstraint right)
        => left._isPredefined == right._isPredefined && left._value == right._value;
    /// <inheritdoc/>
    public static implicit operator ChatFunctionConstraint(string value) => new(value);
    /// <inheritdoc/>
    public static bool operator !=(ChatFunctionConstraint left, ChatFunctionConstraint right)
        => left._isPredefined != right._isPredefined || left._value != right._value;
    /// <inheritdoc/>
    public bool Equals(ChatFunctionConstraint other)
        => other._isPredefined.Equals(_isPredefined) && other._value.Equals(_value);
    /// <inheritdoc/>
    public override string ToString() => ToBinaryData().ToString();
    /// <inheritdoc/>
    public override bool Equals(object obj)
        => obj is ChatFunctionConstraint constraint && constraint.Equals(this);
    /// <inheritdoc/>
    public override int GetHashCode() => $"{_value}-{_isPredefined}".GetHashCode();

    internal BinaryData ToBinaryData()
    {
        if (_isPredefined)
        {
            return BinaryData.FromString(_value);
        }
        else
        {
            return BinaryData.FromObjectAsJson(new
            {
                name = _value,
            });
        }
    }
}
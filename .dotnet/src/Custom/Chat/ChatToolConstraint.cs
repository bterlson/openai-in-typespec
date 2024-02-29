using System;

namespace OpenAI.Chat;

/// <summary>
/// Represents <c>tool_choice</c>, the desired manner in which the model should use the <c>tools</c> defined in a
/// chat completion request.
/// </summary>
public readonly struct ChatToolConstraint : IEquatable<ChatToolConstraint>
{
    private enum ToolConstraintKind
    {
        Predefined,
        Function,
    }

    private readonly ToolConstraintKind _constraintKind;
    private readonly BinaryData _serializableData;

    /// <summary>
    /// Creates a new instance of <see cref="ChatToolConstraint"/> which requests that the model restricts its behavior
    /// to calling the specified tool.
    /// </summary>
    /// <param name="toolDefinition"> The definition of the tool that the model should call. </param>
    /// <remarks>
    ///     <c>tool_choice</c> uses the <c>name</c> of a tool of the <c>function</c> type as the correlation field, so
    ///     instantiating a new instance of <see cref="ChatFunctionToolDefinition"/> with the desired name is
    ///     sufficient if the matching <see cref="ChatToolDefinition"/> instance is not available.
    /// </remarks>
    public ChatToolConstraint(ChatToolDefinition toolDefinition)
    {
        if (toolDefinition is ChatFunctionToolDefinition functionToolDefinition)
        {
            _constraintKind = ToolConstraintKind.Function;
            _serializableData = BinaryData.FromObjectAsJson(new
            {
                type = "function",
                function = new
                {
                    name = functionToolDefinition.Name,
                }
            });
        }
        else
        {
            throw new ArgumentException(
                $"Unsupported {nameof(toolDefinition)} type for 'tool_choice' constraint: {toolDefinition.GetType()}");
        }
    }

    internal ChatToolConstraint(string predefinedLabel)
    {
        _constraintKind = ToolConstraintKind.Predefined;
        _serializableData = BinaryData.FromString($@"""{predefinedLabel}""");
    }

    /// <summary>
    /// <c>auto</c> specifies that the model should freely call any combination of the provided <c>tools</c>, including
    /// the option to not invoke any tools and issue an ordinary response.
    /// </summary>
    public static ChatToolConstraint Auto { get; } = new("auto");
    /// <summary>
    /// <c>none</c> specifies that the model should not invoke any of the provided <c>tools</c> and instead force an
    /// ordinary <c>assistant</c> response. Note that provided tool definitions may still influence the behavior of
    /// chat completions even when tools are not called.
    /// </summary>
    public static ChatToolConstraint None { get; } = new("none");
    /// <inheritdoc/>
    public static bool operator ==(ChatToolConstraint left, ChatToolConstraint right)
        => left._serializableData?.ToString() == right._serializableData?.ToString();
    /// <inheritdoc/>
    public static bool operator !=(ChatToolConstraint left, ChatToolConstraint right)
        => left._serializableData?.ToString() != right._serializableData?.ToString();
    /// <inheritdoc/>
    public bool Equals(ChatToolConstraint other)
        => (_serializableData == null && other._serializableData == null)
            || (_serializableData.ToString().Equals(other._serializableData.ToString()));
    /// <inheritdoc/>
    public override string ToString() => _serializableData?.ToString();
    /// <inheritdoc/>
    public override bool Equals(object obj)
        => obj is ChatToolConstraint constraint && constraint.Equals(this);
    /// <inheritdoc/>
    public override int GetHashCode() => $"{_serializableData?.ToString()}".GetHashCode();

    internal BinaryData GetBinaryData() => _serializableData;
}

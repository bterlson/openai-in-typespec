using System.Diagnostics.CodeAnalysis;

namespace OpenAI.Chat;

/// <summary>
/// Represents an <c>assistant</c> call against a supplied <see cref="ChatFunctionDefinition"/> that is needed by the
/// model to continue the logical conversation.
/// </summary>
/// <remarks>
/// <para>
///     Note that <c>functions</c> are deprecated in favor of <c>tools</c> and using <see cref="ChatToolDefinition"/>
///     instances with <see cref="ChatCompletionOptions.Tools"/> will enable the use of <c>tool_calls</c> via
///     <see cref="ChatCompletion.ToolCalls"/> instead of this type.
/// </para>
/// <para>
///     The model makes a <c>function_call</c> in response to evaluation of supplied <c>name></c> and
///     <c>description</c> information in <c>functions</c> and is resolved by providing a new
///     <see cref="ChatRequestFunctionMessage"/> with matching functioning output on a subsequent chat completion
///     request.
/// </para>
/// </remarks>
public partial class ChatFunctionCall
{
    /// <summary>
    /// The name of the function being called by the model.
    /// </summary>
    public required string Name { get; set; }
    /// <summary>
    /// The arguments to the function being called by the model.
    /// </summary>
    public required string Arguments { get; set; }
    /// <summary>
    /// Creates a new instance of <see cref="ChatFunctionCall"/>.
    /// </summary>
    public ChatFunctionCall() { }
    /// <summary>
    /// Creates a new instance of <see cref="ChatFunctionCall"/>.
    /// </summary>
    /// <param name="functionName"> The name of the function that was called by the model. </param>
    /// <param name="arguments"> The arguments to the function that was called by the model. </param>
    [SetsRequiredMembers]
    public ChatFunctionCall(string functionName, string arguments)
    {
        Name = functionName;
        Arguments = arguments;
    }
}

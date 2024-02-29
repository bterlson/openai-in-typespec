namespace OpenAI.Chat;

/// <summary>
/// A base representation of a tool supplied to a chat completion request. Tools inform the model about additional,
/// caller-provided behaviors that can be invoked to provide prompt enrichment or custom actions.
/// </summary>
/// <remarks>
/// Chat completion currently supports <c>function</c> tools via <see cref="ChatFunctionToolDefinition"/>.
/// </remarks>
public abstract class ChatToolDefinition
{ }

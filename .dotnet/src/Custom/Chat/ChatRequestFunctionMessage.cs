using System.ClientModel;
using System.ClientModel.Primitives;
using System.Text.Json;

namespace OpenAI.Chat;

/// <summary>
/// Represents a chat message of the <c>function</c> role as provided to a chat completion request. A function message
/// resolves a prior <c>function_call</c> received from the model and correlates to both a supplied
/// <see cref="ChatFunctionDefinition"/> instance as well as a <see cref="ChatFunctionCall"/> made by the model on an
/// <c>assistant</c> response message.
/// </summary>
public class ChatRequestFunctionMessage : ChatRequestMessage
{
    /// <summary>
    /// The <c>name</c> of the called function that this message provides information from.
    /// </summary>
    public string FunctionName { get; set; } // JSON "name"

    /// <summary>
    /// Creates a new instance of <see cref="ChatRequestFunctionMessage"/>.
    /// </summary>
    /// <param name="functionName">
    ///     The name of the called function that this message provides information from.
    /// </param>
    /// <param name="content">
    ///     The textual content that represents the output or result from the called function. There is no format
    ///     restriction (e.g. JSON) imposed on this content.
    /// </param>
    public ChatRequestFunctionMessage(string functionName, string content)
        : base(ChatRole.Function, content)
    {
        FunctionName = functionName;
    }

    internal override void WriteDerivedAdditions(Utf8JsonWriter writer, ModelReaderWriterOptions options)
    {
        writer.WriteString("name"u8, FunctionName);
    }
}

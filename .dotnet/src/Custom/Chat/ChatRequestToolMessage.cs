using System;
using System.ClientModel.Internal;

using System.ClientModel;
using System.ClientModel.Primitives;
using System.Text.Json;

namespace OpenAI.Chat;

/// <summary>
/// Represents a chat message of the <c>tool</c> role as supplied to a chat completion request. A tool message
/// encapsulates a resolution of a <see cref="ChatToolCall"/> made by the model. The typical interaction flow featuring
/// tool messages is:
/// <list type="number">
/// <item> A <see cref="ChatRequestUserMessage"/> provides a <see cref="ChatToolDefinition"/> on a request; </item>
/// <item>
///     Based on the <c>name</c> and <c>description</c> information of provided tools, the model responds with one or
///     more <see cref="ChatToolCall"/> instances that need to be resolved to continue the logical conversation;
/// </item>
/// <item>
///     For each <see cref="ChatToolCall"/>, the matching tool is invoked and its output is supplied back to the model
///     via a <see cref="ChatRequestToolMessage"/> to resolve the tool call and allow the logical conversation to
///     continue.
/// </item>
/// </list>
/// </summary>
public class ChatRequestToolMessage : ChatRequestMessage
{
    /// <summary>
    /// The <c>id</c> correlating to the prior <see cref="ChatToolCall"/> made by the model.
    /// </summary>
    public string ToolCallId { get; set; }

    /// <summary>
    /// Creates a new instance of <see cref="ChatRequestToolMessage"/>.
    /// </summary>
    /// <param name="toolCallId"> The <c>id</c> correlating to a <see cref="ChatToolCall"/> made by the model. </param>
    /// <param name="content">
    ///     The textual content, produced by the defined tool in response to the correlated <see cref="ChatToolCall"/>,
    ///     that resolves the tool call and allows the logical conversation to continue. No format restrictions (e.g.
    ///     JSON) are imposed on the content emitted by tools.
    /// </param>
    public ChatRequestToolMessage(string toolCallId, string content)
        : base(ChatRole.Tool, content)
    {
        ToolCallId = toolCallId;
    }

    internal override void WriteDerivedAdditions(Utf8JsonWriter writer, ModelReaderWriterOptions options)
    {
        writer.WriteString("tool_call_id"u8, ToolCallId);
    }
}

namespace OpenAI.Chat;
using System.Text.Json;

/// <summary>
/// A base representation of an incremental update to a streaming tool call that is part of a streaming chat completion
/// request.
/// </summary>
/// <remarks>
/// <para>
/// This type encapsulates the payload located in e.g. <c>$.choices[0].delta.tool_calls[]</c> in the REST API schema.
/// </para>
/// <para>
/// To differentiate between parallel streaming tool calls within a single streaming choice, use the value of the
/// <see cref="ToolCallIndex"/> property.
/// </para>
/// <para>
/// <see cref="StreamingToolCallUpdate"/> is the streaming, base class counterpart to <see cref="ChatToolCall"/>.
/// Currently, chat completion supports <c>function</c> tools and the derived
/// <see cref="StreamingFunctionToolCallUpdate"/> type will provide required information about the matching function
/// tool call.
/// </para>
/// </remarks>
public abstract partial class StreamingToolCallUpdate
{
    /// <summary>
    /// Gets the ID associated with with the streaming tool call.
    /// </summary>
    /// <remarks>
    /// <para>
    /// Corresponds to e.g. <c>$.choices[0].delta.tool_calls[0].id</c> in the REST API schema.
    /// </para>
    /// <para>
    /// This value appears once for each streaming tool call, typically on the first update message for each
    /// <see cref="ToolCallIndex"/>. Callers should retain the value when it arrives to accumulate the complete tool
    /// call information.
    /// </para>
    /// <para>
    /// Tool call IDs must be provided in <see cref="ChatRequestToolMessage"/> instances that respond to tool calls.
    /// </para>
    /// </remarks>
    public string Id { get; }

    /// <summary>
    /// Gets the tool call index associated with this <see cref="StreamingToolCallUpdate"/>.
    /// </summary>
    /// <remarks>
    /// <para>
    /// Corresponds to e.g. <c>$.choices[0].delta.tool_calls[0].index</c> in the REST API schema.
    /// </para>
    /// <para>
    /// This value appears on every streaming tool call update. When multiple tool calls occur within the same
    /// streaming chat choice, this index specifies which tool call that this update contains new information for.
    /// </para>
    /// </remarks>
    public int ToolCallIndex { get; }

    internal string Type { get; }

    internal StreamingToolCallUpdate(string type, string id, int toolCallIndex)
    {
        Type = type;
        Id = id;
        ToolCallIndex = toolCallIndex;
    }

    internal static StreamingToolCallUpdate DeserializeStreamingToolCallUpdate(JsonElement element)
    {
        if (element.ValueKind == JsonValueKind.Null)
        {
            return null;
        }
        foreach (JsonProperty property in element.EnumerateObject())
        {
            // CUSTOM CODE NOTE:
            //   "type" is superficially the JSON discriminator for possible tool call categories, but it does not
            //   appear on every streamed delta message. To account for this without maintaining state, we instead
            //   allow the deserialization to infer the type based on the presence of the named/typed key. This is
            //   consistent across all existing patterns of the form:
            //   {
            //     "type": "<foo>"
            //     "<foo>": { ... }
            //   }
            if (property.NameEquals("type"u8))
            {
                if (property.Value.GetString() == "function")
                {
                    return StreamingFunctionToolCallUpdate.DeserializeStreamingFunctionToolCallUpdate(element);
                }
            }
            else if (property.NameEquals("function"u8))
            {
                return StreamingFunctionToolCallUpdate.DeserializeStreamingFunctionToolCallUpdate(element);
            }
        }
        return null;
    }
}

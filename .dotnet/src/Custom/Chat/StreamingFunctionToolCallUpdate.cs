namespace OpenAI.Chat;
using System.Text.Json;

/// <summary>
/// Represents an incremental update to a streaming function tool call that is part of a streaming chat completions
/// choice.
/// </summary>
public partial class StreamingFunctionToolCallUpdate : StreamingToolCallUpdate
{
    /// <summary>
    /// The name of the function requested by the tool call.
    /// </summary>
    /// <remarks>
    /// <para>
    /// Corresponds to e.g. <c>$.choices[0].delta.tool_calls[0].function.name</c> in the REST API schema.
    /// </para>
    /// <para>
    /// For a streaming function tool call, this name will appear in a single streaming update payload, typically the
    /// first. Use the <see cref="StreamingToolCallUpdate.ToolCallIndex"/> property to differentiate between multiple,
    /// parallel tool calls when streaming.
    /// </para>
    /// </remarks>
    public string Name { get; }

    /// <summary>
    /// The next new segment of the function arguments for the function tool called by a streaming tool call.
    /// These must be accumulated for the complete contents of the function arguments.
    /// </summary>
    /// <remarks>
    /// <para>
    /// Corresponds to e.g. <c>$.choices[0].delta.tool_calls[0].function.arguments</c> in the REST API schema.
    /// </para>
    /// Note that the model does not always generate valid JSON and may hallucinate parameters
    /// not defined by your function schema. Validate the arguments in your code before calling
    /// your function.
    /// </remarks>
    public string ArgumentsUpdate { get; }

    internal StreamingFunctionToolCallUpdate(
        string id,
        int toolCallIndex,
        string functionName,
        string functionArgumentsUpdate)
        : base("function", id, toolCallIndex)
    {
        Name = functionName;
        ArgumentsUpdate = functionArgumentsUpdate;
    }

    internal static StreamingFunctionToolCallUpdate DeserializeStreamingFunctionToolCallUpdate(JsonElement element)
    {
        if (element.ValueKind == JsonValueKind.Null)
        {
            return null;
        }

        string id = null;
        int toolCallIndex = 0;
        string functionName = null;
        string functionArgumentsUpdate = null;

        foreach (JsonProperty property in element.EnumerateObject())
        {
            if (property.NameEquals("id"u8))
            {
                id = property.Value.GetString();
            }
            if (property.NameEquals("index"u8))
            {
                toolCallIndex = property.Value.GetInt32();
            }
            if (property.NameEquals("function"u8))
            {
                foreach (JsonProperty functionProperty in property.Value.EnumerateObject())
                {
                    if (functionProperty.NameEquals("name"u8))
                    {
                        functionName = functionProperty.Value.GetString();
                    }
                    if (functionProperty.NameEquals("arguments"u8))
                    {
                        functionArgumentsUpdate = functionProperty.Value.GetString();
                    }
                }
            }
        }

        return new StreamingFunctionToolCallUpdate(id, toolCallIndex, functionName, functionArgumentsUpdate);
    }
}

using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

namespace OpenAI.Assistants;

public partial class ToolOutput
{
    [JsonPropertyName("tool_call_id")]
    public required string Id { get; set; }
    [JsonPropertyName("output")]
    public string Output { get; set; }

    public ToolOutput()
    { }

    [SetsRequiredMembers]
    public ToolOutput(string toolCallId, string output = null)
    {
        Id = toolCallId;
        Output = output;
    }

    [SetsRequiredMembers]
    public ToolOutput(RequiredToolCall toolCall, string output = null)
        : this(toolCall.Id, output)
    { }
}

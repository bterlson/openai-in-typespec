using System.ClientModel;
using System.ClientModel.Primitives;
using System.Text.Json;

namespace OpenAI.Assistants;

public partial class RetrievalToolDefinition : ToolDefinition
{
    public RetrievalToolDefinition()
    { }

    internal static RetrievalToolDefinition DeserializeRetrievalToolDefinition(
        JsonElement element,
        ModelReaderWriterOptions options = null)
    {
        options ??= new ModelReaderWriterOptions("W");

        if (element.ValueKind == JsonValueKind.Null)
        {
            return null;
        }

        foreach (var property in element.EnumerateObject())
        {
            if (property.NameEquals("retrieval"u8))
            {
                continue;
            }
        }

        return new RetrievalToolDefinition();
    }

    internal override void WriteDerived(Utf8JsonWriter writer, ModelReaderWriterOptions options)
    {
        writer.WriteString("type"u8, "retrieval"u8);
    }
}

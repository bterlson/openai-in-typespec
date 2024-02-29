using System.ClientModel;
using System.ClientModel.Primitives;
using System.Text.Json;

namespace OpenAI.Assistants;

public partial class CodeInterpreterToolDefinition : ToolDefinition
{
    public CodeInterpreterToolDefinition()
    { }

    internal static CodeInterpreterToolDefinition DeserializeCodeInterpreterToolDefinition(
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
            if (property.NameEquals("code_interpreter"u8))
            {
                continue;
            }
        }

        return new CodeInterpreterToolDefinition();
    }

    internal override void WriteDerived(Utf8JsonWriter writer, ModelReaderWriterOptions options)
    {
        writer.WriteString("type"u8, "code_interpreter"u8);
    }
}

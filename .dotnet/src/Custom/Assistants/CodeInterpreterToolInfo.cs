using System.ClientModel;
using System.ClientModel.Primitives;
using System.Text.Json;

namespace OpenAI.Assistants;

public partial class CodeInterpreterToolInfo : ToolInfo
{
    internal CodeInterpreterToolInfo()
    { }

    internal static CodeInterpreterToolInfo DeserializeCodeInterpreterToolInfo(
        JsonElement element,
        ModelReaderWriterOptions options)
    {
        options ??= new ModelReaderWriterOptions("W");

        if (element.ValueKind == JsonValueKind.Null)
        {
            return null;
        }

        foreach (var property in element.EnumerateObject())
        {
        }
        return new CodeInterpreterToolInfo();
    }

    internal override void WriteDerived(Utf8JsonWriter writer, ModelReaderWriterOptions options)
    {
        writer.WriteString("type"u8, "code_interpreter"u8);
    }
}

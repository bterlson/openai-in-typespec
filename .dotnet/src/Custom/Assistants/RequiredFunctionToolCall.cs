using System.ClientModel;
using System.ClientModel.Primitives;
using System.Text.Json;

namespace OpenAI.Assistants;

public partial class RequiredFunctionToolCall : RequiredToolCall
{
    public string Name { get; }
    public string Arguments { get; }

    internal RequiredFunctionToolCall(string id, string name, string arguments)
        : base(id)
    {
        Name = name;
        Arguments = arguments;
    }

    internal static RequiredFunctionToolCall DeserializeRequiredFunctionToolCall(
        JsonElement element,
        ModelReaderWriterOptions options)
    {
        options ??= new ModelReaderWriterOptions("W");

        if (element.ValueKind == JsonValueKind.Null)
        {
            return null;
        }

        string id = null;
        string name = null;
        string arguments = null;

        foreach (var property in element.EnumerateObject())
        {
            if (property.NameEquals("function"u8))
            {
                foreach (var functionProperty in property.Value.EnumerateObject())
                {
                    if (functionProperty.NameEquals("name"u8))
                    {
                        name = functionProperty.Value.GetString();
                        continue;
                    }
                    if (functionProperty.NameEquals("arguments"u8))
                    {
                        arguments = functionProperty.Value.GetString();
                        continue;
                    }
                }
                continue;
            }
            if (property.NameEquals("id"u8))
            {
                id = property.Value.GetString();
                continue;
            }
        }
        return new RequiredFunctionToolCall(id, name, arguments);
    }

    internal override void WriteDerived(Utf8JsonWriter writer, ModelReaderWriterOptions options)
    {
        writer.WriteString("type"u8, "retrieval"u8);
    }
}

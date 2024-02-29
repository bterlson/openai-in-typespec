using System;
using System.ClientModel.Internal;

using System.ClientModel;
using System.ClientModel.Primitives;
using System.Text.Json;
using OpenAI.ClientShared.Internal;

namespace OpenAI.Assistants;

public partial class FunctionToolInfo : ToolInfo
{
    public string Name { get; }
    public string Description { get; }
    public BinaryData Parameters { get; }

    internal FunctionToolInfo(string name, string description, BinaryData parameters)
    {
        Name = name;
        Description = description;
        Parameters = parameters;
    }

    internal static FunctionToolInfo DeserializeFunctionToolInfo(
        JsonElement element,
        ModelReaderWriterOptions options)
    {
        options ??= new ModelReaderWriterOptions("W");

        if (element.ValueKind == JsonValueKind.Null)
        {
            return null;
        }

        string name = null;
        string description = null;
        BinaryData parameters = null;

        foreach (var property in element.EnumerateObject())
        {
            if (property.NameEquals("function"u8))
            {
                foreach (var functionObjectProperty in property.Value.EnumerateObject())
                {
                    if (functionObjectProperty.NameEquals("name"u8))
                    {
                        name = functionObjectProperty.Value.GetString();
                        continue;
                    }
                    if (functionObjectProperty.NameEquals("description"u8))
                    {
                        description = functionObjectProperty.Value.GetString();
                        continue;
                    }
                    if (functionObjectProperty.NameEquals("parameters"u8))
                    {
                        parameters = BinaryData.FromObjectAsJson(functionObjectProperty.Value.GetRawText());
                        continue;
                    }
                }
            }
        }
        return new FunctionToolInfo(name, description, parameters);
    }

    internal override void WriteDerived(Utf8JsonWriter writer, ModelReaderWriterOptions options)
    {
        writer.WriteString("type"u8, "function"u8);
        writer.WritePropertyName("function"u8);
        writer.WriteStartObject();
        writer.WriteString("name"u8, Name);
        if (OptionalProperty.IsDefined(Description))
        {
            writer.WriteString("description"u8, Description);
        }
        if (OptionalProperty.IsDefined(Parameters))
        {
            writer.WriteRawValue(Parameters.ToString());
        }
        writer.WriteEndObject();
    }
}

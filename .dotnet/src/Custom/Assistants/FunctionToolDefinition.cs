using System;
using System.ClientModel.Internal;

using System.ClientModel;
using System.ClientModel.Primitives;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json;
using OpenAI.ClientShared.Internal;

namespace OpenAI.Assistants;

public partial class FunctionToolDefinition : ToolDefinition
{
    public required string Name { get; set; }
    public string Description { get; set; }
    public BinaryData Parameters { get; set; }

    [SetsRequiredMembers]
    public FunctionToolDefinition(string name, string description = null, BinaryData parameters = null)
    {
        Name = name;
        Description = description;
        Parameters = parameters;
    }

    public FunctionToolDefinition()
    { }

    internal static FunctionToolDefinition DeserializeFunctionToolDefinition(
        JsonElement element,
        ModelReaderWriterOptions options = null)
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
                foreach (var functionProperty in property.Value.EnumerateObject())
                {
                    if (functionProperty.NameEquals("name"u8))
                    {
                        name = functionProperty.Value.GetString();
                        continue;
                    }
                    if (functionProperty.NameEquals("description"u8))
                    {
                        description = functionProperty.Value.GetString();
                        continue;
                    }
                    if (functionProperty.NameEquals("parameters"))
                    {
                        parameters = BinaryData.FromObjectAsJson(functionProperty.Value.GetRawText());
                        continue;
                    }
                }
            }
        }

        return new FunctionToolDefinition(name, description, parameters);
    }

    internal override void WriteDerived(Utf8JsonWriter writer, ModelReaderWriterOptions options)
    {
        writer.WriteString("type"u8, "function"u8);
        writer.WritePropertyName("function"u8);
        writer.WriteStartObject();
        writer.WriteString("name"u8, Name);
        if (Optional.IsDefined(Description))
        {
            writer.WriteString("description"u8, Description);
        }
        if (Optional.IsDefined(Parameters))
        {
            writer.WritePropertyName("parameters"u8);
            writer.WriteRawValue(Parameters.ToString());
        }
        writer.WriteEndObject();
    }
}

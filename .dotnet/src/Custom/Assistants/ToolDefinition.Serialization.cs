using System;
using System.ClientModel.Internal;

using System.ClientModel;
using System.ClientModel.Primitives;
using System.Text.Json;

namespace OpenAI.Assistants;

public abstract partial class ToolDefinition :  IJsonModel<ToolDefinition>
{
    ToolDefinition IJsonModel<ToolDefinition>.Create(ref Utf8JsonReader reader, ModelReaderWriterOptions options)
    {
        var format = options.Format == "W" ? ((IPersistableModel<ToolDefinition>)this).GetFormatFromOptions(options) : options.Format;
        if (format != "J")
        {
            throw new FormatException($"The model {nameof(ToolDefinition)} does not support '{format}' format.");
        }
        using JsonDocument document = JsonDocument.ParseValue(ref reader);
        return DeserializeToolDefinition(document.RootElement, options);
    }

    ToolDefinition IPersistableModel<ToolDefinition>.Create(BinaryData data, ModelReaderWriterOptions options)
    {
        var format = options.Format == "W" ? ((IPersistableModel<ToolDefinition>)this).GetFormatFromOptions(options) : options.Format;

        switch (format)
        {
            case "J":
                {
                    using JsonDocument document = JsonDocument.Parse(data);
                    return DeserializeToolDefinition(document.RootElement, options);
                }
            default:
                throw new FormatException($"The model {nameof(ToolDefinition)} does not support '{options.Format}' format.");
        }
    }

    string IPersistableModel<ToolDefinition>.GetFormatFromOptions(ModelReaderWriterOptions options) => "J";

    void IJsonModel<ToolDefinition>.Write(Utf8JsonWriter writer, ModelReaderWriterOptions options)
    {
        writer.WriteStartObject();
        WriteDerived(writer, options);
        writer.WriteEndObject();
    }

    BinaryData IPersistableModel<ToolDefinition>.Write(ModelReaderWriterOptions options)
    {
        var format = options.Format == "W" ? ((IPersistableModel<ToolDefinition>)this).GetFormatFromOptions(options) : options.Format;

        switch (format)
        {
            case "J":
                return ModelReaderWriter.Write(this, options);
            default:
                throw new FormatException($"The model {nameof(ToolDefinition)} does not support '{options.Format}' format.");
        }
    }

    internal abstract void WriteDerived(Utf8JsonWriter writer, ModelReaderWriterOptions options);

    internal static ToolDefinition DeserializeToolDefinition(
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
            if (property.NameEquals("type"u8))
            {
                if (property.Value.ValueEquals("code_interpreter"u8))
                {
                    return CodeInterpreterToolDefinition.DeserializeCodeInterpreterToolDefinition(element, options);
                }
                else if (property.Value.ValueEquals("retrieval"u8))
                {
                    return RetrievalToolDefinition.DeserializeRetrievalToolDefinition(element, options);
                }
                else if (property.Value.ValueEquals("function"u8))
                {
                    return FunctionToolDefinition.DeserializeFunctionToolDefinition(element, options);
                }
                else
                {
                    throw new ArgumentException(property.Value.GetString());
                }
            }
        }
        throw new ArgumentException(nameof(element));
    }

}

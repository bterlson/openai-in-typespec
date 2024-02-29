using System;
using System.ClientModel.Internal;

using System.ClientModel;
using System.ClientModel.Primitives;
using System.Text.Json;
using OpenAI.ClientShared.Internal;

namespace OpenAI.Assistants;

public partial class ToolOutput :  IJsonModel<ToolOutput>
{
    ToolOutput IJsonModel<ToolOutput>.Create(ref Utf8JsonReader reader, ModelReaderWriterOptions options)
    {
        var format = options.Format == "W" ? ((IPersistableModel<ToolOutput>)this).GetFormatFromOptions(options) : options.Format;
        if (format != "J")
        {
            throw new FormatException($"The model {nameof(ToolOutput)} does not support '{format}' format.");
        }
        using JsonDocument document = JsonDocument.ParseValue(ref reader);
        return DeserializeToolOutput(document.RootElement, options);
    }

    ToolOutput IPersistableModel<ToolOutput>.Create(BinaryData data, ModelReaderWriterOptions options)
    {
        var format = options.Format == "W" ? ((IPersistableModel<ToolOutput>)this).GetFormatFromOptions(options) : options.Format;

        switch (format)
        {
            case "J":
                {
                    using JsonDocument document = JsonDocument.Parse(data);
                    return DeserializeToolOutput(document.RootElement, options);
                }
            default:
                throw new FormatException($"The model {nameof(ToolOutput)} does not support '{options.Format}' format.");
        }
    }

    string IPersistableModel<ToolOutput>.GetFormatFromOptions(ModelReaderWriterOptions options) => "J";

    void IJsonModel<ToolOutput>.Write(Utf8JsonWriter writer, ModelReaderWriterOptions options)
    {
        writer.WriteStartObject();
        if (OptionalProperty.IsDefined(Id))
        {
            writer.WriteString("tool_call_id"u8, Id);
        }
        if (OptionalProperty.IsDefined(Output))
        {
            writer.WriteString("output"u8, Output);
        }
        writer.WriteEndObject();
    }

    BinaryData IPersistableModel<ToolOutput>.Write(ModelReaderWriterOptions options)
    {
        var format = options.Format == "W" ? ((IPersistableModel<ToolOutput>)this).GetFormatFromOptions(options) : options.Format;

        switch (format)
        {
            case "J":
                return ModelReaderWriter.Write(this, options);
            default:
                throw new FormatException($"The model {nameof(ToolOutput)} does not support '{options.Format}' format.");
        }
    }

    internal static ToolOutput DeserializeToolOutput(
        JsonElement element,
        ModelReaderWriterOptions options = null)
    {
        options ??= new ModelReaderWriterOptions("W");

        string id = null;
        string output = null;

        if (element.ValueKind == JsonValueKind.Null)
        {
            return null;
        }
        foreach (var property in element.EnumerateObject())
        {
            if (property.NameEquals("tool_call_id"u8))
            {
                id = property.Value.ToString();
                continue;
            }
            if (property.NameEquals("output"u8))
            { 
                output = property.Value.ToString();
                continue;
            }
        }
        return new ToolOutput(id, output);
    }
}

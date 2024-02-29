using System;
using System.ClientModel.Internal;

using System.ClientModel;
using System.ClientModel.Primitives;
using System.Text.Json;

namespace OpenAI.Assistants;

public abstract partial class ToolInfo :  IJsonModel<ToolInfo>
{
    ToolInfo IJsonModel<ToolInfo>.Create(ref Utf8JsonReader reader, ModelReaderWriterOptions options)
    {
        var format = options.Format == "W" ? ((IPersistableModel<ToolInfo>)this).GetFormatFromOptions(options) : options.Format;
        if (format != "J")
        {
            throw new FormatException($"The model {nameof(ToolInfo)} does not support '{format}' format.");
        }
        using JsonDocument document = JsonDocument.ParseValue(ref reader);
        return DeserializeToolInfo(document.RootElement, options);
    }

    ToolInfo IPersistableModel<ToolInfo>.Create(BinaryData data, ModelReaderWriterOptions options)
    {
        var format = options.Format == "W" ? ((IPersistableModel<ToolInfo>)this).GetFormatFromOptions(options) : options.Format;

        switch (format)
        {
            case "J":
                {
                    using JsonDocument document = JsonDocument.Parse(data);
                    return DeserializeToolInfo(document.RootElement, options);
                }
            default:
                throw new FormatException($"The model {nameof(ToolInfo)} does not support '{options.Format}' format.");
        }
    }

    string IPersistableModel<ToolInfo>.GetFormatFromOptions(ModelReaderWriterOptions options) => "J";

    void IJsonModel<ToolInfo>.Write(Utf8JsonWriter writer, ModelReaderWriterOptions options)
    {
        writer.WriteStartObject();
        WriteDerived(writer, options);
        writer.WriteEndObject();
    }

    BinaryData IPersistableModel<ToolInfo>.Write(ModelReaderWriterOptions options)
    {
        var format = options.Format == "W" ? ((IPersistableModel<ToolInfo>)this).GetFormatFromOptions(options) : options.Format;

        switch (format)
        {
            case "J":
                return ModelReaderWriter.Write(this, options);
            default:
                throw new FormatException($"The model {nameof(ToolInfo)} does not support '{options.Format}' format.");
        }
    }

    internal abstract void WriteDerived(Utf8JsonWriter writer, ModelReaderWriterOptions options);

    internal static ToolInfo DeserializeToolInfo(
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
                    return CodeInterpreterToolInfo.DeserializeCodeInterpreterToolInfo(element, options);
                }
                else if (property.Value.ValueEquals("retrieval"u8))
                {
                    return RetrievalToolInfo.DeserializeRetrievalToolInfo(element, options);
                }
                else if (property.Value.ValueEquals("function"u8))
                {
                    return FunctionToolInfo.DeserializeFunctionToolInfo(element, options);
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

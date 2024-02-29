using System;
using System.ClientModel.Internal;

using System.ClientModel;
using System.ClientModel.Primitives;
using System.Text.Json;

namespace OpenAI.Assistants;

public abstract partial class MessageContent :  IJsonModel<MessageContent>
{
    MessageContent IJsonModel<MessageContent>.Create(ref Utf8JsonReader reader, ModelReaderWriterOptions options)
    {
        var format = options.Format == "W" ? ((IPersistableModel<MessageContent>)this).GetFormatFromOptions(options) : options.Format;
        if (format != "J")
        {
            throw new FormatException($"The model {nameof(MessageContent)} does not support '{format}' format.");
        }
        using JsonDocument document = JsonDocument.ParseValue(ref reader);
        return DeserializeMessageContent(document.RootElement, options);
    }

    MessageContent IPersistableModel<MessageContent>.Create(BinaryData data, ModelReaderWriterOptions options)
    {
        var format = options.Format == "W" ? ((IPersistableModel<MessageContent>)this).GetFormatFromOptions(options) : options.Format;

        switch (format)
        {
            case "J":
                {
                    using JsonDocument document = JsonDocument.Parse(data);
                    return DeserializeMessageContent(document.RootElement, options);
                }
            default:
                throw new FormatException($"The model {nameof(MessageContent)} does not support '{options.Format}' format.");
        }
    }

    string IPersistableModel<MessageContent>.GetFormatFromOptions(ModelReaderWriterOptions options) => "J";

    void IJsonModel<MessageContent>.Write(Utf8JsonWriter writer, ModelReaderWriterOptions options)
    {
        writer.WriteStartObject();
        WriteDerived(writer, options);
        writer.WriteEndObject();
    }

    BinaryData IPersistableModel<MessageContent>.Write(ModelReaderWriterOptions options)
    {
        var format = options.Format == "W" ? ((IPersistableModel<MessageContent>)this).GetFormatFromOptions(options) : options.Format;

        switch (format)
        {
            case "J":
                return ModelReaderWriter.Write(this, options);
            default:
                throw new FormatException($"The model {nameof(MessageContent)} does not support '{options.Format}' format.");
        }
    }

    internal abstract void WriteDerived(Utf8JsonWriter writer, ModelReaderWriterOptions options);

    internal static MessageContent DeserializeMessageContent(
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
                if (property.Value.ValueEquals("text"u8))
                {
                    return MessageTextContent.DeserializeMessageTextContent(element, options);
                }
                else if (property.Value.ValueEquals("image_file"u8))
                {
                    return MessageImageFileContent.DeserializeMessageImageFileContent(element, options);
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

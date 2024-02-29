using System;
using System.ClientModel.Internal;

using System.ClientModel;
using System.ClientModel.Primitives;
using System.Text.Json;

namespace OpenAI.Assistants;

public abstract partial class TextContentAnnotation :  IJsonModel<TextContentAnnotation>
{
    TextContentAnnotation IJsonModel<TextContentAnnotation>.Create(ref Utf8JsonReader reader, ModelReaderWriterOptions options)
    {
        var format = options.Format == "W" ? ((IPersistableModel<TextContentAnnotation>)this).GetFormatFromOptions(options) : options.Format;
        if (format != "J")
        {
            throw new FormatException($"The model {nameof(TextContentAnnotation)} does not support '{format}' format.");
        }
        using JsonDocument document = JsonDocument.ParseValue(ref reader);
        return DeserializeTextContentAnnotation(document.RootElement, options);
    }

    TextContentAnnotation IPersistableModel<TextContentAnnotation>.Create(BinaryData data, ModelReaderWriterOptions options)
    {
        var format = options.Format == "W" ? ((IPersistableModel<TextContentAnnotation>)this).GetFormatFromOptions(options) : options.Format;

        switch (format)
        {
            case "J":
                {
                    using JsonDocument document = JsonDocument.Parse(data);
                    return DeserializeTextContentAnnotation(document.RootElement, options);
                }
            default:
                throw new FormatException($"The model {nameof(TextContentAnnotation)} does not support '{options.Format}' format.");
        }
    }

    string IPersistableModel<TextContentAnnotation>.GetFormatFromOptions(ModelReaderWriterOptions options) => "J";

    void IJsonModel<TextContentAnnotation>.Write(Utf8JsonWriter writer, ModelReaderWriterOptions options)
    {
        writer.WriteStartObject();
        WriteDerived(writer, options);
        writer.WriteEndObject();
    }

    BinaryData IPersistableModel<TextContentAnnotation>.Write(ModelReaderWriterOptions options)
    {
        var format = options.Format == "W" ? ((IPersistableModel<TextContentAnnotation>)this).GetFormatFromOptions(options) : options.Format;

        switch (format)
        {
            case "J":
                return ModelReaderWriter.Write(this, options);
            default:
                throw new FormatException($"The model {nameof(TextContentAnnotation)} does not support '{options.Format}' format.");
        }
    }

    internal static TextContentAnnotation DeserializeTextContentAnnotation(
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
                if (property.Value.ValueEquals("file_citation"u8))
                {
                    return TextContentFileCitationAnnotation.DeserializeTextContentFileCitationAnnotation(element, options);
                }
                else if (property.Value.ValueEquals("file_path"u8))
                {
                    return TextContentFilePathAnnotation.DeserializeTextContentFilePathAnnotation(element, options);
                }
                else
                {
                    throw new ArgumentException(property.Value.GetString());
                }
            }
        }
        throw new ArgumentException(nameof(element));
    }

    internal abstract void WriteDerived(Utf8JsonWriter writer, ModelReaderWriterOptions options);
}

using System.ClientModel;
using System.ClientModel.Primitives;
using System.Collections.Generic;
using System.Text.Json;

namespace OpenAI.Assistants;

public class MessageTextContent : MessageContent
{
    /// <summary>
    /// The content text. The interpretation of this value will depend on which kind of chat message the content is
    /// associated with.
    /// </summary>
    public string Text { get; }

    public IReadOnlyList<TextContentAnnotation> Annotations { get; }

    internal MessageTextContent(string text, IReadOnlyList<TextContentAnnotation> annotations)
    {
        Text = text;
        Annotations = annotations;
    }

    internal override void WriteDerived(Utf8JsonWriter writer, ModelReaderWriterOptions options)
    {
        writer.WriteString("type"u8, "text"u8);
        writer.WritePropertyName("text"u8);
        writer.WriteStartObject();
        writer.WriteString("value"u8, Text);
        writer.WriteEndObject();
    }

    internal static MessageContent DeserializeMessageTextContent(
        JsonElement element,
        ModelReaderWriterOptions options = null)
    {
        options ??= new ModelReaderWriterOptions("W");

        if (element.ValueKind == JsonValueKind.Null)
        {
            return null;
        }

        string text = null;
        List<TextContentAnnotation> annotations = null;

        foreach (var property in element.EnumerateObject())
        {
            if (property.NameEquals("text"u8))
            {
                foreach (var textObjectProperty in property.Value.EnumerateObject())
                {
                    if (textObjectProperty.NameEquals("value"u8))
                    {
                        text = textObjectProperty.Value.GetString();
                        continue;
                    }
                    if (textObjectProperty.NameEquals("annotations"u8))
                    {
                        annotations ??= [];
                        foreach (var annotationObject in textObjectProperty.Value.EnumerateArray())
                        {
                            annotations.Add(TextContentAnnotation.DeserializeTextContentAnnotation(annotationObject, options));
                        }
                        continue;
                    }
                }
            }
        }
        return new MessageTextContent(text, annotations);
    }
}
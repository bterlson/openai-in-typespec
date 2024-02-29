using System.ClientModel;
using System.ClientModel.Primitives;
using System.Text.Json;

namespace OpenAI.Assistants;

public class MessageImageFileContent : MessageContent
{
    public string FileId { get; }

    internal MessageImageFileContent(string fileId)
    {
        FileId = fileId;
    }

    internal override void WriteDerived(Utf8JsonWriter writer, ModelReaderWriterOptions options)
    {
        writer.WriteString("type"u8, "image_file"u8);
        writer.WritePropertyName("image_file"u8);
        writer.WriteStartObject();
        writer.WriteString("file_id"u8, FileId);
        writer.WriteEndObject();
    }


    internal static MessageContent DeserializeMessageImageFileContent(
        JsonElement element,
        ModelReaderWriterOptions options = null)
    {
        options ??= new ModelReaderWriterOptions("W");

        if (element.ValueKind == JsonValueKind.Null)
        {
            return null;
        }

        string fileId = null;

        foreach (var property in element.EnumerateObject())
        {
            if (property.NameEquals("image_file"u8))
            {
                foreach (var textObjectProperty in property.Value.EnumerateObject())
                {
                    if (textObjectProperty.NameEquals("file_id"u8))
                    {
                        fileId = textObjectProperty.Value.GetString();
                        continue;
                    }
                }
            }
        }
        return new MessageImageFileContent(fileId);
    }
}
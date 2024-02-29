using System.ClientModel;
using System.ClientModel.Primitives;
using System.Text.Json;

namespace OpenAI.Assistants;

public class TextContentFilePathAnnotation : TextContentAnnotation
{
    public string TextToReplace { get; }

    public string FileId { get; }

    public int StartIndex { get; }

    public int EndIndex { get; }

    internal TextContentFilePathAnnotation(string textToReplace, string createdFileId, int startIndex, int endIndex)
    {
        TextToReplace = textToReplace;
        FileId = createdFileId;
        StartIndex = startIndex;
        EndIndex = endIndex;
    }

    internal override void WriteDerived(Utf8JsonWriter writer, ModelReaderWriterOptions options)
    {
        writer.WriteString("type"u8, "file_path"u8);
        writer.WriteString("text"u8, TextToReplace);
        writer.WritePropertyName("file_path"u8);
        writer.WriteStartObject();
        writer.WriteString("file_id"u8, FileId);
        writer.WriteEndObject();
        writer.WriteNumber("start_index"u8, StartIndex);
        writer.WriteNumber("end_index"u8, EndIndex);
    }

    internal static TextContentFilePathAnnotation DeserializeTextContentFilePathAnnotation(
        JsonElement element,
        ModelReaderWriterOptions options = null)
    {
        options ??= new ModelReaderWriterOptions("W");

        if (element.ValueKind == JsonValueKind.Null)
        {
            return null;
        }

        string textToReplace = null;
        int startIndex = 0;
        int endIndex = 0;
        string createdFileId = null;

        foreach (var property in element.EnumerateObject())
        {
            if (property.NameEquals("text"u8))
            {
                textToReplace = property.Value.GetString();
                continue;
            }
            if (property.NameEquals("start_index"u8))
            {
                startIndex = property.Value.GetInt32();
                continue;
            }
            if (property.NameEquals ("end_index"u8))
            {
                endIndex = property.Value.GetInt32();
                continue;
            }
            if (property.NameEquals("file_path"u8))
            {
                foreach (var filePathObjectProperty in property.Value.EnumerateObject())
                {
                    if (filePathObjectProperty.NameEquals("file_id"u8))
                    {
                        createdFileId = filePathObjectProperty.Value.GetString();
                        continue;
                    }
                }
            }
        }
        return new TextContentFilePathAnnotation(textToReplace, createdFileId, startIndex, endIndex);
    }

}
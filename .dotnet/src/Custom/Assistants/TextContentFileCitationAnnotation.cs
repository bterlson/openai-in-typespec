using System.ClientModel;
using System.ClientModel.Primitives;
using System.Text.Json;

namespace OpenAI.Assistants;

public class TextContentFileCitationAnnotation : TextContentAnnotation
{
    public string TextToReplace { get; }

    public string FileId { get; }

    public string Quote { get; }

    public int StartIndex { get; }

    public int EndIndex { get; }

    internal TextContentFileCitationAnnotation(string textToReplace, string citationFileId, string citationQuote, int startIndex, int endIndex)
    {
        TextToReplace = textToReplace;
        FileId = citationFileId;
        Quote = citationQuote;
        StartIndex = startIndex;
        EndIndex = endIndex;
    }

    internal override void WriteDerived(Utf8JsonWriter writer, ModelReaderWriterOptions options)
    {
        writer.WriteString("type"u8, "file_citation"u8);
        writer.WriteString("text"u8, TextToReplace);
        writer.WritePropertyName("file_citation"u8);
        writer.WriteStartObject();
        writer.WriteString("file_id"u8, FileId);
        writer.WriteString("quote"u8, Quote);
        writer.WriteEndObject();
        writer.WriteNumber("start_index"u8, StartIndex);
        writer.WriteNumber("end_index"u8, EndIndex);
    }


    internal static TextContentFileCitationAnnotation DeserializeTextContentFileCitationAnnotation(
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
        string citationFileId = null;
        string citationQuote = null;

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
            if (property.NameEquals("end_index"u8))
            {
                endIndex = property.Value.GetInt32();
                continue;
            }
            if (property.NameEquals("file_citation"u8))
            {
                foreach (var filePathObjectProperty in property.Value.EnumerateObject())
                {
                    if (filePathObjectProperty.NameEquals("file_id"u8))
                    {
                        citationFileId = filePathObjectProperty.Value.GetString();
                        continue;
                    }
                    if (filePathObjectProperty.NameEquals("quote"u8))
                    {
                        citationQuote = filePathObjectProperty.Value.GetString();
                        continue;
                    }
                }
            }
        }
        return new TextContentFileCitationAnnotation(textToReplace, citationFileId, citationQuote, startIndex, endIndex);
    }
}
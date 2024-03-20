using OpenAI.Internal;
using System;
using System.IO;

namespace OpenAI.Files;

internal class UploadFileOptions
{
    internal static MultipartFormDataBinaryContent ToMultipartContent(Stream fileStream, string fileName, OpenAIFilePurpose purpose)
    {
        MultipartFormDataBinaryContent content = new();

        content.Add(fileStream, "file", fileName);

        AddContent(purpose, content);

        return content;
    }

    internal static MultipartFormDataBinaryContent ToMultipartContent(BinaryData fileData, string fileName, OpenAIFilePurpose purpose)
    {
        MultipartFormDataBinaryContent content = new();

        content.Add(fileData, "file", fileName);

        AddContent(purpose, content);

        return content;
    }

    private static void AddContent(OpenAIFilePurpose purpose, MultipartFormDataBinaryContent content)
    {
        string purposeValue = purpose switch
        {
            OpenAIFilePurpose.FineTuning => "fine-tune",
            OpenAIFilePurpose.Assistants => "assistants",
            _ => throw new ArgumentException($"Unsupported purpose for file upload: {purpose}"),
        };

        content.Add(purposeValue, "\"purpose\"");
    }
}

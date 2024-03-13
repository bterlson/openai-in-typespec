using NUnit.Framework;
using OpenAI.Files;
using System;
using System.ClientModel;
using static OpenAI.Tests.TestHelpers;

namespace OpenAI.Tests.Files;

public partial class FileClientTests
{
    [Test]
    public void ListFilesWorks()
    {
        FileClient client = GetTestClient();
        ClientResult<OpenAIFileInfoCollection> result = client.GetFileInfoList();
        Assert.That(result.Value.Count, Is.GreaterThan(0));
        Console.WriteLine(result.Value.Count);
        ClientResult<OpenAIFileInfoCollection> assistantsResult = client.GetFileInfoList(OpenAIFilePurpose.Assistants);
        Assert.That(assistantsResult.Value.Count, Is.GreaterThan(0));
        Assert.That(assistantsResult.Value.Count, Is.LessThan(result.Value.Count));
        Console.WriteLine(assistantsResult.Value.Count);
    }

    [Test]
    public void UploadFileWorks()
    {
        FileClient client = GetTestClient();
        BinaryData uploadData = BinaryData.FromString("hello, this is a text file, please delete me");
        ClientResult<OpenAIFileInfo> uploadResult = client.UploadFile(uploadData, "test-file-delete-me.txt", OpenAIFilePurpose.Assistants);
    }

    [Test]
    public void DownloadAndInfoWork()
    {
        FileClient client = GetTestClient();
        ClientResult<OpenAIFileInfo> fileInfoResult = client.GetFileInfo("file-S7roYWamZqfMK9D979HU4q6m");
        Assert.That(fileInfoResult.Value, Is.Not.Null);
        ClientResult<BinaryData> downloadResult = client.DownloadFile("file-S7roYWamZqfMK9D979HU4q6m");
        Assert.That(downloadResult.Value, Is.Not.Null);
    }

    private static FileClient GetTestClient() => GetTestClient<FileClient>(TestScenario.Files);
}
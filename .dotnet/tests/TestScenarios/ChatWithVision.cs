using NUnit.Framework;
using OpenAI.Chat;
using System;
using System.ClientModel;
using System.IO;
using System.Net.Mime;
using static OpenAI.Tests.TestHelpers;

namespace OpenAI.Tests.Chat;

public partial class ChatWithVision
{
    [Test]
    public void DescribeAnImage()
    {
        var stopSignPath = Path.Combine("data", "stop_sign.png");
        var stopSignData = BinaryData.FromBytes(File.ReadAllBytes(stopSignPath));

        ChatClient client = GetTestClient<ChatClient>(TestScenario.VisionChat);

        ClientResult<ChatCompletion> result = client.CompleteChat(
            [
                new ChatRequestUserMessage(
                    "Describe this image for me",
                    ChatMessageContent.CreateImage(stopSignData, "image/png")),
            ], new ChatCompletionOptions()
            {
                MaxTokens = 2048,
            });
        Console.WriteLine(result.Value.Content);
        Assert.That(result.Value.Content.ToString().ToLowerInvariant(), Contains.Substring("stop"));
    }
}

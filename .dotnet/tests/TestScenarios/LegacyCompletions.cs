using NUnit.Framework;
using OpenAI.LegacyCompletions;
using System;
using System.ClientModel;
using System.ClientModel;
using System.ClientModel.Primitives;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace OpenAI.Tests.LegacyCompletions;

public partial class LegacyCompletionTests
{
    [Test]
    public void BasicValidationWorks()
    {
        LegacyCompletionClient client = new();
        BinaryData requestData = BinaryData.FromObjectAsJson(new
        {
            model = "gpt-3.5-turbo-instruct",
            prompt = "hello world",
            max_tokens = 256,
            temperature = 0,
        });
        BinaryContent content = BinaryContent.Create(requestData);
        ClientResult result = client.GenerateLegacyCompletions(content);
        Assert.That(result, Is.Not.Null);
        JsonObject responseObject = JsonSerializer.Deserialize<JsonObject>(result.GetRawResponse().Content.ToString());
        string text = responseObject["choices"].AsArray()[0].AsObject()["text"].ToString();
        Assert.That(text, Is.Not.Null.Or.Empty);
    }
}

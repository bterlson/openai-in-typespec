using NUnit.Framework;
using OpenAI.Chat;
using System;
using System.ClientModel;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using static OpenAI.Tests.TestHelpers;

namespace OpenAI.Tests.Chat;

public partial class ChatToolTests
{
    [Test]
    public void NoParameterToolWorks()
    {
        ChatClient client = new("gpt-3.5-turbo");
        ChatFunctionToolDefinition getFavoriteColorTool = new()
        {
            Name = "get_favorite_color",
            Description = "gets the favorite color of the caller",
        };
        ChatCompletionOptions options = new()
        {
            Tools = { getFavoriteColorTool },
        };
        ClientResult<ChatCompletion> result = client.CompleteChat("What's my favorite color?", options);
        Assert.That(result.Value.FinishReason, Is.EqualTo(ChatFinishReason.ToolCalls));
        Assert.That(result.Value.ToolCalls.Count, Is.EqualTo(1));
        var functionToolCall = result.Value.ToolCalls[0] as ChatFunctionToolCall;
        var toolCallArguments = BinaryData.FromString(functionToolCall.Arguments).ToObjectFromJson<Dictionary<string, object>>();
        Assert.That(functionToolCall, Is.Not.Null);
        Assert.That(functionToolCall.Name, Is.EqualTo(getFavoriteColorTool.Name));
        Assert.That(functionToolCall.Id, Is.Not.Null.Or.Empty);
        Assert.That(toolCallArguments.Count, Is.EqualTo(0));

        result = client.CompleteChat(
            [
                new ChatRequestUserMessage("What's my favorite color?"),
                new ChatRequestAssistantMessage(result.Value),
                new ChatRequestToolMessage(functionToolCall.Id, "green"),
            ]);
        Assert.That(result.Value.FinishReason, Is.EqualTo(ChatFinishReason.Stopped));
        Assert.That(result.Value.Content.ToString().ToLowerInvariant(), Contains.Substring("green"));
    }

    [Test]
    public void ParametersWork()
    {
        ChatClient client = GetTestClient<ChatClient>(TestScenario.Chat);
        ChatFunctionToolDefinition favoriteColorForMonthTool = new()
        {
            Name = "get_favorite_color_for_month",
            Description = "gets the caller's favorite color for a given month",
            Parameters = BinaryData.FromString("""
                {
                    "type": "object",
                    "properties": {
                        "month_name": {
                            "type": "string",
                            "description": "the name of a calendar month, e.g. February or October."
                        }
                    },
                    "required": [ "month_name" ]
                }
                """),
        };
        ChatCompletionOptions options = new()
        {
            Tools = { favoriteColorForMonthTool },
        };
        List<ChatRequestMessage> messages =
        [
            new ChatRequestUserMessage("What's my favorite color in February?"),
        ];
        ClientResult<ChatCompletion> result = client.CompleteChat(messages, options);
        Assert.That(result.Value.FinishReason, Is.EqualTo(ChatFinishReason.ToolCalls));
        Assert.That(result.Value.ToolCalls?.Count, Is.EqualTo(1));
        var functionToolCall = result.Value.ToolCalls[0] as ChatFunctionToolCall;
        Assert.That(functionToolCall.Name, Is.EqualTo(favoriteColorForMonthTool.Name));
        JsonObject argumentsJson = JsonSerializer.Deserialize<JsonObject>(functionToolCall.Arguments);
        Assert.That(argumentsJson.Count, Is.EqualTo(1));
        Assert.That(argumentsJson.ContainsKey("month_name"));
        Assert.That(argumentsJson["month_name"].ToString().ToLowerInvariant(), Is.EqualTo("february"));
        messages.Add(new ChatRequestAssistantMessage(result.Value));
        messages.Add(new ChatRequestToolMessage(functionToolCall.Id, "chartreuse"));
        result = client.CompleteChat(messages, options);
        Assert.That(result.Value.Content.ToString().ToLowerInvariant(), Contains.Substring("chartreuse"));
    }
}

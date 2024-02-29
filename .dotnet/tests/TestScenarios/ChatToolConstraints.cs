using NUnit.Framework;
using OpenAI.Chat;
using System;
using System.ClientModel;

namespace OpenAI.Tests.Chat;

public partial class ChatToolConstraintTests
{
    [Test]
    public void BasicTypeManipulationWorks()
    {
        Assert.That(ChatToolConstraint.Auto.ToString(), Is.EqualTo("\"auto\""));
        Assert.That(ChatToolConstraint.None.ToString(), Is.EqualTo("\"none\""));
        Assert.That(ChatToolConstraint.Auto, Is.Not.EqualTo(ChatToolConstraint.None));

        ChatFunctionToolDefinition functionTool = new()
        {
            Name = "test_function_tool",
            Description = "description isn't applicable",
        };

        ChatToolConstraint constraintFromDefinition = new(functionTool);
        Assert.That(constraintFromDefinition.ToString(), Is.EqualTo(@$"{{""type"":""function"",""function"":{{""name"":""{functionTool.Name}""}}}}"));

        ChatToolConstraint otherConstraint = new(new ChatFunctionToolDefinition("test_function_tool"));
        Assert.That(constraintFromDefinition, Is.EqualTo(otherConstraint));
        Assert.That(otherConstraint, Is.Not.EqualTo(ChatToolConstraint.Auto));
    }

    [Test]
    public void ConstraintsWork()
    {
        ChatClient client = new("gpt-3.5-turbo");
        ChatCompletionOptions options = new()
        {
            Tools = { s_numberForWordTool },
        };

        foreach (var (constraint, reason) in new (ChatToolConstraint?, ChatFinishReason)[]
        {
            (null, ChatFinishReason.ToolCalls),
            (ChatToolConstraint.None, ChatFinishReason.Stopped),
            (new ChatToolConstraint(s_numberForWordTool), ChatFinishReason.Stopped),
            (ChatToolConstraint.Auto, ChatFinishReason.ToolCalls),
        })
        {
            options.ToolConstraint = constraint;
            ClientResult<ChatCompletion> result = client.CompleteChat("What's the number for the word 'banana'?", options);
            Assert.That(result.Value.FinishReason, Is.EqualTo(reason));
        }
    }

    private static ChatFunctionToolDefinition s_numberForWordTool = new()
    {
        Name = "get_number_for_word",
        Description = "gets an arbitrary number assigned to a given word",
        Parameters = BinaryData.FromObjectAsJson(new
        {
            type = "object",
            properties = new
            {
                word = new
                {
                    type = "string"
                }
            }
        }),
    };
}

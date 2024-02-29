using NUnit.Framework;
using OpenAI.Chat;
using System;
using System.Collections.Generic;
using System.Text.Json;

namespace OpenAI.Tests.Examples;

public partial class Samples_FunctionCalling
{
    #region
    private static string GetCurrentWeather(string location, string unit = "celsius")
    {
        // Call the weather API here.
        return "31 celsius";
    }

    private const string GetCurrentWeatherFunctionName = "get_current_weather";

    private static readonly ChatFunctionToolDefinition getCurrentWeatherFunction = new()
    {
        Name = GetCurrentWeatherFunctionName,
        Description = "Get the current weather in a given location",
        Parameters = BinaryData.FromString("""
           {
               "type": "object",
               "properties": {
                   "location": {
                       "type": "string",
                       "description": "The city and state, e.g. Boston, MA"
                   },
                   "unit": {
                       "type": "string",
                       "enum": [ "celsius", "fahrenheit" ],
                       "description": "The temperature unit to use. Infer this from the specified location."
                   }
               },
               "required": [ "location" ]
           }
           """),
    };
    #endregion

    [Test]
    [Ignore("Compilation validation only")]
    public void ChatWithFunctionCalling()
    {
        ChatClient client = new("gpt-3.5-turbo", Environment.GetEnvironmentVariable("OpenAIClient_KEY"));

        #region
        List<ChatRequestMessage> messages =
        [
            new ChatRequestSystemMessage(
               "Don't make assumptions about what values to plug into functions."
               + " Ask for clarification if a user request is ambiguous."),
            new ChatRequestUserMessage("What's the weather like in San Francisco?"),
        ];

        ChatCompletionOptions options = new()
        {
            Tools = { getCurrentWeatherFunction },
        };

        ChatCompletion chatCompletion = client.CompleteChat(messages, options);
        #endregion

        #region
        if (chatCompletion.FinishReason == ChatFinishReason.ToolCalls)
        {
            // First, add the assistant message with tool calls to the conversation history.
            messages.Add(new ChatRequestAssistantMessage(chatCompletion));

            // Then, add a new tool message for each tool call that is resolved.
            foreach (ChatToolCall toolCall in chatCompletion.ToolCalls)
            {
                ChatFunctionToolCall functionToolCall = toolCall as ChatFunctionToolCall;

                switch (functionToolCall?.Name)
                {
                    case GetCurrentWeatherFunctionName:
                        {
                            // The arguments that the model wants to use to call the function are specified as a
                            // stringified JSON object based on the schema defined in the tool definition. Note that
                            // the model may hallucinate arguments too. Consequently, it is important to do the
                            // appropriate parsing and validation before calling the function.
                            using JsonDocument argumentsJson = JsonDocument.Parse(functionToolCall.Arguments);
                            bool hasLocation = argumentsJson.RootElement.TryGetProperty("location", out JsonElement location);
                            bool hasUnit = argumentsJson.RootElement.TryGetProperty("unit", out JsonElement unit);

                            if (!hasLocation)
                            {
                                throw new ArgumentNullException(nameof(location), "The location argument is required.");
                            }

                            string toolResult = GetCurrentWeather(location.GetString(), hasUnit ? unit.GetString() : null);
                            messages.Add(new ChatRequestToolMessage(toolCall.Id, toolResult));
                            break;
                        }

                    default:
                        {
                            // Handle other or unexpected calls.
                            throw new NotImplementedException();
                        }
                }
            }

            // Finally, make a new request to chat completions to let the assistant summarize the tool results
            // and add the resulting message to the conversation history to keep it organized all in one place.
            ChatCompletion chatCompletionAfterToolMessages = client.CompleteChat(messages, options);
            messages.Add(new ChatRequestAssistantMessage(chatCompletionAfterToolMessages));
        }
        #endregion

        #region
        foreach (ChatRequestMessage requestMessage in messages)
        {
            switch (requestMessage)
            {
                case ChatRequestSystemMessage systemMessage:
                    Console.WriteLine($"[SYSTEM]:");
                    Console.WriteLine($"{systemMessage.Content.Span[0].ToText()}");
                    Console.WriteLine();
                    break;

                case ChatRequestUserMessage userMessage:
                    Console.WriteLine($"[USER]:");
                    Console.WriteLine($"{userMessage.Content.Span[0].ToText()}");
                    Console.WriteLine();
                    break;

                case ChatRequestAssistantMessage assistantMessage when assistantMessage.Content.Span[0].ToText() is not null:
                    Console.WriteLine($"[ASSISTANT]:");
                    Console.WriteLine($"{assistantMessage.Content.Span[0].ToText()}");
                    Console.WriteLine();
                    break;

                case ChatRequestToolMessage:
                    // Do not print any tool messages; let the assistant summarize the tool results instead.
                    break;

                default:
                    break;
            }
        }
        #endregion
    }
}

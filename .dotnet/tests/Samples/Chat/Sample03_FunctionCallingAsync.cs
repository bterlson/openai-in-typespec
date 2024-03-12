using NUnit.Framework;
using OpenAI.Chat;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

namespace OpenAI.Samples
{
    public partial class ChatSamples
    {
        [Test]
        [Ignore("Compilation validation only")]
        public async Task Sample03_FunctionCallingAsync()
        {
            ChatClient client = new("gpt-3.5-turbo", Environment.GetEnvironmentVariable("OpenAIClient_KEY"));

            #region
            List<ChatRequestMessage> messages = [
                new ChatRequestSystemMessage(
                   "Don't make assumptions about what values to plug into functions."
                   + " Ask for clarification if a user request is ambiguous."),
                new ChatRequestUserMessage("What's the weather like today?"),
            ];

            ChatCompletionOptions options = new()
            {
                Tools = { getCurrentLocationFunction, getCurrentWeatherFunction },
            };
            #endregion

            #region
            bool requiresAction;

            do
            {
                requiresAction = false;
                ChatCompletion chatCompletion = await client.CompleteChatAsync(messages, options);

                switch (chatCompletion.FinishReason)
                {
                    case ChatFinishReason.Stopped:
                        {
                            // Add the assistant message to the conversation history.
                            messages.Add(new ChatRequestAssistantMessage(chatCompletion));
                            break;
                        }

                    case ChatFinishReason.ToolCalls:
                        {
                            // First, add the assistant message with tool calls to the conversation history.
                            messages.Add(new ChatRequestAssistantMessage(chatCompletion));

                            // Then, add a new tool message for each tool call that is resolved.
                            foreach (ChatToolCall toolCall in chatCompletion.ToolCalls)
                            {
                                ChatFunctionToolCall functionToolCall = toolCall as ChatFunctionToolCall;

                                switch (functionToolCall?.Name)
                                {
                                    case GetCurrentLocationFunctionName:
                                        {
                                            string toolResult = GetCurrentLocation();
                                            messages.Add(new ChatRequestToolMessage(toolCall.Id, toolResult));
                                            break;
                                        }

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

                                            string toolResult = hasUnit
                                                ? GetCurrentWeather(location.GetString(), unit.GetString())
                                                : GetCurrentWeather(location.GetString());
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

                            requiresAction = true;
                            break;
                        }

                    case ChatFinishReason.Length:
                        throw new NotImplementedException("Incomplete model output due to MaxTokens parameter or token limit exceeded.");

                    case ChatFinishReason.ContentFilter:
                        throw new NotImplementedException("Omitted content due to a content filter flag.");

                    case ChatFinishReason.FunctionCall:
                        throw new NotImplementedException("Deprecated in favor of tool calls.");

                    default:
                        throw new NotImplementedException(chatCompletion.FinishReason.ToString());
                }
            } while (requiresAction);
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
}

using NUnit.Framework;
using OpenAI.Assistants;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading;

namespace OpenAI.Samples
{
    public partial class AssistantSamples
    {
        #region
        private static string GetCurrentLocation()
        {
            // Call the location API here.
            return "San Francisco";
        }

        private static string GetCurrentWeather(string location, string unit = "celsius")
        {
            // Call the weather API here.
            return $"31 {unit}";
        }

        private const string GetCurrentLocationFunctionName = "get_current_location";

        private const string GetCurrentWeatherFunctionName = "get_current_weather";

        private static readonly FunctionToolDefinition getCurrentLocationFunction = new()
        {
            Name = GetCurrentLocationFunctionName,
            Description = "Get the user's current location"
        };

        private static readonly FunctionToolDefinition getCurrentWeatherFunction = new()
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
        // [Ignore("Compilation validation only")]
        public void Sample03_FunctionCalling()
        {
            AssistantClient client = new(Environment.GetEnvironmentVariable("OpenAIClient_KEY"));

            #region
            // Create an assistant that can call the function tools.
            AssistantCreationOptions assistantOptions = new()
            {
                Name = "Sample: Function Calling",
                Instructions =
                    "Don't make assumptions about what values to plug into functions."
                    + " Ask for clarification if a user request is ambiguous.",
                Tools = { getCurrentLocationFunction, getCurrentWeatherFunction },
                Metadata = { ["test_key_delete_me"] = "true" },
            };

            Assistant assistant = client.CreateAssistant("gpt-4-1106-preview", assistantOptions);
            #endregion

            #region
            // Create a thread with an initial user message and run it.
            ThreadCreationOptions threadOptions = new()
            {
                Messages = { new ThreadInitializationMessage(MessageRole.User, "What's the weather like today?"), }
            };

            ThreadRun threadRun = client.CreateThreadAndRun(assistant.Id, threadOptions);
            #endregion

            #region
            // Poll the run until it is no longer queued or in progress.
            while (threadRun.Status == RunStatus.Queued || threadRun.Status == RunStatus.InProgress)
            {
                Thread.Sleep(TimeSpan.FromSeconds(1));
                threadRun = client.GetRun(threadRun.ThreadId, threadRun.Id);

                // If the run requires action, resolve them.
                if (threadRun.Status == RunStatus.RequiresAction)
                {
                    List<ToolOutput> toolOutputs = [];

                    foreach (RunRequiredAction action in threadRun.RequiredActions)
                    {
                        RequiredFunctionToolCall requiredFunctionToolCall = action as RequiredFunctionToolCall;

                        switch (requiredFunctionToolCall?.Name)
                        {
                            case GetCurrentLocationFunctionName:
                                {
                                    string toolResult = GetCurrentLocation();
                                    toolOutputs.Add(new ToolOutput(requiredFunctionToolCall.Id, toolResult));
                                    break;
                                }

                            case GetCurrentWeatherFunctionName:
                                {
                                    // The arguments that the model wants to use to call the function are specified as a
                                    // stringified JSON object based on the schema defined in the tool definition. Note that
                                    // the model may hallucinate arguments too. Consequently, it is important to do the
                                    // appropriate parsing and validation before calling the function.
                                    using JsonDocument argumentsJson = JsonDocument.Parse(requiredFunctionToolCall.Arguments);
                                    bool hasLocation = argumentsJson.RootElement.TryGetProperty("location", out JsonElement location);
                                    bool hasUnit = argumentsJson.RootElement.TryGetProperty("unit", out JsonElement unit);

                                    if (!hasLocation)
                                    {
                                        throw new ArgumentNullException(nameof(location), "The location argument is required.");
                                    }

                                    string toolResult = hasUnit
                                        ? GetCurrentWeather(location.GetString(), unit.GetString())
                                        : GetCurrentWeather(location.GetString());
                                    toolOutputs.Add(new ToolOutput(requiredFunctionToolCall.Id, toolResult));
                                    break;
                                }

                            default:
                                {
                                    // Handle other or unexpected calls.
                                    throw new NotImplementedException();
                                }
                        }
                    }

                    // Submit the tool outputs to the assistant, which returns the run to the queued state.
                    threadRun = client.SubmitToolOutputs(threadRun.ThreadId, threadRun.Id, toolOutputs);
                }
            }
            #endregion

            #region
            switch (threadRun.Status)
            {
                case RunStatus.CompletedSuccessfully:
                    {
                        ListQueryPage<ThreadMessage> messages = client.GetMessages(threadRun.ThreadId);

                        for (int i = messages.Count - 1; i >= 0; i--)
                        {
                            ThreadMessage message = messages[i];

                            Console.WriteLine($"[{message.Role.ToString().ToUpper()}]:");
                            foreach (MessageContent contentItem in message.ContentItems)
                            {
                                if (contentItem is MessageTextContent textContent)
                                {
                                    Console.WriteLine($"{textContent.Text}");

                                    if (textContent.Annotations.Count > 0)
                                    {
                                        Console.WriteLine();
                                    }

                                    // Include annotations, if any.
                                    foreach (TextContentAnnotation annotation in textContent.Annotations)
                                    {
                                        if (annotation is TextContentFileCitationAnnotation citationAnnotation)
                                        {
                                            Console.WriteLine($"* File citation, file ID: {citationAnnotation.FileId}");
                                        }
                                        else if (annotation is TextContentFilePathAnnotation pathAnnotation)
                                        {
                                            Console.WriteLine($"* File path, file ID: {pathAnnotation.FileId}");
                                        }
                                    }
                                }
                            }
                            Console.WriteLine();
                        }
                        break;
                    }

                default:
                    throw new NotImplementedException(threadRun.Status.ToString());
            }
            #endregion
        }
    }
}

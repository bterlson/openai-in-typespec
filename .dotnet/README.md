# OpenAI client library for .NET

The OpenAI client library for .NET provides convenient access to the OpenAI REST API from .NET applications.

## Getting started

### Prerequisites

To call the OpenAI REST API, you will need an API key. To obtain one, first [create a new OpenAI account](https://platform.openai.com/signup) or [log in](https://platform.openai.com/login). Next, navigate to the [API key page](https://platform.openai.com/account/api-keys) and select "Create new secret key", optionally naming the key. Make sure to save your API key somewhere safe and do not share it with anyone.

### Install the NuGet package

Add the client library to your .NET project with [NuGet](https://www.nuget.org/):

```cli
dotnet add package OpenAI.OpenAI --prerelease
```

Note that the code samples included below were written using [.NET 8](https://dotnet.microsoft.com/download/dotnet/8.0).

## Using the client library

For convenience, the client library is organized by feature area into nine different namespaces, each with a corresponding client class:

| Namespace                   | Client class             |
| ----------------------------|--------------------------|
| `OpenAI.Assistants`         | `AssistantsClient`       |
| `OpenAI.Audio`              | `AudioClient`            |
| `OpenAI.Chat`               | `ChatClient`             |
| `OpenAI.Embeddings`         | `EmbeddingClient`        |
| `OpenAI.Files`              | `FileClient`             |
| `OpenAI.Images`             | `ImageClient`            |
| `OpenAI.LegacyCompletions`  | `LegacyCompletionClient` |
| `OpenAI.ModelManagement`    | `ModelManagementClient`  |
| `OpenAI.Moderations`        | `ModerationsClient`      |

To use chat completions, for example, start by adding the corresponding `using` statement and create an instance of the `ChatClient` by specifying both:

1. The name of the OpenAI model that the client will use in its API calls (e.g., `"gpt-3.5-turbo"`)
2. The API key that the client will use to authenticate

Then, call its `CompleteChat` method by passing the user message that you would like to generate completions for:

```csharp
using OpenAI.Chat;

ChatClient client = new("gpt-3.5-turbo", "<insert your OpenAI API key here>");

ChatCompletion chatCompletion = client.CompleteChat("How does AI work? Explain it in simple terms.");

Console.WriteLine($"[ASSISTANT]:");
Console.WriteLine($"{ chatCompletion.Content }");
```

For illustrative purposes, the code above prints the `Content` property of the resulting `ChatCompletion` object, yielding something like this:

```text
[ASSISTANT]:
AI, or artificial intelligence, is a technology that allows machines to mimic human behaviors and intelligence.
It works by using algorithms and data to make decisions and perform tasks. These algorithms are designed to analyze
data, recognize patterns, and learn from past experiences to make predictions and solve problems. AI can be trained
to perform specific tasks, such as recognizing images or translating languages, by using vast amounts of data to
make accurate decisions. Essentially, AI works by processing data and using it to make informed decisions and solve
problems, much like a human brain would.
```

### Making async API calls

Note that every client method that performs a synchronous API call has an asynchronous variant in the same client class. For instance, the asynchronous variant of the `ChatClient`'s `CompleteChat` method is the `ChatClient`'s `CompleteChatAsync` method. If you wanted to re-write the sample above as async code, all that you would need to do is modify the client method call like this:

```csharp
ChatCompletion chatCompletion = await client.CompleteChatAsync("How does AI work? Explain it in simple terms.");
```

### Using the `OpenAIClient` class

In addition to the nine namespaces mentioned above, there is also the parent `OpenAI` namespace itself:

```csharp
using OpenAI;
```

This namespace contains the `OpenAIClient` class, which offers certain conveniences when you need to work with multiple clients. More specifically, you can use an instance of this class to create instances of the other clients that would share the same HTTP pipeline.

You can create an `OpenAIClient` by specifying the API key that all clients will use for authentication:

```csharp
OpenAIClient client = new("<insert your OpenAI API key here>");
```

Next, to create an instance of an `AudioClient`, for example, you can call the `OpenAIClient`'s `GetAudioClient` method by passing the OpenAI model that the `AudioClient` will use in its API calls. If necessary, you can create additional clients of the same type to target different models.

```csharp
AudioClient ttsClient = client.GetAudioClient("tts-1");
AudioClient whisperClient = client.GetAudioClient("whisper-1");
```

## How to use chat completions with streaming

When you request a chat completion, the default behavior is for the server to generate it in its entirety before sending it back in a single response. Consequently, long chat completions can require waiting for several seconds before hearing back from the server. To mitigate this, the OpenAI REST API supports the ability to stream partial results back as they are being generated, allowing you to start processing the beginning of the completion before it is finished.

The client library offers a convenient approach to working with streaming chat completions. If you wanted to re-write the sample from the previous section using streaming, rather than calling the `ChatClient`'s `CompleteChat` method, you would call its `CompleteChatStreaming` method instead:

```csharp
StreamingClientResult<StreamingChatUpdate> result =
    client.CompleteChatStreaming("How does AI work? Explain it in simple terms.");
```

Notice that the returned value is a `StreamingClientResult<StreamingChatUpdate>` object, which can be iterated on to receive the streaming updates as they arrive:

```csharp
Console.WriteLine("[ASSISTANT]: ");
await foreach (StreamingChatUpdate chatUpdate in result)
{
    Console.Write(chatUpdate.ContentUpdate);
}
```

## How to use chat completions with function calling

In this sample, you have two functions. The first function can retrieve a user's current geographic location (e.g., by polling the location service APIs of the user's device), while the second function can query the weather in a given location (e.g., by making an API call to some third-party weather service). You want chat completions to be able to call these functions if the model deems it necessary to have this information in order to respond to a user request. For illustrative purposes, consider the following:

```csharp
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
```

Start by creating two instances of the `ChatFunctionToolDefinition` class to describe each function:

```csharp
private const string GetCurrentLocationFunctionName = "get_current_location";

private const string GetCurrentWeatherFunctionName = "get_current_weather";

private static readonly ChatFunctionToolDefinition getCurrentLocationFunction = new()
{
    Name = GetCurrentLocationFunctionName,
    Description = "Get the user's current location"
};

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
```

Next, create a `ChatCompletionsOptions` instance and add both function definitions to its `Tools` property. You will pass this instance as an argument in your calls to the `ChatClient`'s `CompleteChat` method.

```csharp
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
```

When the resulting `ChatCompletion` has a `FinishReason` property equal to `ChatFinishReason.ToolCalls`, it means that the model has determined that one or more tools must be called before the assistant can respond appropriately. In those cases, you must first call the function specified in the `ChatCompletion`'s `ToolCalls` and then call the `ChatClient`'s `CompleteChat` method again while passing the function's result as an additional `ChatRequestToolMessage`. Repeat this process as needed.

```csharp
bool requiresAction;

do
{
    requiresAction = false;
    ChatCompletion chatCompletion = client.CompleteChat(messages, options);

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
```

## How to get text embeddings

In this sample, you want to create a trip-planning website that allows customers to write a prompt describing the kind of hotel that they are looking for and then offers hotel recommendations that closely match this description. To achieve this, it is possible to use text embeddings to measure the relatedness of text strings. In summary, you can get embeddings of the hotel descriptions, store them in a vector database, and use them to build a search index that you can query using the embedding of a given customer's prompt.

To get a text embedding, start by adding the corresponding `using` statement:

```csharp
using OpenAI.Embeddings;
```

Next, instantiate the `EmbeddingClient` and call its `GenerateEmbedding` method by passing the text input as an argument:

```csharp
EmbeddingClient client = new("text-embedding-3-small", "<insert your OpenAI API key here>");

string description =
    "Best hotel in town if you like luxury hotels. They have an amazing infinity pool, a spa,"
    + " and a really helpful concierge. The location is perfect -- right downtown, close to all "
    + " the tourist attractions. We highly recommend this hotel.";

Embedding embedding = client.GenerateEmbedding(description);
ReadOnlyMemory<float> vector = embedding.Vector;
```

Notice that the resulting embedding is a list (also called a vector) of floating point numbers represented as an instance of `ReadOnlyMemory<float>`. By default, the length of the embedding vector will be 1536 when using the `text-embedding-3-small` model or 3072 when using the `text-embedding-3-large` model. Generally, larger embeddings perform better, but using them also tends to cost more in terms of compute, memory, and storage. You can reduce the dimensions of the embedding by creating an instance of the `EmbeddingOptions` class, setting the `Dimensions` property, and passing it as an argument in your call to the `GenerateEmbedding` method:

```csharp
EmbeddingOptions options = new() { Dimensions = 512 };

Embedding embedding = client.GenerateEmbedding(description, options);
```

## How to generate images

In this sample, you want to build an app to help interior designers prototype new ideas based on the latest design trends. As part of the creative process, an interior designer can use this app to generate images for inspiration simply by describing the scene in their head as a prompt. As expected, high-quality, strikingly dramatic images with finer details deliver the best results for this application.

To generate an image, start by adding the corresponding `using` statement:

```csharp
using OpenAI.Images;
```

Next, instantiate the `ImageClient`:

```csharp
ImageClient client = new("dall-e-3", "<insert your OpenAI API key here>");
```

To tailor the image generation to your specific needs, create an instance of the `ImageGenerationOptions` class and set the `Quality`, `Size`, and `Style` properties accordingly. Note that you can also set the `ResponseFormat` property of `ImageGenerationOptions` to `ImageResponseFormat.Bytes` in order to receive the resulting PNG as `BinaryData` if this is convenient for your use case.

```csharp
string prompt = "The concept for a living room that blends Scandinavian simplicity with Japanese minimalism for"
    + " a serene and cozy atmosphere. It's a space that invites relaxation and mindfulness, with natural light"
    + " and fresh air. Using neutral tones, including colors like white, beige, gray, and black, that create a"
    + " sense of harmony. Featuring sleek wood furniture with clean lines and subtle curves to add warmth and"
    + " elegance. Plants and flowers in ceramic pots adding color and life to a space. They can serve as focal"
    + " points, creating a connection with nature. Soft textiles and cushions in organic fabrics adding comfort"
    + " and softness to a space. They can serve as accents, adding contrast and texture.";

ImageGenerationOptions options = new()
{
    Quality = ImageQuality.High,
    Size = ImageSize.Size1792x1024,
    Style = ImageStyle.Vivid,
    ResponseFormat = ImageResponseFormat.Bytes
};
```

Finally, call the `ImageClient`'s `GenerateImage` method by passing the prompt and the `ImageGenerationOptions` instance as arguments:

```csharp
GeneratedImage image = client.GenerateImage(prompt, options);
BinaryData bytes = image.ImageBytes;
```

For illustrative purposes, you could save the generated image to local storage:

```csharp
using FileStream stream = File.OpenWrite($"{ Guid.NewGuid() }.png");
bytes.ToStream().CopyTo(stream);
```

## How to use assistants with retrieval augmented generation (RAG)

In this sample, you have a JSON document with the monthly sales information of different products, and you want to build an assistant capable of analyzing it and answering questions about it.

Start by adding the following `using` statements:

```csharp
using OpenAI;
using OpenAI.Assistants;
using OpenAI.Files;
```

Create an instance of the `OpenAIClient` class and use it to instantiate a `FileClient` and an `AssistantClient`:

```csharp
OpenAIClient openAIClient = new("<insert your OpenAI API key here>");
FileClient fileClient = openAIClient.GetFileClient();
AssistantClient assistantClient = openAIClient.GetAssistantClient();
```

Here is an example of what the JSON document might look like:

```csharp
BinaryData document = BinaryData.FromString("""
    {
        "description": "This document contains the sale history data for Contoso products.",
        "sales": [
            {
                "month": "January",
                "by_product": {
                    "113043": 15,
                    "113045": 12,
                    "113049": 2
                }
            },
            {
                "month": "February",
                "by_product": {
                    "113045": 22
                }
            },
            {
                "month": "March",
                "by_product": {
                    "113045": 16,
                    "113055": 5
                }
            }
        ]
    }
    """);
```

Upload this document to OpenAI using the `FileClient`'s `UploadFile` method:

```csharp
OpenAIFileInfo openAIFileInfo = fileClient.UploadFile(document, "MonthlySales.json", OpenAIFilePurpose.Assistants);
```

Create an instance of the `AssistantCreationOptions` class and use it to define the assistant that you want to build. Make sure to include:

1. The ID of the JSON document that you just uploaded in the `FileIds` property
2. An instance of the `RetrievalToolDefinition` class in the `Tools` property

Optionally, you can also include an instance of the `CodeInterpreterToolDefinition` class in the `Tools` property and instruct the assistant via the `Instructions` property to use it to generate data visualizations when prompted.

```csharp
AssistantCreationOptions assistantOptions = new()
{
    Name = "Example: Contoso sales RAG",
    Instructions =
        "You are an assistant that looks up sales data and helps visualize the information based"
        + " on user queries. When asked to generate a graph, chart, or other visualization, use"
        + " the code interpreter tool to do so.",
    FileIds = { openAIFileInfo.Id },
    Tools =
    {
        new RetrievalToolDefinition(),
        new CodeInterpreterToolDefinition(),
    }
};
```

Now, create the assistant using the `AssistantClient`'s `CreateAssistant` method:

```csharp
Assistant assistant = assistantClient.CreateAssistant("gpt-4-1106-preview", assistantOptions);
```

Next, create a new thread. For illustrative purposes, you could include an initial user message asking about the sales information of a given product and then use the `AssistantClient`'s `CreateThreadAndRun` method to get it started:

```csharp
ThreadCreationOptions threadOptions = new()
{
    Messages =
    {
        new ThreadInitializationMessage(
            MessageRole.User,
            "How well did product 113045 sell in February? Graph its trend over time."),
    }
};

ThreadRun threadRun = assistantClient.CreateThreadAndRun(assistant.Id, threadOptions);
```

Poll the status of the run until it is no longer queued or in progress:

```csharp
do
{
    Thread.Sleep(TimeSpan.FromSeconds(1));
    threadRun = assistantClient.GetRun(threadRun.ThreadId, threadRun.Id);
} while (threadRun.Status == RunStatus.Queued || threadRun.Status == RunStatus.InProgress);
```

If everything went well, the terminal status of the run will be `RunStatus.CompletedSuccessfully`.

Finally, you can use the `AssistantClient`'s `GetMessages` method to retrieve the messages associated with this thread, which now include the responses from the assistant to the initial user message:

```csharp
ListQueryPage<ThreadMessage> messages = assistantClient.GetMessages(threadRun.ThreadId);
```

For illustrative purposes, you could print the messages to the console and also save any images produced by the assistant to local storage:

```csharp
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
        else if (contentItem is MessageImageFileContent imageFileContent)
        {
            OpenAIFileInfo imageInfo = fileClient.GetFileInfo(imageFileContent.FileId);
            BinaryData imageBytes = fileClient.DownloadFile(imageFileContent.FileId);
            using FileStream stream = File.OpenWrite($"{ imageInfo.Filename }.png");
            imageBytes.ToStream().CopyTo(stream);

            Console.WriteLine($"<{ imageInfo.Filename }.png>");
        }
    }
    Console.WriteLine();
}
```

And it would yield something like this:

```text
[USER]:
How well did product 113045 sell in February? Graph its trend over time.
    
[ASSISTANT]:
<image: 24dd7170-5723-48c3-9cca-365bed5f5251.png>
Product 113045 sold 22 units in February. Here is the trend graph showing its sales over the months of 
January, February, and March.
```

## Advanced scenarios

### Using protocol methods

The client library includes model types—convenience classes that map to the request and response bodies of the REST API. The client methods that receive and return model types can be called here _convenience methods_. In addition to these, the clients also expose overloads of these methods that mirror the request and response bodies directly. Those methods are called here _protocol methods_, as they provide more direct access to the REST protocol.

For example, to use the protocol method variant of the `ChatClient`'s `CompleteChat` method, pass the request body as a `BinaryContent` object:

```csharp
BinaryData input = BinaryData.FromString("""
    {
       "model": "gpt-3.5-turbo",
       "messages": [
           {
               "role": "user",
               "content": "How does AI work? Explain it in simple terms."
           }
       ]
    }
    """);

using BinaryContent content = BinaryContent.Create(input);
ClientResult result = client.CompleteChat(content);
BinaryData output = result.GetRawResponse().Content;

using JsonDocument outputAsJson = JsonDocument.Parse(output.ToString());
string message = outputAsJson.RootElement
    .GetProperty("choices")[0]
    .GetProperty("message")
    .GetProperty("content")
    .GetString();
```

Notice how you can then call the resulting `ClientResult`'s `GetRawResponse` method and retrieve the response body as `BinaryData` via the `PipelineResponse`'s `Content` property.

### Automatically retrying errors

By default, the client classes will automatically retry the following errors up to three additional times using exponential backoff:

- 408 Request Timeout
- 429 Too Many Requests
- 500 Internal Server Error
- 502 Bad Gateway
- 503 Service Unavailable
- 504 Gateway Timeout

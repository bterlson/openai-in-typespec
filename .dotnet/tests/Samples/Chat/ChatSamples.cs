using NUnit.Framework;
using OpenAI.Audio;
using OpenAI.Chat;
using System;
using System.ClientModel;
using System.Text.Json;
using System.Threading.Tasks;

namespace OpenAI.Tests.Examples;

public partial class ChatSamples
{
    [Test]
    [Ignore("Compilation validation only")]
    public void CreateChatClient()
    {
        ChatClient client = new("gpt-3.5-turbo", "<insert your OpenAI API key here>");
    }

    [Test]
    [Ignore("Compilation validation only")]
    public void CreateClients()
    {
        OpenAIClient client = new("<insert your OpenAI API key here>");
        AudioClient ttsClient = client.GetAudioClient("tts-1");
        AudioClient whisperClient = client.GetAudioClient("whisper-1");
    }

    [Test]
    [Ignore("Compilation validation only")]
    public void HelloWorldChat()
    {
        ChatClient client = new("gpt-3.5-turbo", Environment.GetEnvironmentVariable("OpenAIClient_KEY"));

        ChatCompletion chatCompletion = client.CompleteChat("How does AI work? Explain it in simple terms.");

        Console.WriteLine($"[ASSISTANT]:");
        Console.WriteLine($"{ chatCompletion.Content }");
    }

    [Test]
    [Ignore("Compilation validation only")]
    public void HelloWorldChatProtocol()
    {
        ChatClient client = new("gpt-3.5-turbo", Environment.GetEnvironmentVariable("OpenAIClient_KEY"));

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

        ClientResult result = client.CompleteChat(BinaryContent.Create(input));
        BinaryData output = result.GetRawResponse().Content;

        using JsonDocument outputAsJson = JsonDocument.Parse(output.ToString());
        string message = outputAsJson.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        Console.WriteLine($"[ASSISTANT]:");
        Console.WriteLine($"{ message }");
    }


    [Test]
    [Ignore("Compilation validation only")]
    public async void HelloWorldChatAsync()
    {
        ChatClient client = new("gpt-3.5-turbo", Environment.GetEnvironmentVariable("OpenAIClient_KEY"));

        ChatCompletion chatCompletion = await client.CompleteChatAsync("How does AI work? Explain it in simple terms.");

        Console.WriteLine($"[ASSISTANT]: {chatCompletion.Content}");
    }

    [Test]
    [Ignore("Compilation validation only")]
    public async Task HelloWorldStreamingChat()
    {
        ChatClient client = new("gpt-3.5-turbo", Environment.GetEnvironmentVariable("OpenAIClient_KEY"));

        StreamingClientResult<StreamingChatUpdate> result =
            client.CompleteChatStreaming("How does AI work? Explain it in simple terms.");

        Console.WriteLine("[ASSISTANT]: ");

        await foreach (StreamingChatUpdate chatUpdate in result)
        {
            Console.Write(chatUpdate.ContentUpdate);
        }
    }

    [Test]
    [Ignore("Compilation validation only")]
    public void ChatWithImage(Uri imageUri = null)
    {
        ChatClient client = new("gpt-4-vision-preview", Environment.GetEnvironmentVariable("OpenAIClient_KEY"));

        ChatCompletion chatCompletion = client.CompleteChat(
            [
                new ChatRequestUserMessage(
                    "Describe this image for me",
                    ChatMessageContent.CreateImage(imageUri)),
            ]);
    }

    [Test]
    [Ignore("Compilation validation only")]
    public void ChatWithTools()
    {
        ChatClient client = new("gpt-3.5-turbo", Environment.GetEnvironmentVariable("OpenAIClient_KEY"));

        ChatFunctionToolDefinition getSecretWordTool = new()
        {
            Name = "get_secret_word",
            Description = "gets the arbitrary secret word from the caller"
        };
    }
}

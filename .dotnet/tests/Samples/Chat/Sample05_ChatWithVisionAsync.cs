using NUnit.Framework;
using OpenAI.Chat;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OpenAI.Samples
{
    public partial class ChatSamples
    {
        [Test]
        [Ignore("Compilation validation only")]
        public async Task Sample05_ChatWithVisionAsync(Uri imageUri = null)
        {
            ChatClient client = new("gpt-4-vision-preview", Environment.GetEnvironmentVariable("OpenAIClient_KEY"));

            List<ChatRequestMessage> messages = [
                new ChatRequestUserMessage(
                    "Describe this image for me",
                    ChatMessageContent.CreateImage(imageUri))
            ];

            ChatCompletion chatCompletion = await client.CompleteChatAsync(messages);
        }
    }
}
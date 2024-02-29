using NUnit.Framework;
using OpenAI.Chat;
using System;
using System.Threading.Tasks;

namespace OpenAI.Samples
{
    public partial class ChatSamples
    {
        [Test]
        [Ignore("Compilation validation only")]
        public async Task Sample01_SimpleChatAsync()
        {
            ChatClient client = new("gpt-3.5-turbo", Environment.GetEnvironmentVariable("OpenAIClient_KEY"));

            ChatCompletion chatCompletion = await client.CompleteChatAsync("How does AI work? Explain it in simple terms.");

            Console.WriteLine($"[ASSISTANT]:");
            Console.WriteLine($"{chatCompletion.Content}");
        }
    }
}

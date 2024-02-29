using NUnit.Framework;
using OpenAI.Chat;
using System;

namespace OpenAI.Samples
{
    public partial class ChatSamples
    {
        [Test]
        [Ignore("Compilation validation only")]
        public void Sample01_SimpleChat()
        {
            ChatClient client = new("gpt-3.5-turbo", Environment.GetEnvironmentVariable("OpenAIClient_KEY"));

            ChatCompletion chatCompletion = client.CompleteChat("How does AI work? Explain it in simple terms.");

            Console.WriteLine($"[ASSISTANT]:");
            Console.WriteLine($"{chatCompletion.Content}");
        }
    }
}

using NUnit.Framework;
using OpenAI.Assistants;
using System;
using System.Threading.Tasks;

namespace OpenAI.Samples
{
    public partial class AssistantSamples
    {
        [Test]
        [Ignore("Compilation validation only")]
        public async Task Sample02_ListAssistantsWithPaginationAsync()
        {
            AssistantClient client = new(Environment.GetEnvironmentVariable("OpenAIClient_KEY"));

            string latestId = null;
            bool continueQuery = true;
            int count = 0;

            while (continueQuery)
            {
                ListQueryPage<Assistant> pagedAssistants = await client.GetAssistantsAsync(previousAssistantId: latestId);

                foreach (Assistant assistant in pagedAssistants)
                {
                    Console.WriteLine($"[{count,3}] {assistant.Id} {assistant.CreatedAt:s} {assistant.Name}");

                    latestId = assistant.Id;
                    count++;
                }

                continueQuery = pagedAssistants.HasMore;
            }
        }
    }
}

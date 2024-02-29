using NUnit.Framework;
using OpenAI.Assistants;
using OpenAI.Files;
using System;
using System.IO;
using System.Threading;

namespace OpenAI.Samples
{
    public partial class AssistantSamples
    {
        [Test]
        [Ignore("Compilation validation only")]
        public void Sample01_RetrievalAugmentedGeneration()
        {
            OpenAIClient openAIClient = new(Environment.GetEnvironmentVariable("OpenAIClient_KEY"));
            FileClient fileClient = openAIClient.GetFileClient();
            AssistantClient assistantClient = openAIClient.GetAssistantClient();

            // First, let's contrive a document we'll use retrieval with and upload it.
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

            OpenAIFileInfo openAIFileInfo = fileClient.UploadFile(document, "test-rag-file-delete-me.json", OpenAIFilePurpose.Assistants);

            // Now, we'll create a client intended to help with that data
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
                },
                Metadata = { ["test_key_delete_me"] = "true" },
            };

            Assistant assistant = assistantClient.CreateAssistant("gpt-4-1106-preview", assistantOptions);

            // Now we'll create a thread with a user query about the data already associated with the assistant, then run it
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

            // Check back to see when the run is done
            do
            {
                Thread.Sleep(TimeSpan.FromSeconds(1));
                threadRun = assistantClient.GetRun(threadRun.ThreadId, threadRun.Id);
            } while (threadRun.Status == RunStatus.Queued || threadRun.Status == RunStatus.InProgress);

            // Finally, we'll print out the full history for the thread that includes the augmented generation
            ListQueryPage<ThreadMessage> messages = assistantClient.GetMessages(threadRun.ThreadId);

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
                        using FileStream stream = File.OpenWrite($"{imageInfo.Filename}.png");
                        imageBytes.ToStream().CopyTo(stream);

                        Console.WriteLine($"<image: {imageInfo.Filename}.png>");
                    }
                }
                Console.WriteLine();
            }
        }
    }
}

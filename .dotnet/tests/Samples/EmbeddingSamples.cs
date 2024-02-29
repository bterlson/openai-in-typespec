using NUnit.Framework;
using OpenAI.Embeddings;
using System;
using System.ClientModel;
using System.Collections.Generic;

namespace OpenAI.Tests.Examples;

public partial class EmbeddingSamples
{
    [Test]
    [Ignore("Compilation validation only")]
    public void CreateEmbeddingClient()
    {
        EmbeddingClient client = new("text-embedding-3-small", new ApiKeyCredential("<insert your OpenAI API key here>"));
    }

    [Test]
    [Ignore("Compilation validation only")]
    public void SimpleEmbedding()
    {
        EmbeddingClient client = new("text-embedding-3-small", Environment.GetEnvironmentVariable("OpenAIClient_KEY"));

        string description =
            "Best hotel in town if you like luxury hotels. They have an amazing infinity pool, a spa,"
            + " and a really helpful concierge. The location is perfect -- right downtown, close to all "
            + " the tourist attractions. We highly recommend this hotel.";

        Embedding embedding = client.GenerateEmbedding(description);
        ReadOnlyMemory<float> vector = embedding.Vector;

        Console.WriteLine($"Dimension: { vector.Length }");
        Console.WriteLine($"Floats: ");
        for (int i = 0; i < vector.Length; i++)
        {
            Console.WriteLine($"  [{i}] = { vector.Span[i] }");
        }
    }

    [Test]
    [Ignore("Compilation validation only")]
    public void SimpleEmbeddingWithOptions()
    {
        EmbeddingClient client = new("text-embedding-3-small", Environment.GetEnvironmentVariable("OpenAIClient_KEY"));

        string description =
            "Best hotel in town if you like luxury hotels. They have an amazing infinity pool, a spa,"
            + " and a really helpful concierge. The location is perfect -- right downtown, close to all "
            + " the tourist attractions. We highly recommend this hotel.";

        EmbeddingOptions options = new() { Dimensions = 512 };

        Embedding embedding = client.GenerateEmbedding(description, options);
        ReadOnlyMemory<float> vector = embedding.Vector;

        Console.WriteLine($"Dimension: {vector.Length}");
        Console.WriteLine($"Floats: ");
        for (int i = 0; i < vector.Length; i++)
        {
            Console.WriteLine($"  [{i}] = {vector.Span[i]}");
        }
    }

    [Test]
    [Ignore("Compilation validation only")]
    public void ComplexEmbedding()
    {
        EmbeddingClient client = new("text-embedding-3-small", Environment.GetEnvironmentVariable("OpenAIClient_KEY"));

        string category = "Luxury";
        string description =
            "Best hotel in town if you like luxury hotels. They have an amazing infinity pool, a spa,"
            + " and a really helpful concierge. The location is perfect -- right downtown, close to all "
            + " the tourist attractions. We highly recommend this hotel.";
        List<string> inputs = [category, description];

        EmbeddingOptions options = new() { Dimensions = 512 };

        EmbeddingCollection collection = client.GenerateEmbeddings(inputs, options);

        foreach (Embedding embedding in collection)
        {
            ReadOnlyMemory<float> vector = embedding.Vector;

            Console.WriteLine($"Dimension: {vector.Length}");
            Console.WriteLine($"Floats: ");
            for (int i = 0; i < vector.Length; i++)
            {
                Console.WriteLine($"  [{i}] = { vector.Span[i] }");
            }

            Console.WriteLine();
        }
    }
}

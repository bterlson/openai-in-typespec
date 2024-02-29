using NUnit.Framework;
using OpenAI.Embeddings;
using System.ClientModel;
using System.Collections.Generic;

namespace OpenAI.Tests.Embeddings;

public partial class EmbeddingClientTests
{
    [Test]
    public void OneEmbedding()
    {
        EmbeddingClient client = new("text-embedding-ada-002");
        ClientResult<Embedding> response = client.GenerateEmbedding("hello, world");
        Assert.That(response.Value, Is.Not.Null);
        Assert.That(response.Value.Index, Is.EqualTo(0));
        Assert.That(response.Value.Usage, Is.Not.Null);
        Assert.That(response.Value.Usage.TotalTokens, Is.GreaterThan(0));
        Assert.That(response.Value.Vector, Is.Not.Null.Or.Empty);
        Assert.That(response.Value.Model, Contains.Substring("ada"));
        float[] array = response.Value.Vector.ToArray();
        Assert.That(array.Length > 100);
    }

    [Test]
    public void SeveralEmbeddings()
    {
        EmbeddingClient client = new("text-embedding-3-small");
        List<string> prompts =
        [
            "Hello, world!",
            "This is a test.",
            "Goodbye!"
        ];
        EmbeddingOptions options = new()
        {
            Dimensions = 456,
        };
        ClientResult<EmbeddingCollection> response = client.GenerateEmbeddings(prompts, options);
        Assert.That(response.Value, Is.Not.Null);
        Assert.That(response.Value.Count, Is.EqualTo(3));
        for (int i = 0; i < response.Value.Count; i++)
        {
            Assert.That(response.Value[i].Index, Is.EqualTo(i));
            Assert.That(response.Value[i].Usage, Is.Not.Null);
            Assert.That(response.Value[i].Usage.TotalTokens, Is.GreaterThan(0));
            Assert.That(response.Value[i].Vector, Is.Not.Null.Or.Empty);
            float[] array = response.Value[i].Vector.ToArray();
            Assert.That(array.Length, Is.GreaterThan(100));
        }
    }
}

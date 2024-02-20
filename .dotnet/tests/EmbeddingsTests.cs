using NUnit.Framework;
using OpenAI.Models;
using System;
using System.ClientModel;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace OpenAI.Tests
{
    public partial class EmbeddingsTests
    {
        [Test]
        public static void GetEmbeddingFromString()
        {
            ApiKeyCredential credential = new ApiKeyCredential(Environment.GetEnvironmentVariable("OpenAIClient_KEY"));
            OpenAIClient client = new(credential);
            Embeddings embeddingsClient = client.GetEmbeddingsClient("text-embedding-3-small");

            string input = "Best hotel in town if you like luxury hotels. They have an amazing infinity pool, a spa,"
                + " and a really helpful concierge. The location is perfect -- right downtown, close to all "
                + " the tourist attractions. We highly recommend this hotel.";

            ClientResult<Embedding> result = embeddingsClient.GenerateEmbedding(input);
            Embedding embedding = result.Value;

            ReadOnlyMemory<float> vector = embedding.EmbeddingAsFloats.Value;
            Assert.IsTrue(vector.Length == 1536);
        }

        [Test]
        public static void GetEmbeddingFromArrayOfTokens()
        {
            ApiKeyCredential credential = new ApiKeyCredential(Environment.GetEnvironmentVariable("OpenAIClient_KEY"));
            OpenAIClient client = new(credential);
            Embeddings embeddingsClient = client.GetEmbeddingsClient("text-embedding-3-small");

            List<int> input = new() { 14809, 9689, 304, 6424, 422, 499, 1093, 19913, 25325, 13, 2435, 617, 459, 8056,
                56010, 7463, 11, 264, 31493, 11, 323, 264, 2216, 11190, 3613, 87103, 13, 578, 3813, 374, 4832, 1198,
                1314, 19441, 11, 3345, 311, 682, 279, 31070, 39591, 13, 1226, 7701, 7079, 420, 9689, 13 };

            ClientResult<Embedding> result = embeddingsClient.GenerateEmbedding(input);
            Embedding embedding = result.Value;

            ReadOnlyMemory<float> vector = embedding.EmbeddingAsFloats.Value;
            Assert.IsTrue(vector.Length == 1536);
        }

        [Test]
        public static void GetEmbeddingsFromArrayOfStrings()
        {
            ApiKeyCredential credential = new ApiKeyCredential(Environment.GetEnvironmentVariable("OpenAIClient_KEY"));
            OpenAIClient client = new(credential);
            Embeddings embeddingsClient = client.GetEmbeddingsClient("text-embedding-3-small");

            List<string> inputs = new() {
                "Luxury",
                "Best hotel in town if you like luxury hotels. They have an amazing infinity pool, a spa,"
                    + " and a really helpful concierge. The location is perfect -- right downtown, close to all "
                    + " the tourist attractions. We highly recommend this hotel."
            };

            ClientResult<EmbeddingCollection> result = embeddingsClient.GenerateEmbeddings(inputs);
            EmbeddingCollection collection = result.Value; // TODO: Make EmbeddingCollection inherit from ReadOnlyCollection<Embedding>.
            IReadOnlyList<Embedding> data = collection.Data;

            ReadOnlyMemory<float> vector0 = data[0].EmbeddingAsFloats.Value;
            Assert.IsTrue(vector0.Length == 1536);

            ReadOnlyMemory<float> vector1 = data[1].EmbeddingAsFloats.Value;
            Assert.IsTrue(vector1.Length == 1536);
        }

        [Test]
        public static void GetEmbeddingsFromArrayOfArraysOfTokens()
        {
            ApiKeyCredential credential = new ApiKeyCredential(Environment.GetEnvironmentVariable("OpenAIClient_KEY"));
            OpenAIClient client = new(credential);
            Embeddings embeddingsClient = client.GetEmbeddingsClient("text-embedding-3-small");

            List<List<int>> inputs = new() {
                new List<int> { 78379, 3431 },
                new List<int> { 14809, 9689, 304, 6424, 422, 499, 1093, 19913, 25325, 13, 2435, 617, 459, 8056,
                    56010, 7463, 11, 264, 31493, 11, 323, 264, 2216, 11190, 3613, 87103, 13, 578, 3813, 374, 4832, 1198,
                    1314, 19441, 11, 3345, 311, 682, 279, 31070, 39591, 13, 1226, 7701, 7079, 420, 9689, 13 }
            };

            ClientResult<EmbeddingCollection> result = embeddingsClient.GenerateEmbeddings(inputs);
            EmbeddingCollection collection = result.Value; // TODO: Make EmbeddingCollection inherit from ReadOnlyCollection<Embedding>.
            IReadOnlyList<Embedding> data = collection.Data;

            ReadOnlyMemory<float> vector0 = data[0].EmbeddingAsFloats.Value;
            Assert.IsTrue(vector0.Length == 1536);

            ReadOnlyMemory<float> vector1 = data[1].EmbeddingAsFloats.Value;
            Assert.IsTrue(vector1.Length == 1536);
        }
    }
}

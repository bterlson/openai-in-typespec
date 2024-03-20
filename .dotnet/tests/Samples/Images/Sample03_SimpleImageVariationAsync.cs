using NUnit.Framework;
using OpenAI.Images;
using System;
using System.IO;
using System.Threading.Tasks;

namespace OpenAI.Samples
{
    public partial class ImageSamples
    {
        [Test]
        [Ignore("Compilation validation only")]
        public async Task Sample03_SimpleImageVariationAsync()
        {
            ImageClient client = new("dall-e-2", Environment.GetEnvironmentVariable("OpenAIClient_KEY"));

            string imagePath = Path.Combine("Assets", "variation_sample_image.png");
            BinaryData imageBytes = BinaryData.FromBytes(File.ReadAllBytes(imagePath));

            ImageVariationOptions options = new()
            {
                Size = ImageSize.Size1024x1024,
                ResponseFormat = ImageResponseFormat.Bytes
            };

            GeneratedImageCollection image = await client.GenerateImageVariationsAsync(imageBytes, "variation_sample_image.png", 1, options);
            BinaryData bytes = image[0].ImageBytes;

            using FileStream stream = File.OpenWrite($"{Guid.NewGuid()}.png");
            bytes.ToStream().CopyTo(stream);
        }
    }
}

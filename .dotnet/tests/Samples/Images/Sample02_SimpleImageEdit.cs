using NUnit.Framework;
using OpenAI.Images;
using System;
using System.IO;

namespace OpenAI.Samples
{
    public partial class ImageSamples
    {
        [Test]
        [Ignore("Compilation validation only")]
        public void Sample02_SimpleImageEdit()
        {
            ImageClient client = new("dall-e-2", Environment.GetEnvironmentVariable("OpenAIClient_KEY"));

            string imagePath = Path.Combine("Assets", "edit_sample_image.png");
            BinaryData imageBytes = BinaryData.FromBytes(File.ReadAllBytes(imagePath));

            string prompt = "An inflatable flamingo float in a pool";

            string maskPath = Path.Combine("Assets", "edit_sample_mask.png");
            BinaryData maskBytes = BinaryData.FromBytes(File.ReadAllBytes(maskPath));

            ImageEditOptions options = new()
            {
                MaskBytes = maskBytes,
                Size = ImageSize.Size1024x1024,
                ResponseFormat = ImageResponseFormat.Bytes
            };

            GeneratedImageCollection image = client.GenerateImageEdits(imageBytes, prompt, 1, options);
            BinaryData bytes = image[0].ImageBytes;

            using FileStream stream = File.OpenWrite($"{Guid.NewGuid()}.png");
            bytes.ToStream().CopyTo(stream);
        }
    }
}

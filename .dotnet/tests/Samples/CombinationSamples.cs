using NUnit.Framework;
using OpenAI.Audio;
using OpenAI.Chat;
using OpenAI.Images;
using System;
using System.ClientModel;
using System.IO;
using System.Threading.Tasks;

namespace OpenAI.Tests.Examples;

public partial class CombinationSamples
{
    [Test]
    [Ignore("Compilation validation")]
    public void AlpacaArtAssessor()
    {
        // First, we create an image using dall-e-3:
        ImageClient imageClient = new("dall-e-3");
        ClientResult<GeneratedImage> imageResult = imageClient.GenerateImage(
            "a majestic alpaca on a mountain ridge, backed by an expansive blue sky accented with sparse clouds",
            new()
            {
                Style = ImageStyle.Vivid,
                Quality = ImageQuality.High,
                Size = ImageSize.Size1792x1024,
            });
        GeneratedImage imageGeneration = imageResult.Value;
        Console.WriteLine($"Majestic alpaca available at:\n{imageGeneration.ImageUri.AbsoluteUri}");

        // Now, we'll ask a cranky art critic to evaluate the image using gpt-4-vision-preview:
        ChatClient chatClient = new("gpt-4-vision-preview");
        ClientResult<ChatCompletion> chatResult = chatClient.CompleteChat(
            [
                new ChatRequestSystemMessage("Assume the role of a cranky art critic. When asked to describe or "
                    + "evaluate imagery, focus on criticizing elements of subject, composition, and other details."),
                new ChatRequestUserMessage(
                    "describe the following image in a few sentences",
                    ChatMessageContent.CreateImage(imageGeneration.ImageUri)),
            ],
            new ChatCompletionOptions()
            {
                MaxTokens = 2048,
            });
        string chatResponseText = chatResult.Value.Content;
        Console.WriteLine($"Art critique of majestic alpaca:\n{chatResponseText}");

        // Finally, we'll get some text-to-speech for that critical evaluation using tts-1-hd:
        AudioClient audioClient = new("tts-1-hd");
        ClientResult<BinaryData> ttsResult = audioClient.GenerateSpeechFromText(
            text: chatResponseText,
            TextToSpeechVoice.Fable,
            new TextToSpeechOptions()
            {
                SpeedMultiplier = 0.9f,
                ResponseFormat = AudioDataFormat.Opus,
            });
        FileInfo ttsFileInfo = new($"{chatResult.Value.Id}.opus");
        using (FileStream ttsFileStream = ttsFileInfo.Create())
        using (BinaryWriter ttsFileWriter = new(ttsFileStream))
        {
            ttsFileWriter.Write(ttsResult.Value);
        }
        Console.WriteLine($"Alpaca evaluation audio available at:\n{new Uri(ttsFileInfo.FullName).AbsoluteUri}");
    }

    [Test]
    [Ignore("Compilation validation")]
    public async Task CuriousCreatureCreator()
    {
        // First, we'll use gpt-4 to have a creative helper imagine a twist on a household pet
        ChatClient creativeWriterClient = new("gpt-4");
        ClientResult<ChatCompletion> creativeWriterResult = creativeWriterClient.CompleteChat(
            [
                new ChatRequestSystemMessage("You're a creative helper that specializes in brainstorming designs for concepts that fuse ordinary, mundane items with a fantastical touch. In particular, you can provide good one-paragraph descriptions of concept images."),
                new ChatRequestUserMessage("Imagine a household pet. Now add in a subtle touch of magic or 'different'. What do you imagine? Provide a one-paragraph description of a picture of this new creature, focusing on the details of the imagery such that it'd be suitable for creating a picture."),
            ],
            new ChatCompletionOptions()
            {
                MaxTokens = 2048,
            });
        string description = creativeWriterResult.Value.Content;
        Console.WriteLine($"Creative helper's creature description:\n{description}");

        // Asynchronously, in parallel to the next steps, we'll get the creative description in the voice of Onyx
        AudioClient ttsClient = new("tts-1-hd");
        Task<ClientResult<BinaryData>> imageDescriptionAudioTask = ttsClient.GenerateSpeechFromTextAsync(
            description,
            TextToSpeechVoice.Onyx,
            new TextToSpeechOptions()
            {
                SpeedMultiplier = 1.1f,
                ResponseFormat = AudioDataFormat.Opus,
            });
        _ = Task.Run(async () =>
        {
            ClientResult<BinaryData> audioResult = await imageDescriptionAudioTask;
            FileInfo audioFileInfo = new FileInfo($"{creativeWriterResult.Value.Id}-description.opus");
            using FileStream fileStream = audioFileInfo.Create();
            using BinaryWriter fileWriter = new(fileStream);
            fileWriter.Write(audioResult.Value);
            Console.WriteLine($"Spoken description available at:\n{new Uri(audioFileInfo.FullName).AbsoluteUri}");
        });

        // Meanwhile, we'll use dall-e-3 to generate a rendition of our LLM artist's vision
        ImageClient imageGenerationClient = new("dall-e-3");
        ClientResult<GeneratedImage> imageGenerationResult = await imageGenerationClient.GenerateImageAsync(
            description,
            new ImageGenerationOptions()
            {
                Size = ImageSize.Size1792x1024,
                Quality = ImageQuality.High,
            });
        Uri imageLocation = imageGenerationResult.Value.ImageUri;
        Console.WriteLine($"Creature image available at:\n{imageLocation.AbsoluteUri}");

        // Now, we'll use gpt-4-vision-preview to get a hopelessly taken assessment from a usually exigent art connoisseur
        ChatClient imageCriticClient = new("gpt-4-vision-preview");
        ClientResult<ChatCompletion> criticalAppraisalResult = await imageCriticClient.CompleteChatAsync(
            [
                new ChatRequestSystemMessage("Assume the role of an art critic. Although usually cranky and occasionally even referred to as a 'curmudgeon', you're somehow entirely smitten with the subject presented to you and, despite your best efforts, can't help but lavish praise when you're asked to appraise a provided image."),
                new ChatRequestUserMessage(
                    "Evaluate this image for me. What is it, and what do you think of it?",
                    ChatMessageContent.CreateImage(imageLocation)),
            ],
            new ChatCompletionOptions()
            {
                MaxTokens = 2048,
            });
        string appraisal = criticalAppraisalResult.Value.Content;
        Console.WriteLine($"Critic's appraisal:\n{appraisal}");

        // Finally, we'll get that art expert's laudations in the voice of Fable
        ClientResult<BinaryData> appraisalAudioResult = await ttsClient.GenerateSpeechFromTextAsync(
            appraisal,
            TextToSpeechVoice.Fable,
            new TextToSpeechOptions()
            {
                ResponseFormat = AudioDataFormat.Opus,
                SpeedMultiplier = 0.9f,
            });
        FileInfo criticAudioFileInfo = new($"{criticalAppraisalResult.Value.Id}-appraisal.opus");
        using (FileStream criticStream = criticAudioFileInfo.Create())
        using (BinaryWriter criticFileWriter = new(criticStream))
        {
            criticFileWriter.Write(appraisalAudioResult.Value);
        }
        Console.WriteLine($"Critical appraisal available at:\n{new Uri(criticAudioFileInfo.FullName).AbsoluteUri}");
    }
}

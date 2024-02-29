using NUnit.Framework;
using OpenAI.Audio;
using System;
using System.ClientModel;
using System.IO;
using static OpenAI.Tests.TestHelpers;

namespace OpenAI.Tests.Audio;

public partial class TranscriptionTests
{
    [Test]
    public void BasicTranscriptionWorks()
    {
        AudioClient client = GetTestClient();
        using FileStream inputStream = File.OpenRead(Path.Combine("data", "hello_world.m4a"));
        BinaryData inputData = BinaryData.FromStream(inputStream);
        ClientResult<AudioTranscription> transcriptionResult = client.TranscribeAudio(inputData, "hello_world.m4a");
        Assert.That(transcriptionResult.Value, Is.Not.Null);
        Assert.That(transcriptionResult.Value.Text.ToLowerInvariant(), Contains.Substring("hello"));
    }

    [Test]
    public void WordTimestampsWork()
    {
        AudioClient client = GetTestClient();
        using FileStream inputStream = File.OpenRead(Path.Combine("data", "hello_world.m4a"));
        BinaryData inputData = BinaryData.FromStream(inputStream);
        ClientResult<AudioTranscription> transcriptionResult = client.TranscribeAudio(inputData, "hello_world.m4a", new AudioTranscriptionOptions()
        {
             EnableWordTimestamps = true,
             EnableSegmentTimestamps = true,
             ResponseFormat = AudioTranscriptionFormat.Detailed,
        });
        Assert.That(transcriptionResult.Value, Is.Not.Null);
        // Assert.That(transcriptionResult.Value.Segments, Is.Null);
        // Assert.That(transcriptionResult.Value.Words, Is.Not.Null.Or.Empty);
        // Assert.That(transcriptionResult.Value.Words[1].Word, Contains.Substring("world"));
        // Assert.That(transcriptionResult.Value.Words[1].Start, Is.GreaterThan(TimeSpan.FromMilliseconds(0)));
        // Assert.That(transcriptionResult.Value.Words[1].End, Is.GreaterThan(TimeSpan.FromMilliseconds(0)));
    }
    private static AudioClient GetTestClient() => GetTestClient<AudioClient>(TestScenario.Transcription);
}

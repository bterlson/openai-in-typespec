using OpenAI.ClientShared.Internal;
using System;
using System.ClientModel;
using System.ClientModel.Primitives;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace OpenAI.Audio;

/// <summary> The service client for OpenAI audio operations. </summary>
public partial class AudioClient
{
    private readonly OpenAIClientConnector _clientConnector;
    private Internal.Audio Shim => _clientConnector.InternalClient.GetAudioClient();

    /// <summary>
    /// Initializes a new instance of <see cref="AudioClient"/>, used for audio operation requests. 
    /// </summary>
    /// <remarks>
    /// <para>
    ///     If an endpoint is not provided, the client will use the <c>OPENAI_ENDPOINT</c> environment variable if it
    ///     defined and otherwise use the default OpenAI v1 endpoint.
    /// </para>
    /// <para>
    ///    If an authentication credential is not defined, the client use the <c>OPENAI_API_KEY</c> environment variable
    ///    if it is defined.
    /// </para>
    /// </remarks>
    /// <param name="endpoint">The connection endpoint to use.</param>
    /// <param name="model">The model name for audio operations that the client should use.</param>
    /// <param name="credential">The API key used to authenticate with the service endpoint.</param>
    /// <param name="options">Additional options to customize the client.</param>
    public AudioClient(Uri endpoint, string model, ApiKeyCredential credential, OpenAIClientOptions options = null)
    {
        _clientConnector = new(model, endpoint, credential, options);
    }

    /// <summary>
    /// Initializes a new instance of <see cref="AudioClient"/>, used for audio operation requests. 
    /// </summary>
    /// <remarks>
    /// <para>
    ///     If an endpoint is not provided, the client will use the <c>OPENAI_ENDPOINT</c> environment variable if it
    ///     defined and otherwise use the default OpenAI v1 endpoint.
    /// </para>
    /// <para>
    ///    If an authentication credential is not defined, the client use the <c>OPENAI_API_KEY</c> environment variable
    ///    if it is defined.
    /// </para>
    /// </remarks>
    /// <param name="endpoint">The connection endpoint to use.</param>
    /// <param name="model">The model name for audio operations that the client should use.</param>
    /// <param name="options">Additional options to customize the client.</param>
    public AudioClient(Uri endpoint, string model, OpenAIClientOptions options = null)
        : this(endpoint, model, credential: null, options)
    { }

    /// <summary>
    /// Initializes a new instance of <see cref="AudioClient"/>, used for audio operation requests. 
    /// </summary>
    /// <remarks>
    /// <para>
    ///     If an endpoint is not provided, the client will use the <c>OPENAI_ENDPOINT</c> environment variable if it
    ///     defined and otherwise use the default OpenAI v1 endpoint.
    /// </para>
    /// <para>
    ///    If an authentication credential is not defined, the client use the <c>OPENAI_API_KEY</c> environment variable
    ///    if it is defined.
    /// </para>
    /// </remarks>
    /// <param name="model">The model name for audio operations that the client should use.</param>
    /// <param name="credential">The API key used to authenticate with the service endpoint.</param>
    /// <param name="options">Additional options to customize the client.</param>
    public AudioClient(string model, ApiKeyCredential credential, OpenAIClientOptions options = null)
        : this(endpoint: null, model, credential, options)
    { }

    /// <summary>
    /// Initializes a new instance of <see cref="AudioClient"/>, used for audio operation requests. 
    /// </summary>
    /// <remarks>
    /// <para>
    ///     If an endpoint is not provided, the client will use the <c>OPENAI_ENDPOINT</c> environment variable if it
    ///     defined and otherwise use the default OpenAI v1 endpoint.
    /// </para>
    /// <para>
    ///    If an authentication credential is not defined, the client use the <c>OPENAI_API_KEY</c> environment variable
    ///    if it is defined.
    /// </para>
    /// </remarks>
    /// <param name="model">The model name for audio operations that the client should use.</param>
    /// <param name="options">Additional options to customize the client.</param>
    public AudioClient(string model, OpenAIClientOptions options = null)
        : this(endpoint: null, model, credential: null, options)
    { }

    /// <summary>
    /// Creates text-to-speech audio that reflects the specified voice speaking the provided input text.
    /// </summary>
    /// <remarks>
    /// Unless otherwise specified via <see cref="TextToSpeechOptions.ResponseFormat"/>, the <c>mp3</c> format of
    /// <see cref="AudioDataFormat.Mp3"/> will be used for the generated audio.
    /// </remarks>
    /// <param name="text"> The text for the voice to speak. </param>
    /// <param name="voice"> The voice to use. </param>
    /// <param name="options"> Additional options to control the text-to-speech operation. </param>
    /// <returns>
    ///     A result containing generated, spoken audio in the specified output format.
    ///     Unless otherwise specified via <see cref="TextToSpeechOptions.ResponseFormat"/>, the <c>mp3</c> format of
    ///     <see cref="AudioDataFormat.Mp3"/> will be used for the generated audio.
    /// </returns>
    public virtual ClientResult<BinaryData> GenerateSpeechFromText(
        string text,
        TextToSpeechVoice voice,
        TextToSpeechOptions options = null)
    {
        Internal.Models.CreateSpeechRequest request = CreateInternalTtsRequest(text, voice, options);
        return Shim.CreateSpeech(request);
    }

    /// <summary>
    /// Creates text-to-speech audio that reflects the specified voice speaking the provided input text.
    /// </summary>
    /// <remarks>
    /// Unless otherwise specified via <see cref="TextToSpeechOptions.ResponseFormat"/>, the <c>mp3</c> format of
    /// <see cref="AudioDataFormat.Mp3"/> will be used for the generated audio.
    /// </remarks>
    /// <param name="text"> The text for the voice to speak. </param>
    /// <param name="voice"> The voice to use. </param>
    /// <param name="options"> Additional options to control the text-to-speech operation. </param>
    /// <returns>
    ///     A result containing generated, spoken audio in the specified output format.
    ///     Unless otherwise specified via <see cref="TextToSpeechOptions.ResponseFormat"/>, the <c>mp3</c> format of
    ///     <see cref="AudioDataFormat.Mp3"/> will be used for the generated audio.
    /// </returns>
    public virtual Task<ClientResult<BinaryData>> GenerateSpeechFromTextAsync(
        string text,
        TextToSpeechVoice voice,
        TextToSpeechOptions options = null)
    {
        Internal.Models.CreateSpeechRequest request = CreateInternalTtsRequest(text, voice, options);
        return Shim.CreateSpeechAsync(request);
    }

    public virtual ClientResult<AudioTranscription> TranscribeAudio(BinaryData audioBytes, string filename, AudioTranscriptionOptions options = null)
    {
        PipelineMessage message = CreateInternalTranscriptionRequestMessage(audioBytes, filename, options);
        Shim.Pipeline.Send(message);
        return GetTranscriptionResultFromResponse(message.Response);
    }

    public virtual async Task<ClientResult<AudioTranscription>> TranscribeAudioAsync(BinaryData audioBytes, string filename, AudioTranscriptionOptions options = null)
    {
        PipelineMessage message = CreateInternalTranscriptionRequestMessage(audioBytes, filename, options);
        await Shim.Pipeline.SendAsync(message);
        return GetTranscriptionResultFromResponse(message.Response);
    }

    public virtual ClientResult<AudioTranslation> TranslateAudio(BinaryData audioBytes, string filename, AudioTranslationOptions options = null)
    {
        PipelineMessage message = CreateInternalTranslationRequestMessage(audioBytes, filename, options);
        Shim.Pipeline.Send(message);
        return GetTranslationResultFromResponse(message.Response);
    }

    public virtual async Task<ClientResult<AudioTranslation>> TranslateAudioAsync(BinaryData audioBytes, string filename, AudioTranslationOptions options = null)
    {
        PipelineMessage message = CreateInternalTranslationRequestMessage(audioBytes, filename, options);
        await Shim.Pipeline.SendAsync(message);
        return GetTranslationResultFromResponse(message.Response);
    }

    private PipelineMessage CreateInternalTranscriptionRequestMessage(BinaryData audioBytes, string filename, AudioTranscriptionOptions options)
    {
        PipelineMessage message = Shim.Pipeline.CreateMessage();
        message.ResponseClassifier = ResponseErrorClassifier200;
        PipelineRequest request = message.Request;
        request.Method = "POST";
        UriBuilder uriBuilder = new(_clientConnector.Endpoint.AbsoluteUri);
        StringBuilder path = new();
        path.Append("/audio/transcriptions");
        uriBuilder.Path += path.ToString();
        request.Uri = uriBuilder.Uri;

        MultipartFormDataContent requestContent = CreateInternalTranscriptionRequestContent(audioBytes, filename, options);
        requestContent.ApplyToRequest(request);

        return message;
    }

    private PipelineMessage CreateInternalTranslationRequestMessage(BinaryData audioBytes, string filename, AudioTranslationOptions options)
    {
        PipelineMessage message = Shim.Pipeline.CreateMessage();
        message.ResponseClassifier = ResponseErrorClassifier200;
        PipelineRequest request = message.Request;
        request.Method = "POST";
        UriBuilder uriBuilder = new(_clientConnector.Endpoint.AbsoluteUri);
        StringBuilder path = new();
        path.Append("/audio/translations");
        uriBuilder.Path += path.ToString();
        request.Uri = uriBuilder.Uri;

        MultipartFormDataContent requestContent = CreateInternalTranscriptionRequestContent(audioBytes, filename, options);
        requestContent.ApplyToRequest(request);

        return message;
    }

    private MultipartFormDataContent CreateInternalTranscriptionRequestContent(BinaryData audioBytes, string filename, AudioTranscriptionOptions options)
    {
        options ??= new();
        return CreateInternalTranscriptionRequestContent(
            audioBytes,
            filename,
            options.Language,
            options.Prompt,
            options.ResponseFormat,
            options.Temperature,
            options.EnableWordTimestamps,
            options.EnableSegmentTimestamps);
    }

    private MultipartFormDataContent CreateInternalTranscriptionRequestContent(BinaryData audioBytes, string filename, AudioTranslationOptions options)
    {
        options ??= new();
        return CreateInternalTranscriptionRequestContent(
            audioBytes,
            filename,
            language: null,
            options.Prompt,
            options.ResponseFormat,
            options.Temperature,
            enableWordTimestamps: null,
            enableSegmentTimestamps: null);
    }

    private MultipartFormDataContent CreateInternalTranscriptionRequestContent(
        BinaryData audioBytes,
        string filename,
        string language = null,
        string prompt = null,
        AudioTranscriptionFormat? transcriptionFormat = null,
        float? temperature = null,
        bool? enableWordTimestamps = null,
        bool? enableSegmentTimestamps = null)
    {
        MultipartFormDataContent content = new();
        content.Add(MultipartContent.Create(BinaryData.FromString(_clientConnector.Model)), name: "model", []);
        if (OptionalProperty.IsDefined(language))
        {
            content.Add(MultipartContent.Create(BinaryData.FromString(language)), name: "language", []);
        }
        if (OptionalProperty.IsDefined(prompt))
        {
            content.Add(MultipartContent.Create(BinaryData.FromString(prompt)), name: "prompt", []);
        }
        if (OptionalProperty.IsDefined(transcriptionFormat))
        {
            content.Add(MultipartContent.Create(BinaryData.FromString(transcriptionFormat switch
            {
                AudioTranscriptionFormat.Simple => "json",
                AudioTranscriptionFormat.Detailed => "verbose_json",
                AudioTranscriptionFormat.Srt => "srt",
                AudioTranscriptionFormat.Vtt => "vtt",
                _ => throw new ArgumentException(nameof(transcriptionFormat)),
            })),
            name: "response_format",
            []);
        }
        if (OptionalProperty.IsDefined(temperature))
        {
            content.Add(MultipartContent.Create(BinaryData.FromString($"{temperature}")), name: "temperature", []);
        }
        if (OptionalProperty.IsDefined(enableWordTimestamps) || OptionalProperty.IsDefined(enableSegmentTimestamps))
        {
            List<string> granularities = [];
            if (enableWordTimestamps == true)
            {
                granularities.Add("word");
            }
            if (enableSegmentTimestamps == true)
            {
                granularities.Add("segment");
            }
            content.Add(MultipartContent.Create(BinaryData.FromObjectAsJson(granularities)), name: "timestamp_granularities", []);
        }
        content.Add(MultipartContent.Create(audioBytes), name: "file", fileName: filename, []);

        return content;
    }

    private static ClientResult<AudioTranscription> GetTranscriptionResultFromResponse(PipelineResponse response)
    {
        if (response.IsError)
        {
            throw new ClientResultException(response);
        }

        using JsonDocument responseDocument = JsonDocument.Parse(response.Content);
        return ClientResult.FromValue(AudioTranscription.DeserializeAudioTranscription(responseDocument.RootElement), response);
    }

    private static ClientResult<AudioTranslation> GetTranslationResultFromResponse(PipelineResponse response)
    {
        if (response.IsError)
        {
            throw new ClientResultException(response);
        }

        using JsonDocument responseDocument = JsonDocument.Parse(response.Content);
        return ClientResult.FromValue(AudioTranslation.DeserializeAudioTranscription(responseDocument.RootElement), response);
    }

    private Internal.Models.CreateSpeechRequest CreateInternalTtsRequest(
        string input,
        TextToSpeechVoice voice,
        TextToSpeechOptions options = null)
    {
        options ??= new();
        Internal.Models.CreateSpeechRequestResponseFormat? internalResponseFormat = null;
        if (options.ResponseFormat != null)
        {
            internalResponseFormat = options.ResponseFormat switch
            {
                AudioDataFormat.Aac => "aac",
                AudioDataFormat.Flac => "flac",
                AudioDataFormat.M4a => "m4a",
                AudioDataFormat.Mp3 => "mp3",
                AudioDataFormat.Mp4 => "mp4",
                AudioDataFormat.Mpeg => "mpeg",
                AudioDataFormat.Mpga => "mpga",
                AudioDataFormat.Ogg => "ogg",
                AudioDataFormat.Opus => "opus",
                AudioDataFormat.Wav => "wav",
                AudioDataFormat.Webm => "webm",
                _ => throw new ArgumentException(nameof(options.ResponseFormat)),
            };
        }
        return new Internal.Models.CreateSpeechRequest(
            _clientConnector.Model,
            input,
            voice.ToString(),
            internalResponseFormat,
            options?.SpeedMultiplier,
            serializedAdditionalRawData: null);
    }
    private static PipelineMessageClassifier _responseErrorClassifier200;
    private static PipelineMessageClassifier ResponseErrorClassifier200 => _responseErrorClassifier200 ??= PipelineMessageClassifier.Create(stackalloc ushort[] { 200 });

}

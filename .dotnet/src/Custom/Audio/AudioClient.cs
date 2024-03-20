using OpenAI.Internal;
using System;
using System.ClientModel;
using System.ClientModel.Primitives;
using System.IO;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
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

    // convenience method - sync; Stream overload
    // TODO: add refdoc comment
    public virtual ClientResult<AudioTranscription> TranscribeAudio(Stream fileStream, string fileName, AudioTranscriptionOptions options = null)
    {
        Argument.AssertNotNull(fileStream, nameof(fileStream));
        Argument.AssertNotNull(fileName, nameof(fileName));

        options ??= new();

        using MultipartFormDataBinaryContent content = options.ToMultipartContent(fileStream, fileName, _clientConnector.Model);

        ClientResult result = TranscribeAudio(content, content.ContentType);

        PipelineResponse response = result.GetRawResponse();

        AudioTranscription value = AudioTranscription.Deserialize(response.Content!);

        return ClientResult.FromValue(value, response);
    }

    // convenience method - sync
    // TODO: add refdoc comment
    public virtual ClientResult<AudioTranscription> TranscribeAudio(BinaryData audioBytes, string fileName, AudioTranscriptionOptions options = null)
    {
        Argument.AssertNotNull(audioBytes, nameof(audioBytes));
        Argument.AssertNotNull(fileName, nameof(fileName));

        options ??= new();

        using MultipartFormDataBinaryContent content = options.ToMultipartContent(audioBytes, fileName, _clientConnector.Model);

        ClientResult result = TranscribeAudio(content, content.ContentType);

        PipelineResponse response = result.GetRawResponse();

        AudioTranscription value = AudioTranscription.Deserialize(response.Content!);

        return ClientResult.FromValue(value, response);
    }

    // convenience method - async
    // TODO: add refdoc comment
    public virtual async Task<ClientResult<AudioTranscription>> TranscribeAudioAsync(Stream fileStream, string filename, AudioTranscriptionOptions options = null)
    {
        Argument.AssertNotNull(fileStream, nameof(fileStream));
        Argument.AssertNotNull(filename, nameof(filename));

        options ??= new();

        using MultipartFormDataBinaryContent content = options.ToMultipartContent(fileStream, filename, _clientConnector.Model);

        ClientResult result = await TranscribeAudioAsync(content, content.ContentType).ConfigureAwait(false);

        PipelineResponse response = result.GetRawResponse();

        AudioTranscription value = AudioTranscription.Deserialize(response.Content!);

        return ClientResult.FromValue(value, response);
    }

    // convenience method - async
    // TODO: add refdoc comment
    public virtual async Task<ClientResult<AudioTranscription>> TranscribeAudioAsync(BinaryData audioBytes, string fileName, AudioTranscriptionOptions options = null)
    {
        Argument.AssertNotNull(audioBytes, nameof(audioBytes));
        Argument.AssertNotNull(fileName, nameof(fileName));

        options ??= new();

        using MultipartFormDataBinaryContent content = options.ToMultipartContent(audioBytes, fileName, _clientConnector.Model);

        ClientResult result = await TranscribeAudioAsync(content, content.ContentType).ConfigureAwait(false);

        PipelineResponse response = result.GetRawResponse();

        AudioTranscription value = AudioTranscription.Deserialize(response.Content!);

        return ClientResult.FromValue(value, response);
    }

    private PipelineMessage CreateCreateTranscriptionRequest(BinaryContent content, string contentType, RequestOptions options)
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

        request.Headers.Set("Content-Type", contentType);

        request.Content = content;

        message.Apply(options);

        return message;
    }

    // convenience method - sync; Stream overload
    // TODO: add refdoc comment
    public virtual ClientResult<AudioTranslation> TranslateAudio(Stream fileStream, string fileName, AudioTranslationOptions options = null)
    {
        Argument.AssertNotNull(fileStream, nameof(fileStream));
        Argument.AssertNotNull(fileName, nameof(fileName));

        options ??= new();

        using MultipartFormDataBinaryContent content = options.ToMultipartContent(fileStream, fileName, _clientConnector.Model);

        ClientResult result = TranslateAudio(content, content.ContentType);

        PipelineResponse response = result.GetRawResponse();

        AudioTranslation value = AudioTranslation.Deserialize(response.Content!);

        return ClientResult.FromValue(value, response);
    }

    // convenience method - sync
    // TODO: add refdoc comment
    public virtual ClientResult<AudioTranslation> TranslateAudio(BinaryData audioBytes, string fileName, AudioTranslationOptions options = null)
    {
        Argument.AssertNotNull(audioBytes, nameof(audioBytes));
        Argument.AssertNotNull(fileName, nameof(fileName));

        options ??= new();

        using MultipartFormDataBinaryContent content = options.ToMultipartContent(audioBytes, fileName, _clientConnector.Model);

        ClientResult result = TranslateAudio(content, content.ContentType);

        PipelineResponse response = result.GetRawResponse();

        AudioTranslation value = AudioTranslation.Deserialize(response.Content!);

        return ClientResult.FromValue(value, response);
    }

    // convenience method - async; Stream overload
    // TODO: add refdoc comment
    public virtual async Task<ClientResult<AudioTranslation>> TranslateAudioAsync(Stream fileStream, string fileName, AudioTranslationOptions options = null)
    {
        Argument.AssertNotNull(fileStream, nameof(fileStream));
        Argument.AssertNotNull(fileName, nameof(fileName));

        options ??= new();

        using MultipartFormDataBinaryContent content = options.ToMultipartContent(fileStream, fileName, _clientConnector.Model);

        ClientResult result = await TranslateAudioAsync(content, content.ContentType).ConfigureAwait(false);

        PipelineResponse response = result.GetRawResponse();

        AudioTranslation value = AudioTranslation.Deserialize(response.Content!);

        return ClientResult.FromValue(value, response);
    }

    // convenience method - async
    // TODO: add refdoc comment
    public virtual async Task<ClientResult<AudioTranslation>> TranslateAudioAsync(BinaryData audioBytes, string fileName, AudioTranslationOptions options = null)
    {
        Argument.AssertNotNull(audioBytes, nameof(audioBytes));
        Argument.AssertNotNull(fileName, nameof(fileName));

        options ??= new();

        using MultipartFormDataBinaryContent content = options.ToMultipartContent(audioBytes, fileName, _clientConnector.Model);

        ClientResult result = await TranslateAudioAsync(content, content.ContentType).ConfigureAwait(false);

        PipelineResponse response = result.GetRawResponse();

        AudioTranslation value = AudioTranslation.Deserialize(response.Content!);

        return ClientResult.FromValue(value, response);
    }

    private PipelineMessage CreateCreateTranslationRequest(BinaryContent content, string contentType, RequestOptions options)
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

        request.Headers.Set("Content-Type", contentType);

        request.Content = content;

        message.Apply(options);

        return message;
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

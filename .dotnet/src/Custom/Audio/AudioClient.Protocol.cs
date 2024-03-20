using System;
using System.ClientModel;
using System.ClientModel.Primitives;
using System.ComponentModel;
using System.IO;
using System.Threading.Tasks;

namespace OpenAI.Audio;

public partial class AudioClient
{
    /// <inheritdoc cref="Internal.Audio.CreateSpeech(BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GenerateSpeechFromText(BinaryContent content, RequestOptions options = null)
        => Shim.CreateSpeech(content, options);

    /// <inheritdoc cref="Internal.Audio.CreateSpeechAsync(BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> GenerateSpeechFromTextAsync(BinaryContent content, RequestOptions options = null)
        => await Shim.CreateSpeechAsync(content, options).ConfigureAwait(false);

    /// <summary>
    /// [Protocol Method] Transcribes audio into the input language.
    /// <list type="bullet">
    /// <item>
    /// <description>
    /// This <see href="https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Azure.Core/samples/ProtocolMethods.md">protocol method</see> allows explicit creation of the request and processing of the response for advanced scenarios.
    /// </description>
    /// </item>
    /// <item>
    /// <description>
    /// Please try the simpler <see cref="TranscribeAudio(BinaryData, string, AudioTranscriptionOptions)"/> or <see cref="TranscribeAudio(Stream, string, AudioTranscriptionOptions)"/> convenience overload with strongly typed models first.
    /// </description>
    /// </item>
    /// </list>
    /// </summary>
    /// <param name="content"> The content to send as the body of the request. </param>
    /// <param name="contentType"> The content type of the request. </param>
    /// <param name="options"> The request options, which can override default behaviors of the client pipeline on a per-call basis. </param>
    /// <exception cref="ArgumentNullException"> <paramref name="content"/> or <paramref name="contentType"/> is null. </exception>
    /// <exception cref="ArgumentException"> <paramref name="contentType"/> is an empty string, and was expected to be non-empty. </exception>
    /// <exception cref="ClientResultException"> Service returned a non-success status code. </exception>
    /// <returns> The response returned from the service. </returns>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult TranscribeAudio(BinaryContent content, string contentType, RequestOptions options = null)
    {
        Argument.AssertNotNull(content, nameof(content));
        Argument.AssertNotNullOrEmpty(contentType, nameof(contentType));

        options ??= new RequestOptions();

        using PipelineMessage message = CreateCreateTranscriptionRequest(content, contentType, options);

        Shim.Pipeline.Send(message);

        PipelineResponse response = message.Response!;

        if (response.IsError && options.ErrorOptions == ClientErrorBehaviors.Default)
        {
            throw new ClientResultException(response);
        }

        return ClientResult.FromResponse(response);
    }

    /// <summary>
    /// [Protocol Method] Transcribes audio into the input language.
    /// <list type="bullet">
    /// <item>
    /// <description>
    /// This <see href="https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Azure.Core/samples/ProtocolMethods.md">protocol method</see> allows explicit creation of the request and processing of the response for advanced scenarios.
    /// </description>
    /// </item>
    /// <item>
    /// <description>
    /// Please try the simpler <see cref="TranscribeAudioAsync(BinaryData, string, AudioTranscriptionOptions)"/> or <see cref="TranscribeAudioAsync(Stream, string, AudioTranscriptionOptions)"/> convenience overload with strongly typed models first.
    /// </description>
    /// </item>
    /// </list>
    /// </summary>
    /// <param name="content"> The content to send as the body of the request. </param>
    /// <param name="contentType"> The content type of the request. </param>
    /// <param name="options"> The request options, which can override default behaviors of the client pipeline on a per-call basis. </param>
    /// <exception cref="ArgumentNullException"> <paramref name="content"/> or <paramref name="contentType"/> is null. </exception>
    /// <exception cref="ArgumentException"> <paramref name="contentType"/> is an empty string, and was expected to be non-empty. </exception>
    /// <exception cref="ClientResultException"> Service returned a non-success status code. </exception>
    /// <returns> The response returned from the service. </returns>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> TranscribeAudioAsync(BinaryContent content, string contentType, RequestOptions options = null)
    {
        Argument.AssertNotNull(content, nameof(content));
        Argument.AssertNotNullOrEmpty(contentType, nameof(contentType));

        options ??= new RequestOptions();

        using PipelineMessage message = CreateCreateTranscriptionRequest(content, contentType, options);

        Shim.Pipeline.Send(message);

        PipelineResponse response = message.Response!;

        if (response.IsError && options.ErrorOptions == ClientErrorBehaviors.Default)
        {
            throw await ClientResultException.CreateAsync(response).ConfigureAwait(false);
        }

        return ClientResult.FromResponse(response);
    }

    /// <summary>
    /// [Protocol Method] Translates audio into English.
    /// <list type="bullet">
    /// <item>
    /// <description>
    /// This <see href="https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Azure.Core/samples/ProtocolMethods.md">protocol method</see> allows explicit creation of the request and processing of the response for advanced scenarios.
    /// </description>
    /// </item>
    /// <item>
    /// <description>
    /// Please try the simpler <see cref="TranslateAudio(BinaryData, string, AudioTranslationOptions)"/> or <see cref="TranslateAudio(Stream, string, AudioTranslationOptions)"/> convenience overload with strongly typed models first.
    /// </description>
    /// </item>
    /// </list>
    /// </summary>
    /// <param name="content"> The content to send as the body of the request. </param>
    /// <param name="contentType"> The content type of the request. </param>
    /// <param name="options"> The request options, which can override default behaviors of the client pipeline on a per-call basis. </param>
    /// <exception cref="ArgumentNullException"> <paramref name="content"/> is null. </exception>
    /// <exception cref="ArgumentException"> <paramref name="contentType"/> is an empty string, and was expected to be non-empty. </exception>
    /// <exception cref="ClientResultException"> Service returned a non-success status code. </exception>
    /// <returns> The response returned from the service. </returns>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult TranslateAudio(BinaryContent content, string contentType, RequestOptions options = null)
    {
        Argument.AssertNotNull(content, nameof(content));
        Argument.AssertNotNullOrEmpty(contentType, nameof(contentType));

        options ??= new RequestOptions();

        using PipelineMessage message = CreateCreateTranslationRequest(content, contentType, options);

        Shim.Pipeline.Send(message);

        PipelineResponse response = message.Response!;

        if (response.IsError && options.ErrorOptions == ClientErrorBehaviors.Default)
        {
            throw new ClientResultException(response);
        }

        return ClientResult.FromResponse(response);
    }

    /// <summary>
    /// [Protocol Method] Translates audio into English.
    /// <list type="bullet">
    /// <item>
    /// <description>
    /// This <see href="https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Azure.Core/samples/ProtocolMethods.md">protocol method</see> allows explicit creation of the request and processing of the response for advanced scenarios.
    /// </description>
    /// </item>
    /// <item>
    /// <description>
    /// Please try the simpler <see cref="TranslateAudioAsync(BinaryData, string, AudioTranslationOptions)"/> or <see cref="TranslateAudioAsync(Stream, string, AudioTranslationOptions)"/> convenience overload with strongly typed models first.
    /// </description>
    /// </item>
    /// </list>
    /// </summary>
    /// <param name="content"> The content to send as the body of the request. </param>
    /// <param name="contentType"> The content type of the request. </param>
    /// <param name="options"> The request options, which can override default behaviors of the client pipeline on a per-call basis. </param>
    /// <exception cref="ArgumentNullException"> <paramref name="content"/> is null. </exception>
    /// <exception cref="ArgumentException"> <paramref name="contentType"/> is an empty string, and was expected to be non-empty. </exception>
    /// <exception cref="ClientResultException"> Service returned a non-success status code. </exception>
    /// <returns> The response returned from the service. </returns>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> TranslateAudioAsync(BinaryContent content, string contentType, RequestOptions options = null)
    {
        Argument.AssertNotNull(content, nameof(content));
        Argument.AssertNotNullOrEmpty(contentType, nameof(contentType));

        options ??= new RequestOptions();

        using PipelineMessage message = CreateCreateTranslationRequest(content, contentType, options);

        Shim.Pipeline.Send(message);

        PipelineResponse response = message.Response!;

        if (response.IsError && options.ErrorOptions == ClientErrorBehaviors.Default)
        {
            throw await ClientResultException.CreateAsync(response).ConfigureAwait(false);
        }

        return ClientResult.FromResponse(response);
    }
}
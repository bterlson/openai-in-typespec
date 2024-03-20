using OpenAI.Assistants;
using OpenAI.Audio;
using OpenAI.Chat;
using OpenAI.Embeddings;
using OpenAI.Files;
using OpenAI.FineTuningManagement;
using OpenAI.Images;
using OpenAI.Internal.Models;
using OpenAI.LegacyCompletions;
using OpenAI.ModelManagement;
using OpenAI.Moderations;
using System;
using System.ClientModel;
using System.Diagnostics.CodeAnalysis;

namespace OpenAI;

/// <summary>
/// A top-level client factory that enables convenient creation of scenario-specific sub-clients while reusing shared
/// configuration details like endpoint, authentication, and pipeline customization.
/// </summary>
public partial class OpenAIClient
{
    private readonly ApiKeyCredential _cachedCredential = null;
    private readonly OpenAIClientOptions _cachedOptions = null;

    /// <summary>
    /// Creates a new instance of <see cref="OpenAIClient"/> will store common client configuration details to permit
    /// easy reuse and propagation to multiple, scenario-specific subclients.
    /// </summary>
    /// <remarks>
    /// This client does not provide any model functionality directly and is purely a helper to facilitate the creation
    /// of the scenario-specific subclients like <see cref="ChatClient"/>.
    /// </remarks>
    /// <param name="credential"> An explicitly defined credential that all clients created by this <see cref="OpenAIClient"/> should use. </param>
    /// <param name="clientOptions"> A common client options definition that all clients created by this <see cref="OpenAIClient"/> should use. </param>
    public OpenAIClient(ApiKeyCredential credential = default, OpenAIClientOptions clientOptions = default)
    {
        _cachedCredential = credential;
        _cachedOptions = clientOptions;
    }

    /// <summary>
    /// Gets a new instance of <see cref="AssistantClient"/> that reuses the client configuration details provided to
    /// the <see cref="OpenAIClient"/> instance.
    /// </summary>
    /// <remarks>
    /// This method is functionally equivalent to using the <see cref="AssistantClient"/> constructor directly with
    /// the same configuration details.
    /// </remarks>
    /// <returns> A new <see cref="AssistantClient"/>. </returns>
    [Experimental("OPENAI001")]
    public AssistantClient GetAssistantClient() => new(_cachedCredential, _cachedOptions);

    /// <summary>
    /// Gets a new instance of <see cref="AudioClient"/> that reuses the client configuration details provided to
    /// the <see cref="OpenAIClient"/> instance.
    /// </summary>
    /// <remarks>
    /// This method is functionally equivalent to using the <see cref="AudioClient"/> constructor directly with
    /// the same configuration details.
    /// </remarks>
    /// <returns> A new <see cref="AudioClient"/>. </returns>
    public AudioClient GetAudioClient(string model) => new(model, _cachedCredential, _cachedOptions);

    /// <summary>
    /// Gets a new instance of <see cref="ChatClient"/> that reuses the client configuration details provided to
    /// the <see cref="OpenAIClient"/> instance.
    /// </summary>
    /// <remarks>
    /// This method is functionally equivalent to using the <see cref="ChatClient"/> constructor directly with
    /// the same configuration details.
    /// </remarks>
    /// <returns> A new <see cref="ChatClient"/>. </returns>
    public ChatClient GetChatClient(string model) => new(model, _cachedCredential, _cachedOptions);

    /// <summary>
    /// Gets a new instance of <see cref="EmbeddingClient"/> that reuses the client configuration details provided to
    /// the <see cref="OpenAIClient"/> instance.
    /// </summary>
    /// <remarks>
    /// This method is functionally equivalent to using the <see cref="EmbeddingClient"/> constructor directly with
    /// the same configuration details.
    /// </remarks>
    /// <returns> A new <see cref="EmbeddingClient"/>. </returns>
    public EmbeddingClient GetEmbeddingClient(string model) => new(model, _cachedCredential, _cachedOptions);

    /// <summary>
    /// Gets a new instance of <see cref="FileClient"/> that reuses the client configuration details provided to
    /// the <see cref="OpenAIClient"/> instance.
    /// </summary>
    /// <remarks>
    /// This method is functionally equivalent to using the <see cref="FileClient"/> constructor directly with
    /// the same configuration details.
    /// </remarks>
    /// <returns> A new <see cref="FileClient"/>. </returns>
    public FileClient GetFileClient() => new(_cachedCredential, _cachedOptions);

    /// <summary>
    /// Gets a new instance of <see cref="FineTuningManagementClient"/> that reuses the client configuration details provided to
    /// the <see cref="OpenAIClient"/> instance.
    /// </summary>
    /// <remarks>
    /// This method is functionally equivalent to using the <see cref="FineTuningManagementClient"/> constructor directly with
    /// the same configuration details.
    /// </remarks>
    /// <returns> A new <see cref="FineTuningManagementClient"/>. </returns>
    public FineTuningManagementClient GetFineTuningManagementClient() => new(_cachedCredential, _cachedOptions);

    /// <summary>
    /// Gets a new instance of <see cref="ImageClient"/> that reuses the client configuration details provided to
    /// the <see cref="OpenAIClient"/> instance.
    /// </summary>
    /// <remarks>
    /// This method is functionally equivalent to using the <see cref="ImageClient"/> constructor directly with
    /// the same configuration details.
    /// </remarks>
    /// <returns> A new <see cref="ImageClient"/>. </returns>
    public ImageClient GetImageClient(string model) => new(model, _cachedCredential, _cachedOptions);

    /// <summary>
    /// Gets a new instance of <see cref="LegacyCompletionClient"/> that reuses the client configuration details provided to
    /// the <see cref="OpenAIClient"/> instance.
    /// </summary>
    /// <remarks>
    /// This method is functionally equivalent to using the <see cref="LegacyCompletionClient"/> constructor directly with
    /// the same configuration details.
    /// </remarks>
    /// <returns> A new <see cref="LegacyCompletionClient"/>. </returns>
    public LegacyCompletionClient GetLegacyCompletionClient() => new(_cachedCredential, _cachedOptions);

    /// <summary>
    /// Gets a new instance of <see cref="ModelManagementClient"/> that reuses the client configuration details provided to
    /// the <see cref="OpenAIClient"/> instance.
    /// </summary>
    /// <remarks>
    /// This method is functionally equivalent to using the <see cref="ModelManagementClient"/> constructor directly with
    /// the same configuration details.
    /// </remarks>
    /// <returns> A new <see cref="ModelManagementClient"/>. </returns>
    public ModelManagementClient GetModelManagementClient() => new(_cachedCredential, _cachedOptions);

    /// <summary>
    /// Gets a new instance of <see cref="ModerationClient"/> that reuses the client configuration details provided to
    /// the <see cref="OpenAIClient"/> instance.
    /// </summary>
    /// <remarks>
    /// This method is functionally equivalent to using the <see cref="ModerationClient"/> constructor directly with
    /// the same configuration details.
    /// </remarks>
    /// <returns> A new <see cref="ModerationClient"/>. </returns>
    public ModerationClient GetModerationClient() => new(_cachedCredential, _cachedOptions);
}

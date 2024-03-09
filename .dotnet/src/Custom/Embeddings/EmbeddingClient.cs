using System;
using System.ClientModel;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OpenAI.Embeddings;

/// <summary> The service client for the OpenAI Embeddings endpoint. </summary>
public partial class EmbeddingClient
{
    private readonly OpenAIClientConnector _clientConnector;
    private Internal.Embeddings Shim => _clientConnector.InternalClient.GetEmbeddingsClient();

    public EmbeddingClient(Uri endpoint, string model, ApiKeyCredential credential, OpenAIClientOptions options = null)
    {
        _clientConnector = new(model, endpoint, credential, options);
    }

    public EmbeddingClient(Uri endpoint, string model, OpenAIClientOptions options = null)
        : this(endpoint, model, credential: null, options)
    { }

    public EmbeddingClient(string model, ApiKeyCredential credential, OpenAIClientOptions options = null)
        : this(endpoint: null, model, credential, options)
    { }

    public EmbeddingClient(string model, OpenAIClientOptions options = null)
        : this(endpoint: null, model, credential: null, options)
    { }

    public virtual ClientResult<Embedding> GenerateEmbedding(string input, EmbeddingOptions options = null)
    {
        Internal.Models.CreateEmbeddingRequest request = CreateInternalRequest(input, options);
        ClientResult<Internal.Models.CreateEmbeddingResponse> response = Shim.CreateEmbedding(request);
        Embedding embeddingResult = new(response.Value, internalDataIndex: 0);
        return ClientResult.FromValue(embeddingResult, response.GetRawResponse());
    }

    public virtual async Task<ClientResult<Embedding>> GenerateEmbeddingAsync(string input, EmbeddingOptions options = null)
    {
        Internal.Models.CreateEmbeddingRequest request = CreateInternalRequest(input, options);
        ClientResult<Internal.Models.CreateEmbeddingResponse> response = await Shim.CreateEmbeddingAsync(request);
        Embedding embeddingResult = new(response.Value, internalDataIndex: 0);
        return ClientResult.FromValue(embeddingResult, response.GetRawResponse());
    }

    public virtual ClientResult<Embedding> GenerateEmbedding(IEnumerable<int> input, EmbeddingOptions options = null)
    {
        Internal.Models.CreateEmbeddingRequest request = CreateInternalRequest(input, options);
        ClientResult<Internal.Models.CreateEmbeddingResponse> response = Shim.CreateEmbedding(request);
        Embedding embeddingResult = new(response.Value, internalDataIndex: 0);
        return ClientResult.FromValue(embeddingResult, response.GetRawResponse());
    }

    public virtual async Task<ClientResult<Embedding>> GenerateEmbeddingAsync(IEnumerable<int> input, EmbeddingOptions options = null)
    {
        Internal.Models.CreateEmbeddingRequest request = CreateInternalRequest(input, options);
        ClientResult<Internal.Models.CreateEmbeddingResponse> response = await Shim.CreateEmbeddingAsync(request);
        Embedding embeddingResult = new(response.Value, internalDataIndex: 0);
        return ClientResult.FromValue(embeddingResult, response.GetRawResponse());
    }

    public virtual ClientResult<EmbeddingCollection> GenerateEmbeddings(IEnumerable<string> inputs, EmbeddingOptions options = null)
    {
        Internal.Models.CreateEmbeddingRequest request = CreateInternalRequest(inputs, options);
        ClientResult<Internal.Models.CreateEmbeddingResponse> response = Shim.CreateEmbedding(request);
        EmbeddingCollection resultCollection = EmbeddingCollection.CreateFromInternalResponse(response.Value);
        return ClientResult.FromValue(resultCollection, response.GetRawResponse());
    }

    public virtual async Task<ClientResult<EmbeddingCollection>> GenerateEmbeddingsAsync(IEnumerable<string> inputs, EmbeddingOptions options = null)
    {
        Internal.Models.CreateEmbeddingRequest request = CreateInternalRequest(inputs, options);
        ClientResult<Internal.Models.CreateEmbeddingResponse> response = await Shim.CreateEmbeddingAsync(request);
        EmbeddingCollection resultCollection = EmbeddingCollection.CreateFromInternalResponse(response.Value);
        return ClientResult.FromValue(resultCollection, response.GetRawResponse());
    }

    public virtual ClientResult<EmbeddingCollection> GenerateEmbeddings(IEnumerable<IEnumerable<int>> inputs, EmbeddingOptions options = null)
    {
        Internal.Models.CreateEmbeddingRequest request = CreateInternalRequest(inputs, options);
        ClientResult<Internal.Models.CreateEmbeddingResponse> response = Shim.CreateEmbedding(request);
        EmbeddingCollection resultCollection = EmbeddingCollection.CreateFromInternalResponse(response.Value);
        return ClientResult.FromValue(resultCollection, response.GetRawResponse());
    }

    public virtual async Task<ClientResult<EmbeddingCollection>> GenerateEmbeddingsAsync(IEnumerable<IEnumerable<int>> inputs, EmbeddingOptions options = null)
    {
        Internal.Models.CreateEmbeddingRequest request = CreateInternalRequest(inputs, options);
        ClientResult<Internal.Models.CreateEmbeddingResponse> response = await Shim.CreateEmbeddingAsync(request);
        EmbeddingCollection resultCollection = EmbeddingCollection.CreateFromInternalResponse(response.Value);
        return ClientResult.FromValue(resultCollection, response.GetRawResponse());
    }

    private Internal.Models.CreateEmbeddingRequest CreateInternalRequest(object inputObject, EmbeddingOptions options)
    {
        options ??= new();
        return new Internal.Models.CreateEmbeddingRequest(
            BinaryData.FromObjectAsJson(inputObject),
            new(_clientConnector.Model),
            Internal.Models.CreateEmbeddingRequestEncodingFormat.Base64,
            options?.Dimensions,
            options?.User,
            serializedAdditionalRawData: null);
    }
}

using OpenAI.Models;
using System;
using System.ClientModel;
using System.ClientModel.Primitives;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpenAI
{
    public partial class Embeddings
    {
        private readonly string _model;

        /// <summary> Initializes a new instance of Embeddings. </summary>
        /// <param name="pipeline"> The HTTP pipeline for sending and receiving REST requests and responses. </param>
        /// <param name="credential"> The key credential to copy. </param>
        /// <param name="endpoint"> OpenAI Endpoint. </param>
        internal Embeddings(string model, ClientPipeline pipeline, ApiKeyCredential credential, Uri endpoint)
            : this(pipeline, credential, endpoint)
        {
            _model = model;
        }

        public virtual async Task<ClientResult<Embedding>> GenerateEmbeddingAsync(string input, GenerateEmbeddingsOptions options = null)
        {
            options ??= new GenerateEmbeddingsOptions();
            options.Model = new GenerateEmbeddingsOptionsModel(_model);
            options.Input = BinaryData.FromString(input);
            ClientResult<EmbeddingCollection> result = await CreateEmbeddingAsync(options).ConfigureAwait(false);
            return ClientResult.FromValue(result.Value.Data[0], result.GetRawResponse());
        }

        public virtual ClientResult<Embedding> GenerateEmbedding(string input, GenerateEmbeddingsOptions options = null)
        {
            options ??= new GenerateEmbeddingsOptions();
            options.Model = new GenerateEmbeddingsOptionsModel(_model);
            options.Input = BinaryData.FromObjectAsJson(input);
            ClientResult<EmbeddingCollection> result = CreateEmbedding(options);
            return ClientResult.FromValue(result.Value.Data[0], result.GetRawResponse());
        }

        public virtual async Task<ClientResult<Embedding>> GenerateEmbeddingAsync(IEnumerable<int> input, GenerateEmbeddingsOptions options = null)
        {
            options ??= new GenerateEmbeddingsOptions();
            options.Model = new GenerateEmbeddingsOptionsModel(_model);
            options.Input = BinaryData.FromObjectAsJson(input.ToArray());
            ClientResult<EmbeddingCollection> result = await CreateEmbeddingAsync(options).ConfigureAwait(false);
            return ClientResult.FromValue(result.Value.Data[0], result.GetRawResponse());
        }

        public virtual ClientResult<Embedding> GenerateEmbedding(IEnumerable<int> input, GenerateEmbeddingsOptions options = null)
        {
            options ??= new GenerateEmbeddingsOptions();
            options.Model = new GenerateEmbeddingsOptionsModel(_model);
            options.Input = BinaryData.FromObjectAsJson(input.ToArray());
            ClientResult<EmbeddingCollection> result = CreateEmbedding(options);
            return ClientResult.FromValue(result.Value.Data[0], result.GetRawResponse());
        }

        public virtual async Task<ClientResult<EmbeddingCollection>> GenerateEmbeddingsAsync(IEnumerable<string> inputs, GenerateEmbeddingsOptions options = null)
        {
            options ??= new GenerateEmbeddingsOptions();
            options.Model = new GenerateEmbeddingsOptionsModel(_model);
            options.Input = BinaryData.FromObjectAsJson(inputs.ToArray());
            return await CreateEmbeddingAsync(options).ConfigureAwait(false);
        }

        public virtual ClientResult<EmbeddingCollection> GenerateEmbeddings(IEnumerable<string> inputs, GenerateEmbeddingsOptions options = null)
        {
            options ??= new GenerateEmbeddingsOptions();
            options.Model = new GenerateEmbeddingsOptionsModel(_model);
            options.Input = BinaryData.FromObjectAsJson(inputs.ToArray());
            return CreateEmbedding(options);
        }

        public virtual async Task<ClientResult<EmbeddingCollection>> GenerateEmbeddingsAsync(IEnumerable<IEnumerable<int>> inputs, GenerateEmbeddingsOptions options = null)
        {
            options ??= new GenerateEmbeddingsOptions();
            options.Model = new GenerateEmbeddingsOptionsModel(_model);
            options.Input = BinaryData.FromObjectAsJson(inputs.ToArray());
            return await CreateEmbeddingAsync(options).ConfigureAwait(false);
        }

        public virtual ClientResult<EmbeddingCollection> GenerateEmbeddings(IEnumerable<IEnumerable<int>> inputs, GenerateEmbeddingsOptions options = null)
        {
            options ??= new GenerateEmbeddingsOptions();
            options.Model = new GenerateEmbeddingsOptionsModel(_model);
            options.Input = BinaryData.FromObjectAsJson(inputs.ToArray());
            return CreateEmbedding(options);
        }
    }
}

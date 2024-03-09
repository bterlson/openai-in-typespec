using System.ClientModel;
using System.ClientModel.Primitives;
using System.ComponentModel;
using System.Threading.Tasks;

namespace OpenAI.ModelManagement;

public partial class ModelManagementClient
{
    /// <inheritdoc cref="Internal.ModelsOps.Retrieve(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetModelInfo(string modelId, RequestOptions options)
        => Shim.Retrieve(modelId, options);

    /// <inheritdoc cref="Internal.ModelsOps.RetrieveAsync(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> GetModelInfoAsync(string modelId, RequestOptions options)
        => await Shim.RetrieveAsync(modelId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.ModelsOps.GetModels(RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetModels(RequestOptions options)
        => Shim.GetModels(options);

    /// <inheritdoc cref="Internal.ModelsOps.GetModelsAsync(RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> GetModelsAsync(RequestOptions options)
        => await Shim.GetModelsAsync(options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.ModelsOps.Delete(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult DeleteModel(string modelId, RequestOptions options)
        => Shim.Delete(modelId, options);

    /// <inheritdoc cref="Internal.ModelsOps.DeleteAsync(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> DeleteModelAsync(string modelId, RequestOptions options)
        => await Shim.DeleteAsync(modelId, options).ConfigureAwait(false);
}

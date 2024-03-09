using System.ClientModel;
using System.ClientModel.Primitives;
using System.Threading.Tasks;

namespace OpenAI.Moderations;

public partial class ModerationClient
{
    /// <inheritdoc cref="Internal.Moderations.CreateModeration(BinaryContent, RequestOptions)"/>
    public virtual ClientResult ClassifyText(BinaryContent content, RequestOptions options = null)
        => Shim.CreateModeration(content, options);

    /// <inheritdoc cref="Internal.Moderations.CreateModerationAsync(BinaryContent, RequestOptions)"/>
    public virtual async Task<ClientResult> ClassifyTextAsync(BinaryContent content, RequestOptions options = null)
        => await Shim.CreateModerationAsync(content, options).ConfigureAwait(false);
}

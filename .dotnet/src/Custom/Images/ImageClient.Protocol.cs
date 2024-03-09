using System.ClientModel.Primitives;
using System.ClientModel;
using System.ComponentModel;
using System.Threading.Tasks;

namespace OpenAI.Images;

public partial class ImageClient
{
    /// <inheritdoc cref="Internal.Images.CreateImage(BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GenerateImage(BinaryContent content, RequestOptions options = null)
        => Shim.CreateImage(content, options);

    /// <inheritdoc cref="Internal.Images.CreateImageAsync(BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> GenerateImageAsync(BinaryContent content, RequestOptions options = null)
        => await Shim.CreateImageAsync(content, options).ConfigureAwait(false);
}

using System.ClientModel;
using System.ClientModel.Primitives;
using System.ComponentModel;
using System.Threading.Tasks;

namespace OpenAI.Files;

public partial class FileClient
{
    /// <inheritdoc cref="Internal.Files.RetrieveFile(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetFileInfo(string fileId, RequestOptions options)
        => Shim.RetrieveFile(fileId, options);

    /// <inheritdoc cref="Internal.Files.RetrieveFileAsync(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> GetFileInfoAsync(string fileId, RequestOptions options)
        => await Shim.RetrieveFileAsync(fileId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Files.GetFiles(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetFileInfoList(string purpose, RequestOptions options)
        => Shim.GetFiles(purpose, options);

    /// <inheritdoc cref="Internal.Files.GetFilesAsync(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> GetFileInfoListAsync(string purpose, RequestOptions options)
        => await Shim.GetFilesAsync(purpose, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Files.DownloadFile(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult DownloadFile(string fileId, RequestOptions options)
        => Shim.DownloadFile(fileId, options);

    /// <inheritdoc cref="Internal.Files.DownloadFileAsync(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> DownloadFileAsync(string fileId, RequestOptions options)
        => await Shim.DownloadFileAsync(fileId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Files.DeleteFile(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult DeleteFile(string fileId, RequestOptions options)
        => Shim.DeleteFile(fileId, options);

    /// <inheritdoc cref="Internal.Files.DeleteFileAsync(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> DeleteFileAsync(string fileId, RequestOptions options)
        => await Shim.DeleteFileAsync(fileId, options).ConfigureAwait(false);
}

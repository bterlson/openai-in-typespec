using System.ClientModel;
using System.ClientModel.Primitives;
using System.ComponentModel;
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
}
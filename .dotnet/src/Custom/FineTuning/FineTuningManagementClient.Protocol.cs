using System.ClientModel;
using System.ClientModel.Primitives;
using System.Threading.Tasks;

namespace OpenAI.FineTuningManagement;

public partial class FineTuningManagementClient
{
    /// <inheritdoc cref="Internal.FineTuning.CreateFineTuningJob(BinaryContent, RequestOptions)"/>
    public virtual ClientResult CreateFineTuningJob(
        BinaryContent content,
        RequestOptions options = null)
        => FineTuningShim.CreateFineTuningJob(content, options);

    /// <inheritdoc cref="Internal.FineTuning.CreateFineTuningJobAsync(BinaryContent, RequestOptions)"/>
    public virtual async Task<ClientResult> CreateFineTuningJobAsync(
        BinaryContent content,
        RequestOptions options = null)
        => await FineTuningShim.CreateFineTuningJobAsync(content, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.FineTuning.RetrieveFineTuningJob(string, RequestOptions)"/>
    public virtual ClientResult GetFineTuningJob(
        string jobId,
        RequestOptions options)
        => FineTuningShim.RetrieveFineTuningJob(jobId, options);

    /// <inheritdoc cref="Internal.FineTuning.RetrieveFineTuningJobAsync(string, RequestOptions)"/>
    public virtual async Task<ClientResult> GetFineTuningJobAsync(
        string jobId,
        RequestOptions options)
        => await FineTuningShim.RetrieveFineTuningJobAsync(jobId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.FineTuning.GetPaginatedFineTuningJobs(string, int?, RequestOptions)"/>
    public virtual ClientResult GetFineTuningJobs(
        string previousJobId,
        int? maxResults,
        RequestOptions options)
        => FineTuningShim.GetPaginatedFineTuningJobs(previousJobId, maxResults, options);

    /// <inheritdoc cref="Internal.FineTuning.GetPaginatedFineTuningJobsAsync(string, int?, RequestOptions)"/>
    public virtual async Task<ClientResult> GetFineTuningJobsAsync(
        string previousJobId,
        int? maxResults,
        RequestOptions options)
        => await FineTuningShim.GetPaginatedFineTuningJobsAsync(previousJobId, maxResults, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.FineTuning.CancelFineTuningJob(string, RequestOptions)"/>
    public virtual ClientResult CancelFineTuningJob(
        string jobId,
        RequestOptions options)
        => FineTuningShim.CancelFineTuningJob(jobId, options);

    /// <inheritdoc cref="Internal.FineTuning.CancelFineTuningJobAsync(string, RequestOptions)"/>
    public virtual async Task<ClientResult> CancelFineTuningJobAsync(
        string jobId,
        RequestOptions options)
        => await FineTuningShim.CancelFineTuningJobAsync(jobId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.FineTuning.GetFineTuningEvents(string, string, int?, RequestOptions)"/>
    public virtual ClientResult GetFineTuningJobEvents(
        string jobId,
        string previousEventId,
        int? maxResults,
        RequestOptions options)
        => FineTuningShim.GetFineTuningEvents(jobId, previousEventId, maxResults, options);

    /// <inheritdoc cref="Internal.FineTuning.GetFineTuningEventsAsync(string, string, int?, RequestOptions)"/>
    public virtual async Task<ClientResult> GetFineTuningJobEventsAsync(
        string jobId,
        string previousEventId,
        int? maxResults,
        RequestOptions options)
        => await FineTuningShim.GetFineTuningEventsAsync(jobId, previousEventId, maxResults, options).ConfigureAwait(false);
}

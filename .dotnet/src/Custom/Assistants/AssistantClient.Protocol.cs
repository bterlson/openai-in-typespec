using System.ClientModel;
using System.ClientModel.Primitives;
using System.ComponentModel;
using System.Threading.Tasks;

namespace OpenAI.Assistants;

public partial class AssistantClient
{
    /// <inheritdoc cref="Internal.Assistants.CreateAssistant(BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult CreateAssistant(
        BinaryContent content,
        RequestOptions options = null)
        => Shim.CreateAssistant(content, options);

    /// <inheritdoc cref="Internal.Assistants.CreateAssistantAsync(BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> CreateAssistantAsync(
        BinaryContent content,
        RequestOptions options = null)
        => await Shim.CreateAssistantAsync(content, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Assistants.GetAssistant(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetAssistant(
        string assistantId,
        RequestOptions options)
        => Shim.GetAssistant(assistantId, options);

    /// <inheritdoc cref="Internal.Assistants.GetAssistantAsync(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> GetAssistantAsync(
        string assistantId,
        RequestOptions options)
        => await Shim.GetAssistantAsync(assistantId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Assistants.GetAssistants(int?, string, string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetAssistants(
        int? maxResults,
        string createdSortOrder,
        string previousAssistantId,
        string subsequentAssistantId,
        RequestOptions options)
        => Shim.GetAssistants(maxResults, createdSortOrder, previousAssistantId, subsequentAssistantId, options);

    /// <inheritdoc cref="Internal.Assistants.GetAssistantsAsync(int?, string, string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> GetAssistantsAsync(
        int? maxResults,
        string createdSortOrder,
        string previousAssistantId,
        string subsequentAssistantId,
        RequestOptions options)
        => await Shim.GetAssistantsAsync(maxResults, createdSortOrder, previousAssistantId, subsequentAssistantId, options).ConfigureAwait(false);


    /// <inheritdoc cref="Internal.Assistants.ModifyAssistant(string, BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult ModifyAssistant(
        string assistantId,
        BinaryContent content,
        RequestOptions options = null)
        => Shim.ModifyAssistant(assistantId, content, options);

    /// <inheritdoc cref="Internal.Assistants.ModifyAssistantAsync(string, BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> ModifyAssistantAsync(
        string assistantId,
        BinaryContent content,
        RequestOptions options = null)
        => await Shim.ModifyAssistantAsync(assistantId, content, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Assistants.DeleteAssistant(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult DeleteAssistant(
        string assistantId,
        RequestOptions options)
        => Shim.DeleteAssistant(assistantId, options);

    /// <inheritdoc cref="Internal.Assistants.DeleteAssistantAsync(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> DeleteAssistantAsync(
        string assistantId,
        RequestOptions options)
        => await Shim.DeleteAssistantAsync(assistantId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Assistants.CreateAssistantFile(string, BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult CreateAssistantFileAssociation(
        string assistantId,
        BinaryContent content,
        RequestOptions options = null)
        => Shim.CreateAssistantFile(assistantId, content, options);

    /// <inheritdoc cref="Internal.Assistants.CreateAssistantFileAsync(string, BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> CreateAssistantFileAssociationAsync(
        string assistantId,
        BinaryContent content,
        RequestOptions options = null)
        => await Shim.CreateAssistantFileAsync(assistantId, content, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Assistants.GetAssistantFile(string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetAssistantFileAssociation(
        string assistantId,
        string fileId,
        RequestOptions options)
        => Shim.GetAssistantFile(assistantId, fileId, options);

    /// <inheritdoc cref="Internal.Assistants.GetAssistantFileAsync(string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> GetAssistantFileAssociationAsync(
        string assistantId,
        string fileId,
        RequestOptions options)
        => await Shim.GetAssistantFileAsync(assistantId, fileId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Assistants.GetAssistantFiles(string, int?, string, string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetAssistantFileAssociation(
        string assistantId,
        int? maxResults,
        string createdSortOrder,
        string previousId,
        string subsequentId,
        RequestOptions options)
        => Shim.GetAssistantFiles(assistantId, maxResults, createdSortOrder, previousId, subsequentId, options);

    /// <inheritdoc cref="Internal.Assistants.GetAssistantFilesAsync(string, int?, string, string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> GetAssistantFileAssociationAsync(
        string assistantId,
        int? maxResults,
        string createdSortOrder,
        string previousId,
        string subsequentId,
        RequestOptions options)
        => await Shim.GetAssistantFilesAsync(assistantId, maxResults, createdSortOrder, previousId, subsequentId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Assistants.DeleteAssistantFile(string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult RemoveAssistantFileAssociation(
        string assistantId,
        string fileId,
        RequestOptions options)
        => Shim.DeleteAssistantFile(assistantId, fileId, options);

    /// <inheritdoc cref="Internal.Assistants.DeleteAssistantFileAsync(string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> RemoveAssistantFileAssociationAsync(
        string assistantId,
        string fileId,
        RequestOptions options)
        => await Shim.DeleteAssistantFileAsync(assistantId, fileId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Threads.CreateThread(BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult CreateThread(
        BinaryContent content,
        RequestOptions options = null)
        => ThreadShim.CreateThread(content, options);

    /// <inheritdoc cref="Internal.Threads.CreateThreadAsync(BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> CreateThreadAsync(
        BinaryContent content,
        RequestOptions options = null)
        => await ThreadShim.CreateThreadAsync(content, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Threads.GetThread(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetThread(
        string threadId,
        RequestOptions options)
        => ThreadShim.GetThread(threadId, options);

    /// <inheritdoc cref="Internal.Threads.GetThreadAsync(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> GetThreadAsync(
        string threadId,
        RequestOptions options)
        => await ThreadShim.GetThreadAsync(threadId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Threads.ModifyThread(string, BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult ModifyThread(
        string threadId,
        BinaryContent content,
        RequestOptions options = null)
        => ThreadShim.ModifyThread(threadId, content, options);

    /// <inheritdoc cref="Internal.Threads.ModifyThreadAsync(string, BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> ModifyThreadAsync(
        string threadId,
        BinaryContent content,
        RequestOptions options = null)
        => await ThreadShim.ModifyThreadAsync(threadId, content, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Threads.DeleteThread(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult DeleteThread(
        string threadId,
        RequestOptions options)
        => ThreadShim.DeleteThread(threadId, options);

    /// <inheritdoc cref="Internal.Threads.DeleteThreadAsync(string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> DeleteThreadAsync(
        string threadId,
        RequestOptions options)
        => await ThreadShim.DeleteThreadAsync(threadId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Messages.CreateMessage(string, BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult CreateMessage(
        string threadId,
        BinaryContent content,
        RequestOptions options = null)
        => MessageShim.CreateMessage(threadId, content, options);

    /// <inheritdoc cref="Internal.Messages.CreateMessageAsync(string, BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> CreateMessageAsync(
        string threadId,
        BinaryContent content,
        RequestOptions options = null)
        => await MessageShim.CreateMessageAsync(threadId, content, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Messages.GetMessage(string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetMessage(
        string threadId,
        string messageId,
        RequestOptions options)
        => MessageShim.GetMessage(threadId, messageId, options);

    /// <inheritdoc cref="Internal.Messages.GetMessageAsync(string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> GetMessageAsync(
        string threadId,
        string messageId,
        RequestOptions options)
        => await MessageShim.GetMessageAsync(threadId, messageId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Messages.GetMessages(string, int?, string, string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetMessages(
        string threadId,
        int? maxResults,
        string createdSortOrder,
        string previousMessageId,
        string subsequentMessageId,
        RequestOptions options)
        => MessageShim.GetMessages(threadId, maxResults, createdSortOrder, previousMessageId, subsequentMessageId, options);

    /// <inheritdoc cref="Internal.Messages.GetMessagesAsync(string, int?, string, string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> GetMessagesAsync(
        string threadId,
        int? maxResults,
        string createdSortOrder,
        string previousMessageId,
        string subsequentMessageId,
        RequestOptions options)
        => await MessageShim.GetMessagesAsync(threadId, maxResults, createdSortOrder, previousMessageId, subsequentMessageId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Messages.GetMessageFile(string, string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetMessageFileAssociation(
        string threadId,
        string messageId,
        string fileId,
        RequestOptions options)
        => MessageShim.GetMessageFile(threadId, messageId, fileId, options);

    /// <inheritdoc cref="Internal.Messages.GetMessageFileAsync(string, string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> GetMessageFileAssociationAsync(
        string threadId,
        string messageId,
        string fileId,
        RequestOptions options)
        => await MessageShim.GetMessageFileAsync(threadId, messageId, fileId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Messages.GetMessageFiles(string, string, int?, string, string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetMessageFileAssociations(
        string threadId,
        string messageId,
        int? maxResults,
        string createdSortOrder,
        string previousId ,
        string subsequentId,
        RequestOptions options)
        => MessageShim.GetMessageFiles(threadId, messageId, maxResults, createdSortOrder, previousId, subsequentId, options);

    /// <inheritdoc cref="Internal.Messages.GetMessageFilesAsync(string, string, int?, string, string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> GetMessageFileAssociationsAsync(
        string threadId,
        string messageId,
        int? maxResults,
        string createdSortOrder,
        string previousId,
        string subsequentId,
        RequestOptions options)
        => await MessageShim.GetMessageFilesAsync(threadId, messageId, maxResults, createdSortOrder, previousId, subsequentId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Runs.CreateRun(string, BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult CreateRun(
        string threadId,
        BinaryContent content,
        RequestOptions options = null)
        => RunShim.CreateRun(threadId, content, options);

    /// <inheritdoc cref="Internal.Runs.CreateRunAsync(string, BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> CreateRunAsync(
        string threadId,
        BinaryContent content,
        RequestOptions options = null)
        => await RunShim.CreateRunAsync(threadId, content, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Runs.CreateThreadAndRun(BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult CreateThreadAndRun(
        BinaryContent content,
        RequestOptions options = null)
        => RunShim.CreateThreadAndRun(content, options);

    /// <inheritdoc cref="Internal.Runs.CreateThreadAndRunAsync(BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> CreateThreadAndRunAsync(
        BinaryContent content,
        RequestOptions options = null)
        => await RunShim.CreateThreadAndRunAsync(content, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Runs.GetRun(string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetRun(
        string threadId,
        string runId,
        RequestOptions options)
        => RunShim.GetRun(threadId, runId, options);

    /// <inheritdoc cref="Internal.Runs.GetRunAsync(string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> GetRunAsync(
        string threadId,
        string runId,
        RequestOptions options)
        => await RunShim.GetRunAsync(threadId, runId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Runs.GetRuns(string, int?, string, string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetRuns(
        string threadId,
        int? maxResults,
        string createdSortOrder,
        string previousRunId,
        string subsequentRunId,
        RequestOptions options)
        => RunShim.GetRuns(threadId, maxResults, createdSortOrder, previousRunId, subsequentRunId, options);

    /// <inheritdoc cref="Internal.Runs.GetRunsAsync(string, int?, string, string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> GetRunsAsync(
        string threadId,
        int? maxResults,
        string createdSortOrder,
        string previousRunId,
        string subsequentRunId,
        RequestOptions options)
        => await RunShim.GetRunsAsync(threadId, maxResults, createdSortOrder, previousRunId, subsequentRunId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Runs.ModifyRun(string, string, BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult ModifyRun(
        string threadId,
        string runId,
        BinaryContent content,
        RequestOptions options = null)
        => RunShim.ModifyRun(threadId, runId, content, options);

    /// <inheritdoc cref="Internal.Runs.ModifyRunAsync(string, string, BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> ModifyRunAsync(
        string threadId,
        string runId,
        BinaryContent content,
        RequestOptions options = null)
        => await RunShim.ModifyRunAsync(threadId, runId, content, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Runs.CancelRun(string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult CancelRun(
        string threadId,
        string runId,
        RequestOptions options)
        => RunShim.CancelRun(threadId, runId, options);

    /// <inheritdoc cref="Internal.Runs.CancelRunAsync(string, string, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> CancelRunAsync(
        string threadId,
        string runId,
        RequestOptions options)
        => await RunShim.CancelRunAsync(threadId, runId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Runs.SubmitToolOuputsToRun(string, string, BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult SubmitToolOutputs(
        string threadId,
        string runId,
        BinaryContent content,
        RequestOptions options = null)
        => RunShim.SubmitToolOuputsToRun(threadId, runId, content, options);

    /// <inheritdoc cref="Internal.Runs.SubmitToolOuputsToRunAsync(string, string, BinaryContent, RequestOptions)"/>
    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual async Task<ClientResult> SubmitToolOutputsAsync(
        string threadId,
        string runId,
        BinaryContent content,
        RequestOptions options = null)
        => await RunShim.SubmitToolOuputsToRunAsync(threadId, runId, content, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Runs.GetRunStep(string, string, string, RequestOptions)"/>
    public virtual ClientResult GetRunStep(
        string threadId,
        string runId,
        string stepId,
        RequestOptions options)
        => RunShim.GetRunStep(threadId, runId, stepId, options);

    /// <inheritdoc cref="Internal.Runs.GetRunStepAsync(string, string, string, RequestOptions)"/>
    public virtual async Task<ClientResult> GetRunStepAsync(
        string threadId,
        string runId,
        string stepId, 
        RequestOptions options)
        => await RunShim.GetRunStepAsync(threadId, runId, stepId, options).ConfigureAwait(false);

    /// <inheritdoc cref="Internal.Runs.GetRunSteps(string, string, int?, string, string, string, RequestOptions)"/>
    public virtual ClientResult GetRunSteps(
        string threadId,
        string runId,
        int? maxResults,
        string createdSortOrder,
        string previousStepId,
        string subsequentStepId,
        RequestOptions options)
        => RunShim.GetRunSteps(threadId, runId, maxResults, createdSortOrder, previousStepId, subsequentStepId, options);

    /// <inheritdoc cref="Internal.Runs.GetRunStepsAsync(string, string, int?, string, string, string, RequestOptions)"/>
    public virtual async Task<ClientResult> GetRunStepsAsync(
        string threadId,
        string runId,
        int? maxResults,
        string createdSortOrder,
        string previousStepId,
        string subsequentStepId,
        RequestOptions options)
        => await RunShim.GetRunStepsAsync(threadId, runId, maxResults, createdSortOrder, previousStepId, subsequentStepId, options).ConfigureAwait(false);
}

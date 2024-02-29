using System.ClientModel;
using System.ClientModel;
using System.ClientModel.Primitives;
using System.ComponentModel;
using System.Threading.Tasks;

namespace OpenAI.Assistants;

public partial class AssistantClient
{

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult CreateAssistant(BinaryContent content, RequestOptions context = null)
    {
        return Shim.CreateAssistant(content, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> CreateAssistantAsync(BinaryContent content, RequestOptions context = null)
    {
        return Shim.CreateAssistantAsync(content, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetAssistant(string assistantId, RequestOptions context)
    {
        return Shim.GetAssistant(assistantId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> GetAssistantAsync(string assistantId, RequestOptions context)
    {
        return Shim.GetAssistantAsync(assistantId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetAssistants(
        int? maxResults,
        string createdSortOrder,
        string previousAssistantId,
        string subsequentAssistantId,
        RequestOptions context)
    {
        return Shim.GetAssistants(maxResults, createdSortOrder, previousAssistantId, subsequentAssistantId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> GetAssistantsAsync(
        int? maxResults,
        string createdSortOrder,
        string previousAssistantId,
        string subsequentAssistantId,
        RequestOptions context)
    {
        return Shim.GetAssistantsAsync(maxResults, createdSortOrder, previousAssistantId, subsequentAssistantId, context);
    }


    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult ModifyAssistant(string assistantId, BinaryContent content, RequestOptions context = null)
    {
        return Shim.ModifyAssistant(assistantId, content, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> ModifyAssistantAsync(string assistantId, BinaryContent content, RequestOptions context = null)
    {
        return Shim.ModifyAssistantAsync(assistantId, content, context);
    }


    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult DeleteAssistant(string assistantId, RequestOptions context)
    {
        return Shim.DeleteAssistant(assistantId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> DeleteAssistantAsync(string assistantId, RequestOptions context)
    {
        return Shim.DeleteAssistantAsync(assistantId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult CreateAssistantFileAssociation(
        string assistantId,
        BinaryContent content,
        RequestOptions context = null)
    {
        return Shim.CreateAssistantFile(assistantId, content, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> CreateAssistantFileAssociationAsync(
        string assistantId,
        BinaryContent content,
        RequestOptions context = null)
    {
        return Shim.CreateAssistantFileAsync(assistantId, content, context);
    }


    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetAssistantFileAssociation(string assistantId, string fileId, RequestOptions context)
    {
        return Shim.GetAssistantFile(assistantId, fileId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> GetAssistantFileAssociationAsync(string assistantId, string fileId, RequestOptions context)
    {
        return Shim.GetAssistantFileAsync(assistantId, fileId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetAssistantFileAssociations(
        string assistantId,
        int? maxResults,
        string createdSortOrder,
        string previousId,
        string subsequentId,
        RequestOptions context)
    {
        return Shim.GetAssistantFiles(assistantId, maxResults, createdSortOrder, previousId, subsequentId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> GetAssistantFileAssociationsAsync(
        string assistantId,
        int? maxResults,
        string createdSortOrder,
        string previousId,
        string subsequentId,
        RequestOptions context)
    {
        return Shim
            .GetAssistantFilesAsync(assistantId, maxResults, createdSortOrder, previousId, subsequentId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult RemoveAssistantFileAssociation(string assistantId, string fileId, RequestOptions context)
    {
        return Shim.DeleteAssistantFile(assistantId, fileId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> RemoveAssistantFileAssociationAsync(string assistantId, string fileId, RequestOptions context)
    {
        return Shim.DeleteAssistantFileAsync(assistantId, fileId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult CreateThread(BinaryContent content, RequestOptions context = null)
    {
        return ThreadShim.CreateThread(content, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> CreateThreadAsync(BinaryContent content, RequestOptions context = null)
    {
        return ThreadShim.CreateThreadAsync(content, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetThread(string threadId, RequestOptions context)
    {
        return ThreadShim.GetThread(threadId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> GetThreadAsync(string threadId, RequestOptions context)
    {
        return ThreadShim.GetThreadAsync(threadId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult ModifyThread(string threadId, BinaryContent content, RequestOptions context = null)
    {
        return ThreadShim.ModifyThread(threadId, content, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> ModifyThreadAsync(string threadId, BinaryContent content, RequestOptions context = null)
    {
        return ThreadShim.ModifyThreadAsync(threadId, content, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult DeleteThread(string threadId, RequestOptions context)
    {
        return ThreadShim.DeleteThread(threadId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> DeleteThreadAsync(string threadId, RequestOptions context)
    {
        return ThreadShim.DeleteThreadAsync(threadId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult CreateMessage(string threadId, BinaryContent content, RequestOptions context = null)
    {
        return MessageShim.CreateMessage(threadId, content, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> CreateMessageAsync(string threadId, BinaryContent content, RequestOptions context = null)
    {
        return MessageShim.CreateMessageAsync(threadId, content, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetMessage(string threadId, string messageId, RequestOptions context)
    {
        return MessageShim.GetMessage(threadId, messageId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> GetMessageAsync(string threadId, string messageId, RequestOptions context)
    {
        return MessageShim.GetMessageAsync(threadId, messageId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetMessages(
        string threadId,
        int? maxResults,
        string createdSortOrder,
        string previousMessageId,
        string subsequentMessageId,
        RequestOptions context)
    {
        return MessageShim
            .GetMessages(threadId, maxResults, createdSortOrder, previousMessageId, subsequentMessageId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> GetMessagesAsync(
        string threadId,
        int? maxResults,
        string createdSortOrder,
        string previousMessageId,
        string subsequentMessageId,
        RequestOptions context)
    {
        return MessageShim
            .GetMessagesAsync(threadId, maxResults, createdSortOrder, previousMessageId, subsequentMessageId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetMessageFileAssociation(string threadId, string messageId, string fileId, RequestOptions context)
    {
        return MessageShim.GetMessageFile(threadId, messageId, fileId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> GetMessageFileAssociationAsync(
        string threadId,
        string messageId,
        string fileId,
        RequestOptions context)
    {
        return MessageShim.GetMessageFileAsync(threadId, messageId, fileId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetMessageFileAssociations(
        string threadId,
        string messageId,
        int? maxResults,
        string createdSortOrder,
        string previousId ,
        string subsequentId,
        RequestOptions context)
    {
        return MessageShim
            .GetMessageFiles(threadId, messageId, maxResults, createdSortOrder, previousId, subsequentId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> GetMessageFileAssociationsAsync(
        string threadId,
        string messageId,
        int? maxResults,
        string createdSortOrder,
        string previousId,
        string subsequentId,
        RequestOptions context)
    {
        return MessageShim
            .GetMessageFilesAsync(threadId, messageId, maxResults, createdSortOrder, previousId, subsequentId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult CreateRun(string threadId, BinaryContent content, RequestOptions context = null)
    {
        return RunShim.CreateRun(threadId, content, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> CreateRunAsync(string threadId, BinaryContent content, RequestOptions context = null)
    {
        return RunShim.CreateRunAsync(threadId, content, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult CreateThreadAndRun(BinaryContent content, RequestOptions context = null)
    {
        return RunShim.CreateThreadAndRun(content, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> CreateThreadAndRunAsync(BinaryContent content, RequestOptions context = null)
    {
        return RunShim.CreateThreadAndRunAsync(content, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetRun(string threadId, string runId, RequestOptions context)
    {
        return RunShim.GetRun(threadId, runId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> GetRunAsync(string threadId, string runId, RequestOptions context)
    {
        return RunShim.GetRunAsync(threadId, runId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult GetRuns(
        string threadId,
        int? maxResults,
        string createdSortOrder,
        string previousRunId,
        string subsequentRunId,
        RequestOptions context)
    {
        return RunShim.GetRuns(threadId, maxResults, createdSortOrder, previousRunId, subsequentRunId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> GetRunsAsync(
        string threadId,
        int? maxResults,
        string createdSortOrder,
        string previousRunId,
        string subsequentRunId,
        RequestOptions context)
    {
        return RunShim.GetRunsAsync(threadId, maxResults, createdSortOrder, previousRunId, subsequentRunId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult ModifyRun(string threadId, string runId, BinaryContent content, RequestOptions context = null)
    {
        return RunShim.ModifyRun(threadId, runId, content, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> ModifyRunAsync(
        string threadId,
        string runId,
        BinaryContent content,
        RequestOptions context = null)
    {
        return RunShim.ModifyRunAsync(threadId, runId, content, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult CancelRun(string threadId, string runId, RequestOptions context)
    {
        return RunShim.CancelRun(threadId, runId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> CancelRunAsync(string threadId, string runId, RequestOptions context)
    {
        return RunShim.CancelRunAsync(threadId, runId, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual ClientResult SubmitToolOutputs(string threadId, string runId, BinaryContent content, RequestOptions context = null)
    {
        return RunShim.SubmitToolOuputsToRun(threadId, runId, content, context);
    }

    [EditorBrowsable(EditorBrowsableState.Never)]
    public virtual Task<ClientResult> SubmitToolOutputsAsync(string threadId, string runId, BinaryContent content, RequestOptions context = null)
    {
        return RunShim.SubmitToolOuputsToRunAsync(threadId, runId, content, context);
    }

    public virtual ClientResult GetRunStep(string threadId, string runId, string stepId, RequestOptions context)
    {
        return RunShim.GetRunStep(threadId, runId, stepId, context);
    }

    public virtual Task<ClientResult> GetRunStepAsync(string threadId, string runId, string stepId, RequestOptions context)
    {
        return RunShim.GetRunStepAsync(threadId, runId, stepId, context);
    }

    public virtual ClientResult GetRunSteps(
        string threadId,
        string runId,
        int? maxResults,
        string createdSortOrder,
        string previousStepId,
        string subsequentStepId,
        RequestOptions context)
    {
        return RunShim
            .GetRunSteps(threadId, runId, maxResults, createdSortOrder, previousStepId, subsequentStepId, context);
    }

    public virtual Task<ClientResult> GetRunStepsAsync(
        string threadId,
        string runId,
        int? maxResults,
        string createdSortOrder,
        string previousStepId,
        string subsequentStepId,
        RequestOptions context)
    {
        return RunShim
            .GetRunStepsAsync(threadId, runId, maxResults, createdSortOrder, previousStepId, subsequentStepId, context);
    }
}

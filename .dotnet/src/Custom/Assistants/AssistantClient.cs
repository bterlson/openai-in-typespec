using OpenAI.ClientShared.Internal;
using System;
using System.ClientModel;
using System.ClientModel.Primitives;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OpenAI.Assistants;

/// <summary>
/// The service client for OpenAI assistants.
/// </summary>
public partial class AssistantClient
{
    private OpenAIClientConnector _clientConnector;
    private Internal.Assistants Shim => _clientConnector.InternalClient.GetAssistantsClient();
    private Internal.Threads ThreadShim => _clientConnector.InternalClient.GetThreadsClient();
    private Internal.Messages MessageShim => _clientConnector.InternalClient.GetMessagesClient();
    private Internal.Runs RunShim => _clientConnector.InternalClient.GetRunsClient();

    /// <summary>
    /// Initializes a new instance of <see cref="AssistantClient"/>, used for assistant requests. 
    /// </summary>
    /// <remarks>
    /// <para>
    ///     If an endpoint is not provided, the client will use the <c>OPENAI_ENDPOINT</c> environment variable if it
    ///     defined and otherwise use the default OpenAI v1 endpoint.
    /// </para>
    /// <para>
    ///    If an authentication credential is not defined, the client use the <c>OPENAI_API_KEY</c> environment variable
    ///    if it is defined.
    /// </para>
    /// </remarks>
    /// <param name="endpoint">The connection endpoint to use.</param>
    /// <param name="credential">The API key used to authenticate with the service endpoint.</param>
    /// <param name="options">Additional options to customize the client.</param>
    public AssistantClient(Uri endpoint, ApiKeyCredential credential, OpenAIClientOptions options = null)
    {
        options ??= new();
        options.AddPolicy(
            new GenericActionPipelinePolicy((m) => m.Request?.Headers.Set("OpenAI-Beta", "assistants=v1")),
            PipelinePosition.PerCall);
        _clientConnector = new("none", endpoint, credential, options);
    }

    /// <summary>
    /// Initializes a new instance of <see cref="AssistantClient"/>, used for assistant requests. 
    /// </summary>
    /// <remarks>
    /// <para>
    ///     If an endpoint is not provided, the client will use the <c>OPENAI_ENDPOINT</c> environment variable if it
    ///     defined and otherwise use the default OpenAI v1 endpoint.
    /// </para>
    /// <para>
    ///    If an authentication credential is not defined, the client use the <c>OPENAI_API_KEY</c> environment variable
    ///    if it is defined.
    /// </para>
    /// </remarks>
    /// <param name="endpoint">The connection endpoint to use.</param>
    /// <param name="options">Additional options to customize the client.</param>
    public AssistantClient(Uri endpoint, OpenAIClientOptions options = null)
        : this(endpoint, credential: null, options)
    { }

    /// <summary>
    /// Initializes a new instance of <see cref="AssistantClient"/>, used for assistant requests. 
    /// </summary>
    /// <remarks>
    /// <para>
    ///     If an endpoint is not provided, the client will use the <c>OPENAI_ENDPOINT</c> environment variable if it
    ///     defined and otherwise use the default OpenAI v1 endpoint.
    /// </para>
    /// <para>
    ///    If an authentication credential is not defined, the client use the <c>OPENAI_API_KEY</c> environment variable
    ///    if it is defined.
    /// </para>
    /// </remarks>
    /// <param name="credential">The API key used to authenticate with the service endpoint.</param>
    /// <param name="options">Additional options to customize the client.</param>
    public AssistantClient(ApiKeyCredential credential, OpenAIClientOptions options = null)
        : this(endpoint: null, credential, options)
    { }

    /// <summary>
    /// Initializes a new instance of <see cref="AssistantClient"/>, used for assistant requests. 
    /// </summary>
    /// <remarks>
    /// <para>
    ///     If an endpoint is not provided, the client will use the <c>OPENAI_ENDPOINT</c> environment variable if it
    ///     defined and otherwise use the default OpenAI v1 endpoint.
    /// </para>
    /// <para>
    ///    If an authentication credential is not defined, the client use the <c>OPENAI_API_KEY</c> environment variable
    ///    if it is defined.
    /// </para>
    /// </remarks>
    /// <param name="options">Additional options to customize the client.</param>
    public AssistantClient(OpenAIClientOptions options = null)
        : this(endpoint: null, credential: null, options)
    { }

    public virtual ClientResult<Assistant> CreateAssistant(string modelName, AssistantCreationOptions options = null)
    {
        Internal.Models.CreateAssistantRequest request = CreateInternalCreateAssistantRequest(modelName, options);
        ClientResult<Internal.Models.AssistantObject> internalResult = Shim.CreateAssistant(request);
        return ClientResult.FromValue(new Assistant(internalResult.Value), internalResult.GetRawResponse());
    }

     public virtual async Task<ClientResult<Assistant>> CreateAssistantAsync(string modelName, AssistantCreationOptions options = null)
    {
        Internal.Models.CreateAssistantRequest request = CreateInternalCreateAssistantRequest(modelName, options);
        ClientResult<Internal.Models.AssistantObject> internalResult
            = await Shim.CreateAssistantAsync(request).ConfigureAwait(false);
        return ClientResult.FromValue(new Assistant(internalResult.Value), internalResult.GetRawResponse());
    }

     public virtual ClientResult<Assistant> GetAssistant(string assistantId)
    {
        ClientResult<Internal.Models.AssistantObject> internalResult = Shim.GetAssistant(assistantId);
        return ClientResult.FromValue(new Assistant(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual async Task<ClientResult<Assistant>> GetAssistantAsync(
        string assistantId)
    {
        ClientResult<Internal.Models.AssistantObject> internalResult
            = await Shim.GetAssistantAsync(assistantId).ConfigureAwait(false);
        return ClientResult.FromValue(new Assistant(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual ClientResult<ListQueryPage<Assistant>> GetAssistants(
        int? maxResults = null,
        CreatedAtSortOrder? createdSortOrder = null,
        string previousAssistantId = null,
        string subsequentAssistantId = null)
    {
        ClientResult<Internal.Models.ListAssistantsResponse> internalFunc() => Shim.GetAssistants(
            maxResults,
            ToInternalListOrder(createdSortOrder),
            previousAssistantId,
            subsequentAssistantId);
        return GetListQueryPage<Assistant, Internal.Models.ListAssistantsResponse>(internalFunc);
    }

    public virtual Task<ClientResult<ListQueryPage<Assistant>>> GetAssistantsAsync(
        int? maxResults = null,
        CreatedAtSortOrder? createdSortOrder = null,
        string previousAssistantId = null,
        string subsequentAssistantId = null)
    {
        Task<ClientResult<Internal.Models.ListAssistantsResponse>> internalAsyncFunc() => Shim.GetAssistantsAsync(
            maxResults,
            ToInternalListOrder(createdSortOrder),
            previousAssistantId,
            subsequentAssistantId);
        return GetListQueryPageAsync<Assistant, Internal.Models.ListAssistantsResponse>(internalAsyncFunc);
    }

    public virtual ClientResult<Assistant> ModifyAssistant(
        string assistantId,
        AssistantModificationOptions options)
    {
        ClientResult<Internal.Models.AssistantObject> internalResult
            = Shim.ModifyAssistant(assistantId, CreateInternalModifyAssistantRequest(options));
        return ClientResult.FromValue(new Assistant(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual async Task<ClientResult<Assistant>> ModifyAssistantAsync(
        string assistantId,
        AssistantModificationOptions options)
    {
        Internal.Models.ModifyAssistantRequest request = CreateInternalModifyAssistantRequest(options);
        ClientResult<Internal.Models.AssistantObject> internalResult
            = await Shim.ModifyAssistantAsync(assistantId, request).ConfigureAwait(false);
        return ClientResult.FromValue(new Assistant(internalResult.Value), internalResult.GetRawResponse());
    }

     public virtual ClientResult<bool> DeleteAssistant(string assistantId)
    {
        ClientResult<Internal.Models.DeleteAssistantResponse> internalResponse = Shim.DeleteAssistant(assistantId);
        return ClientResult.FromValue(internalResponse.Value.Deleted, internalResponse.GetRawResponse());
    }

    public virtual async Task<ClientResult<bool>> DeleteAssistantAsync(
        string assistantId)
    {
        ClientResult<Internal.Models.DeleteAssistantResponse> internalResponse
            = await Shim.DeleteAssistantAsync(assistantId).ConfigureAwait(false);
        return ClientResult.FromValue(internalResponse.Value.Deleted, internalResponse.GetRawResponse());
    }

    public virtual ClientResult<AssistantFileAssociation> CreateAssistantFileAssociation(
        string assistantId,
        string fileId)
    {
        ClientResult<Internal.Models.AssistantFileObject> internalResult
            = Shim.CreateAssistantFile(assistantId, new(fileId));
        return ClientResult.FromValue(new AssistantFileAssociation(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual async Task<ClientResult<AssistantFileAssociation>> CreateAssistantFileAssociationAsync(
        string assistantId,
        string fileId)
    {
        ClientResult<Internal.Models.AssistantFileObject> internalResult
            = await Shim.CreateAssistantFileAsync(assistantId, new(fileId)).ConfigureAwait(false);
        return ClientResult.FromValue(new AssistantFileAssociation(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual ClientResult<AssistantFileAssociation> GetAssistantFileAssociation(
        string assistantId,
        string fileId)
    {
        ClientResult<Internal.Models.AssistantFileObject> internalResult = Shim.GetAssistantFile(assistantId, fileId);
        return ClientResult.FromValue(new AssistantFileAssociation(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual async Task<ClientResult<AssistantFileAssociation>> GetAssistantFileAssociationAsync(
        string assistantId,
        string fileId)
    {
        ClientResult<Internal.Models.AssistantFileObject> internalResult
            = await Shim.GetAssistantFileAsync(assistantId, fileId).ConfigureAwait(false);
        return ClientResult.FromValue(new AssistantFileAssociation(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual ClientResult<ListQueryPage<AssistantFileAssociation>> GetAssistantFileAssociations(
        string assistantId,
        int? maxResults = null,
        CreatedAtSortOrder? createdSortOrder = null,
        string previousId = null,
        string subsequentId = null)
    {
        ClientResult<Internal.Models.ListAssistantFilesResponse> internalFunc() => Shim.GetAssistantFiles(
            assistantId,
            maxResults,
            ToInternalListOrder(createdSortOrder),
            previousId,
            subsequentId);
        return GetListQueryPage<AssistantFileAssociation, Internal.Models.ListAssistantFilesResponse>(internalFunc);
    }

    public virtual Task<ClientResult<ListQueryPage<AssistantFileAssociation>>> GetAssistantFileAssociationsAsync(
        string assistantId,
        int? maxResults = null,
        CreatedAtSortOrder? createdSortOrder = null,
        string previousId = null,
        string subsequentId = null)
    {
        Func<Task<ClientResult<Internal.Models.ListAssistantFilesResponse>>> internalFunc
            = () => Shim.GetAssistantFilesAsync(
                assistantId,
                maxResults,
                ToInternalListOrder(createdSortOrder),
                previousId,
                subsequentId);
        return GetListQueryPageAsync<AssistantFileAssociation, Internal.Models.ListAssistantFilesResponse>(internalFunc);
    }

    public virtual ClientResult<bool> RemoveAssistantFileAssociation(
        string assistantId,
        string fileId)
    {
        ClientResult<Internal.Models.DeleteAssistantFileResponse> internalResult
            = Shim.DeleteAssistantFile(assistantId, fileId);
        return ClientResult.FromValue(internalResult.Value.Deleted, internalResult.GetRawResponse());
    }

    public virtual async Task<ClientResult<bool>> RemoveAssistantFileAssociationAsync(
        string assistantId,
        string fileId)
    {
        ClientResult<Internal.Models.DeleteAssistantFileResponse> internalResult
            = await Shim.DeleteAssistantFileAsync(assistantId, fileId).ConfigureAwait(false);
        return ClientResult.FromValue(internalResult.Value.Deleted, internalResult.GetRawResponse());
    }

    public virtual ClientResult<AssistantThread> CreateThread(
        ThreadCreationOptions options = null)
    {
        Internal.Models.CreateThreadRequest request = CreateInternalCreateThreadRequest(options);
        ClientResult<Internal.Models.ThreadObject> internalResult = ThreadShim.CreateThread(request);
        return ClientResult.FromValue(new AssistantThread(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual async Task<ClientResult<AssistantThread>> CreateThreadAsync(
        ThreadCreationOptions options = null)
    {
        Internal.Models.CreateThreadRequest request = CreateInternalCreateThreadRequest(options);
        ClientResult<Internal.Models.ThreadObject> internalResult
            = await ThreadShim.CreateThreadAsync(request).ConfigureAwait(false);
        return ClientResult.FromValue(new AssistantThread(internalResult.Value), internalResult.GetRawResponse());
    }

     public virtual ClientResult<AssistantThread> GetThread(string threadId)
    {
        ClientResult<Internal.Models.ThreadObject> internalResult = ThreadShim.GetThread(threadId);
        return ClientResult.FromValue(new AssistantThread(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual async Task<ClientResult<AssistantThread>> GetThreadAsync(
        string threadId)
    {
        ClientResult<Internal.Models.ThreadObject> internalResult
            = await ThreadShim.GetThreadAsync(threadId).ConfigureAwait(false);
        return ClientResult.FromValue(new AssistantThread(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual ClientResult<AssistantThread> ModifyThread(
        string threadId,
        ThreadModificationOptions options)
    {
        Internal.Models.ModifyThreadRequest request = new(
            options.Metadata,
            serializedAdditionalRawData: null);
        ClientResult<Internal.Models.ThreadObject> internalResult = ThreadShim.ModifyThread(threadId, request);
        return ClientResult.FromValue(new AssistantThread(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual async Task<ClientResult<AssistantThread>> ModifyThreadAsync(
        string threadId,
        ThreadModificationOptions options)
    {
        Internal.Models.ModifyThreadRequest request = new(
            options.Metadata,
            serializedAdditionalRawData: null);
        ClientResult<Internal.Models.ThreadObject> internalResult
            = await ThreadShim.ModifyThreadAsync(threadId, request);
        return ClientResult.FromValue(new AssistantThread(internalResult.Value), internalResult.GetRawResponse());
    }

     public virtual ClientResult<bool> DeleteThread(string threadId)
    {
        ClientResult<Internal.Models.DeleteThreadResponse> internalResult = ThreadShim.DeleteThread(threadId);
        return ClientResult.FromValue(internalResult.Value.Deleted, internalResult.GetRawResponse());
    }

     public virtual async Task<ClientResult<bool>> DeleteThreadAsync(string threadId)
    {
        ClientResult<Internal.Models.DeleteThreadResponse> internalResult
            = await ThreadShim.DeleteThreadAsync(threadId).ConfigureAwait(false);
        return ClientResult.FromValue(internalResult.Value.Deleted, internalResult.GetRawResponse());
    }

    public virtual ClientResult<ThreadMessage> CreateMessage(
        string threadId,
        MessageRole role,
        string content,
        MessageCreationOptions options = null)
    {
        Internal.Models.CreateMessageRequest request = new(
            ToInternalRequestRole(role),
            content,
            options.FileIds,
            options.Metadata,
            serializedAdditionalRawData: null);
        ClientResult<Internal.Models.MessageObject> internalResult = MessageShim.CreateMessage(threadId, request);
        return ClientResult.FromValue(new ThreadMessage(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual async Task<ClientResult<ThreadMessage>> CreateMessageAsync(
        string threadId,
        MessageRole role,
        string content,
        MessageCreationOptions options = null)
    {
        Internal.Models.CreateMessageRequest request = new(
            ToInternalRequestRole(role),
            content,
            options.FileIds,
            options.Metadata,
            serializedAdditionalRawData: null);
        ClientResult<Internal.Models.MessageObject> internalResult
            = await MessageShim.CreateMessageAsync(threadId, request).ConfigureAwait(false);
        return ClientResult.FromValue(new ThreadMessage(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual ClientResult<ThreadMessage> GetMessage(
        string threadId,
        string messageId)
    {
        ClientResult<Internal.Models.MessageObject> internalResult = MessageShim.GetMessage(threadId, messageId);
        return ClientResult.FromValue(new ThreadMessage(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual async Task<ClientResult<ThreadMessage>> GetMessageAsync(
        string threadId,
        string messageId)
    {
        ClientResult<Internal.Models.MessageObject> internalResult
            = await MessageShim.GetMessageAsync(threadId, messageId).ConfigureAwait(false);
        return ClientResult.FromValue(new ThreadMessage(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual ClientResult<ListQueryPage<ThreadMessage>> GetMessages(
        string threadId,
        int? maxResults = null,
        CreatedAtSortOrder? createdSortOrder = null,
        string previousMessageId = null,
        string subsequentMessageId = null)
    {
        ClientResult<Internal.Models.ListMessagesResponse> internalFunc() => MessageShim.GetMessages(
            threadId,
            maxResults,
            ToInternalListOrder(createdSortOrder),
            previousMessageId,
            subsequentMessageId);
        return GetListQueryPage<ThreadMessage, Internal.Models.ListMessagesResponse>(internalFunc);
    }

    public virtual Task<ClientResult<ListQueryPage<ThreadMessage>>> GetMessagesAsync(
        string threadId,
        int? maxResults = null,
        CreatedAtSortOrder? createdSortOrder = null,
        string previousMessageId = null,
        string subsequentMessageId = null)
    {
        Func<Task<ClientResult<Internal.Models.ListMessagesResponse>>> internalFunc = () => MessageShim.GetMessagesAsync(
                threadId,
                maxResults,
                ToInternalListOrder(createdSortOrder),
                previousMessageId,
                subsequentMessageId);
        return GetListQueryPageAsync<ThreadMessage, Internal.Models.ListMessagesResponse>(internalFunc);
    }

    public virtual ClientResult<MessageFileAssociation> GetMessageFileAssociation(
        string threadId,
        string messageId,
        string fileId)
    {
        ClientResult<Internal.Models.MessageFileObject> internalResult
            = MessageShim.GetMessageFile(threadId, messageId, fileId);
        return ClientResult.FromValue(new MessageFileAssociation(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual async Task<ClientResult<MessageFileAssociation>> GetMessageFileAssociationAsync(
        string threadId,
        string messageId,
        string fileId)
    {
        ClientResult<Internal.Models.MessageFileObject> internalResult
            = await MessageShim.GetMessageFileAsync(threadId, messageId, fileId).ConfigureAwait(false);
        return ClientResult.FromValue(new MessageFileAssociation(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual ClientResult<ListQueryPage<MessageFileAssociation>> GetMessageFileAssociations(
        string threadId,
        string messageId,
        int? maxResults = null,
        CreatedAtSortOrder? createdSortOrder = null,
        string previousId = null,
        string subsequentId = null)
    {
        ClientResult<Internal.Models.ListMessageFilesResponse> internalFunc() => MessageShim.GetMessageFiles(
            threadId,
            messageId,
            maxResults,
            ToInternalListOrder(createdSortOrder),
            previousId,
            subsequentId);
        return GetListQueryPage<MessageFileAssociation, Internal.Models.ListMessageFilesResponse>(internalFunc);
    }

    public virtual Task<ClientResult<ListQueryPage<MessageFileAssociation>>> GetMessageFileAssociationsAsync(
        string threadId,
        string messageId,
        int? maxResults = null,
        CreatedAtSortOrder? createdSortOrder = null,
        string previousId = null,
        string subsequentId = null)
    {
        Task<ClientResult<Internal.Models.ListMessageFilesResponse>> internalFunc() => MessageShim.GetMessageFilesAsync(
            threadId,
            messageId,
            maxResults,
            ToInternalListOrder(createdSortOrder),
            previousId,
            subsequentId);
        return GetListQueryPageAsync<MessageFileAssociation, Internal.Models.ListMessageFilesResponse>(internalFunc);
    }

    public virtual ClientResult<ThreadRun> CreateRun(
        string threadId,
        string assistantId,
        RunCreationOptions options = null)
    {
        Internal.Models.CreateRunRequest request = CreateInternalCreateRunRequest(assistantId, options);
        ClientResult<Internal.Models.RunObject> internalResult = RunShim.CreateRun(threadId, request);
        return ClientResult.FromValue(new ThreadRun(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual async Task<ClientResult<ThreadRun>> CreateRunAsync(
        string threadId,
        string assistantId,
        RunCreationOptions options = null)
    {
        Internal.Models.CreateRunRequest request = CreateInternalCreateRunRequest(assistantId, options);
        ClientResult<Internal.Models.RunObject> internalResult
            = await RunShim.CreateRunAsync(threadId, request).ConfigureAwait(false);
        return ClientResult.FromValue(new ThreadRun(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual ClientResult<ThreadRun> CreateThreadAndRun(
        string assistantId,
        ThreadCreationOptions threadOptions = null,
        RunCreationOptions runOptions = null)
    {
        Internal.Models.CreateThreadAndRunRequest request
            = CreateInternalCreateThreadAndRunRequest(assistantId, threadOptions, runOptions);
        ClientResult<Internal.Models.RunObject> internalResult = RunShim.CreateThreadAndRun(request);
        return ClientResult.FromValue(new ThreadRun(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual async Task<ClientResult<ThreadRun>> CreateThreadAndRunAsync(
        string assistantId,
        ThreadCreationOptions threadOptions = null,
        RunCreationOptions runOptions = null)
    {
        Internal.Models.CreateThreadAndRunRequest request
            = CreateInternalCreateThreadAndRunRequest(assistantId, threadOptions, runOptions);
        ClientResult<Internal.Models.RunObject> internalResult
            = await RunShim.CreateThreadAndRunAsync(request).ConfigureAwait(false);
        return ClientResult.FromValue(new ThreadRun(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual ClientResult<ThreadRun> GetRun(string threadId, string runId)
    {
        ClientResult<Internal.Models.RunObject> internalResult = RunShim.GetRun(threadId, runId);
        return ClientResult.FromValue(new ThreadRun(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual async Task<ClientResult<ThreadRun>> GetRunAsync(string threadId, string runId)
    {
        ClientResult<Internal.Models.RunObject> internalResult
            = await RunShim.GetRunAsync(threadId, runId).ConfigureAwait(false);
        return ClientResult.FromValue(new ThreadRun(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual ClientResult<ListQueryPage<ThreadRun>> GetRuns(
        string threadId,
        int? maxResults = null,
        CreatedAtSortOrder? createdSortOrder = null,
        string previousRunId = null,
        string subsequentRunId = null)
    {
        ClientResult<Internal.Models.ListRunsResponse> internalFunc() => RunShim.GetRuns(
            threadId,
            maxResults,
            ToInternalListOrder(createdSortOrder),
            previousRunId,
            subsequentRunId);
        return GetListQueryPage<ThreadRun, Internal.Models.ListRunsResponse>(internalFunc);
    }

    public virtual Task<ClientResult<ListQueryPage<ThreadRun>>> GetRunsAsync(
        string threadId,
        int? maxResults = null,
        CreatedAtSortOrder? createdSortOrder = null,
        string previousRunId = null,
        string subsequentRunId = null)
    {
        Func<Task<ClientResult<Internal.Models.ListRunsResponse>>> internalFunc = () => RunShim.GetRunsAsync(
            threadId,
            maxResults,
            ToInternalListOrder(createdSortOrder),
            previousRunId,
            subsequentRunId);
        return GetListQueryPageAsync<ThreadRun, Internal.Models.ListRunsResponse>(internalFunc);
    }

    public virtual ClientResult<ThreadRun> ModifyRun(string threadId, string runId, RunModificationOptions options)
    {
        Internal.Models.ModifyRunRequest request = new(options.Metadata, serializedAdditionalRawData: null);
        ClientResult<Internal.Models.RunObject> internalResult = RunShim.ModifyRun(threadId, runId, request);
        return ClientResult.FromValue(new ThreadRun(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual async Task<ClientResult<ThreadRun>> ModifyRunAsync(string threadId, string runId, RunModificationOptions options)
    {
        Internal.Models.ModifyRunRequest request = new(options.Metadata, serializedAdditionalRawData: null);
        ClientResult<Internal.Models.RunObject> internalResult
            = await RunShim.ModifyRunAsync(threadId, runId, request).ConfigureAwait(false);
        return ClientResult.FromValue(new ThreadRun(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual ClientResult<bool> CancelRun(string threadId, string runId)
    {
        ClientResult<Internal.Models.RunObject> internalResult = RunShim.CancelRun(threadId, runId);
        return ClientResult.FromValue(true, internalResult.GetRawResponse());
    }

    public virtual async Task<ClientResult<bool>> CancelRunAsync(string threadId, string runId)
    {
        ClientResult<Internal.Models.RunObject> internalResult
            = await RunShim.CancelRunAsync(threadId, runId);
        return ClientResult.FromValue(true, internalResult.GetRawResponse());
    }

    public virtual ClientResult<ThreadRun> SubmitToolOutputs(string threadId, string runId, IEnumerable<ToolOutput> toolOutputs)
    {
        List<Internal.Models.SubmitToolOutputsRunRequestToolOutput> requestToolOutputs = [];

        foreach (ToolOutput toolOutput in toolOutputs)
        {
            requestToolOutputs.Add(new(toolOutput.Id, toolOutput.Output, null));
        }

        Internal.Models.SubmitToolOutputsRunRequest request = new(requestToolOutputs, null);
        ClientResult<Internal.Models.RunObject> internalResult = RunShim.SubmitToolOuputsToRun(threadId, runId, request);
        return ClientResult.FromValue(new ThreadRun(internalResult.Value), internalResult.GetRawResponse());
    }

    public virtual async Task<ClientResult<bool>> SubmitToolOutputsAsync(string threadId, string runId, IEnumerable<ToolOutput> toolOutputs)
    {
        List<Internal.Models.SubmitToolOutputsRunRequestToolOutput> requestToolOutputs = [];

        foreach (ToolOutput toolOutput in toolOutputs)
        {
            requestToolOutputs.Add(new(toolOutput.Id, toolOutput.Output, null));
        }

        Internal.Models.SubmitToolOutputsRunRequest request = new(requestToolOutputs, null);
        ClientResult<Internal.Models.RunObject> internalResult
            = await RunShim.SubmitToolOuputsToRunAsync(threadId, runId, request).ConfigureAwait(false);
        return ClientResult.FromValue(true, internalResult.GetRawResponse());
    }

    internal static Internal.Models.CreateAssistantRequest CreateInternalCreateAssistantRequest(
        string modelName,
        AssistantCreationOptions options)
    {
        options ??= new();
        return new Internal.Models.CreateAssistantRequest(
            modelName,
            options.Name,
            options.Description,
            options.Instructions,
            ToInternalBinaryDataList(options.Tools),
            options.FileIds,
            options.Metadata,
            serializedAdditionalRawData: null);
    }

    internal static Internal.Models.ModifyAssistantRequest CreateInternalModifyAssistantRequest(AssistantModificationOptions options)
    {
        return new Internal.Models.ModifyAssistantRequest(
            options.Model,
            options.Name,
            options.Description,
            options.Instructions,
            ToInternalBinaryDataList(options.Tools),
            options.FileIds,
            options.Metadata,
            serializedAdditionalRawData: null);
    }

    internal static Internal.Models.CreateThreadRequest CreateInternalCreateThreadRequest(ThreadCreationOptions options)
    {
        options ??= new();
        return new Internal.Models.CreateThreadRequest(
            ToInternalCreateMessageRequestList(options.Messages),
            options.Metadata,
            serializedAdditionalRawData: null);
    }

    internal static Internal.Models.CreateRunRequest CreateInternalCreateRunRequest(
        string assistantId,
        RunCreationOptions options = null)
    {
        options ??= new();
        return new(
            assistantId,
            options.OverrideModel,
            options.OverrideInstructions,
            options.AdditionalInstructions,
            ToInternalBinaryDataList(options.OverrideTools),
            options.Metadata,
            serializedAdditionalRawData: null);
    }

    internal static Internal.Models.CreateThreadAndRunRequest CreateInternalCreateThreadAndRunRequest(
        string assistantId,
        ThreadCreationOptions threadOptions,
        RunCreationOptions runOptions)
    {
        threadOptions ??= new();
        runOptions ??= new();
        Internal.Models.CreateThreadRequest internalThreadOptions = CreateInternalCreateThreadRequest(threadOptions);
        return new Internal.Models.CreateThreadAndRunRequest(
            assistantId,
            internalThreadOptions,
            runOptions?.OverrideModel,
            runOptions.OverrideInstructions,
            ToInternalBinaryDataList(runOptions?.OverrideTools),
            runOptions?.Metadata,
            serializedAdditionalRawData: null);
    }

    internal static OptionalList<BinaryData> ToInternalBinaryDataList<T>(IEnumerable<T> values)
        where T : IPersistableModel<T>
    {
        OptionalList<BinaryData> internalList = [];
        foreach (T value in values)
        {
            internalList.Add(ModelReaderWriter.Write(value));
        }
        return internalList;
    }

    internal static Internal.Models.ListOrder? ToInternalListOrder(CreatedAtSortOrder? order)
    {
        if (order == null)
        {
            return null;
        }
        return order switch
        {
            CreatedAtSortOrder.OldestFirst => Internal.Models.ListOrder.Asc,
            CreatedAtSortOrder.NewestFirst => Internal.Models.ListOrder.Desc,
            _ => throw new ArgumentException(nameof(order)),
        };
    }

    internal static Internal.Models.CreateMessageRequestRole ToInternalRequestRole(MessageRole role)
    => role switch
    {
        MessageRole.User => Internal.Models.CreateMessageRequestRole.User,
        _ => throw new ArgumentException(nameof(role)),
    };

    internal static OptionalList<Internal.Models.CreateMessageRequest> ToInternalCreateMessageRequestList(
        IEnumerable<ThreadInitializationMessage> messages)
    {
        OptionalList<Internal.Models.CreateMessageRequest> internalList = [];
        foreach (ThreadInitializationMessage message in messages)
        {
            internalList.Add(new Internal.Models.CreateMessageRequest(
                ToInternalRequestRole(message.Role),
                message.Content,
                message.FileIds,
                message.Metadata,
                serializedAdditionalRawData: null));
        }
        return internalList;
    }

    internal virtual ClientResult<ListQueryPage<T>> GetListQueryPage<T, U>(Func<ClientResult<U>> internalFunc)
        where T : class
        where U : class
    {
        ClientResult<U> internalResult = internalFunc.Invoke();
        ListQueryPage<T> convertedValue = ListQueryPage.Create(internalResult.Value) as ListQueryPage<T>;
        return ClientResult.FromValue(convertedValue, internalResult.GetRawResponse());
    }

    internal virtual async Task<ClientResult<ListQueryPage<T>>> GetListQueryPageAsync<T, U>(Func<Task<ClientResult<U>>> internalAsyncFunc)
        where T : class
        where U : class
    {
        ClientResult<U> internalResult = await internalAsyncFunc.Invoke();
        ListQueryPage<T> convertedValue = ListQueryPage.Create(internalResult.Value) as ListQueryPage<T>;
        return ClientResult.FromValue(convertedValue, internalResult.GetRawResponse());
    }
}

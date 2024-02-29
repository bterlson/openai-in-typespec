using System;
using System.Collections.Generic;
using System.Text.Json;

namespace OpenAI.Assistants;

public partial class ThreadRun
{
    public string Id { get; }
    public string ThreadId { get; }
    public string AssistantId { get; }
    public DateTimeOffset CreatedAt { get; }

    public RunStatus Status { get; }

    public IReadOnlyList<RunRequiredAction> RequiredActions { get; }

    public RunError LastError { get; }
    public DateTimeOffset? ExpiresAt { get; }
    public DateTimeOffset? StartedAt { get; } 
    public DateTimeOffset? CancelledAt { get; }
    public DateTimeOffset? FailedAt { get; }
    public DateTimeOffset? CompletedAt { get; }
    public string Model { get; }
    public string Instructions { get; }
    public IReadOnlyList<ToolInfo> Tools { get; }
    public IReadOnlyList<string> FileIds { get; }
    /// <summary>
    /// An optional key/value mapping of additional, supplemental data items to attach to the <see cref="Assistant"/>.
    /// This information may be useful for storing custom details in a structured format.
    /// </summary>
    /// <remarks>
    /// <list type="bullet">
    ///     <item><b>Keys</b> can be a maximum of 64 characters in length.</item>
    ///     <item><b>Values</b> can be a maximum of 512 characters in length.</item>
    /// </list>
    /// </remarks>
    public IReadOnlyDictionary<string, string> Metadata { get; }
    public RunTokenUsage Usage { get; }

    internal ThreadRun(Internal.Models.RunObject internalRun)
    {
        Id = internalRun.Id;
        ThreadId = internalRun.ThreadId;
        AssistantId = internalRun.AssistantId;
        CreatedAt = internalRun.CreatedAt;
        FailedAt = internalRun.FailedAt;
        ExpiresAt = internalRun.ExpiresAt;
        StartedAt = internalRun.StartedAt;
        CancelledAt = internalRun.CancelledAt;
        CompletedAt = internalRun.CompletedAt;
        Status = internalRun.Status.ToString() switch
        {
            "queued" => RunStatus.Queued,
            "in_progress" => RunStatus.InProgress,
            "requires_action" => RunStatus.RequiresAction,
            "cancelling" => RunStatus.Cancelling,
            "cancelled" => RunStatus.Cancelled,
            "failed" => RunStatus.Failed,
            "completed" => RunStatus.CompletedSuccessfully,
            "expired" => RunStatus.Expired,
            _ => throw new ArgumentException(nameof(Status)),
        };
        Metadata = internalRun.Metadata;
        FileIds = internalRun.FileIds;
        Metadata = internalRun.Metadata;
        Model = internalRun.Model;
        Instructions = internalRun.Instructions;

        if (internalRun.LastError != null)
        {
            LastError = new(internalRun.LastError);
        }

        if (internalRun.Usage != null)
        {
            Usage = new(internalRun.Usage);
        }

        if (internalRun.Tools != null)
        {
            List<ToolInfo> tools = [];
            foreach (BinaryData unionToolInfo in internalRun.Tools)
            {
                tools.Add(ToolInfo.DeserializeToolInfo(JsonDocument.Parse(unionToolInfo).RootElement));
            }
            Tools = tools;
        }

        IReadOnlyList<Internal.Models.RunToolCallObject> internalFunctionCalls
            = internalRun.RequiredAction?.SubmitToolOutputs?.ToolCalls;
        if (internalFunctionCalls != null)
        {
            List<RunRequiredAction> actions = [];
            foreach (Internal.Models.RunToolCallObject internalToolCall in internalFunctionCalls)
            {
                actions.Add(new RequiredFunctionToolCall(
                    internalToolCall.Id,
                    internalToolCall.Function.Name,
                    internalToolCall.Function.Arguments));
            }
            RequiredActions = actions;
        }
    }
}

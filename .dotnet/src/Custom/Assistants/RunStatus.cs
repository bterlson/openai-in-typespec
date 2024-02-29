namespace OpenAI.Assistants;

public enum RunStatus
{
    Queued,
    InProgress,
    RequiresAction,
    Cancelling,
    CompletedSuccessfully,
    Cancelled,
    Failed,
    Expired,
}
namespace OpenAI.Assistants;

/// <summary>
/// Represents the role associated with the message which indicates its source and purpose.
/// </summary>
public enum MessageRole
{
    /// <summary>
    /// The <c>user</c> role, associated with caller input into the model.
    /// </summary>
    User,
    /// <summary>
    /// The <c>assistant</c> role, associated with model output in response to inputs from the user and tools.
    /// </summary>
    Assistant,
}

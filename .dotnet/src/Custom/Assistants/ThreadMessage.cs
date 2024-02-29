using System;
using System.Collections.Generic;
using System.Text.Json;

namespace OpenAI.Assistants;

public partial class ThreadMessage
{
    public string Id { get; }
    public DateTimeOffset CreatedAt { get; }
    public string ThreadId { get; }
    public MessageRole Role { get; }
    public IReadOnlyList<MessageContent> ContentItems { get; }
    public string AssistantId { get; }

    public string RunId { get; }
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

    internal ThreadMessage(Internal.Models.MessageObject internalMessage)
    {
        MessageRole convertedRole = MessageRole.User;
        if (internalMessage.Role.ToString() == "user")
        {
            convertedRole = MessageRole.User;
        }
        else if (internalMessage.Role.ToString() == "assistant")
        {
            convertedRole = MessageRole.Assistant;
        }
        else
        {
            throw new ArgumentException(internalMessage.Role.ToString());
        }

        List<MessageContent> content = [];
        foreach (BinaryData unionContentData in internalMessage.Content)
        {
            content.Add(MessageContent.DeserializeMessageContent(JsonDocument.Parse(unionContentData).RootElement));
        }

        Id = internalMessage.Id;
        AssistantId = internalMessage.AssistantId;
        ThreadId = internalMessage.ThreadId;
        RunId = internalMessage.RunId;
        Metadata = internalMessage.Metadata;
        FileIds = internalMessage.FileIds;
        CreatedAt = internalMessage.CreatedAt;
        Role = convertedRole;
        ContentItems = content;
    }
}

using System;

namespace OpenAI.Assistants;

public partial class MessageFileAssociation
{
    public string MessageId { get; }
    public string FileId { get; }
    public DateTimeOffset CreatedAt { get; }

    internal MessageFileAssociation(Internal.Models.MessageFileObject internalFile)
    {
        MessageId = internalFile.MessageId;
        FileId = internalFile.Id;
        CreatedAt = internalFile.CreatedAt;
    }
}

using System;

namespace OpenAI.Assistants;

public partial class AssistantFileAssociation
{
    public string AssistantId { get; }
    public string FileId { get; }
    public DateTimeOffset CreatedAt { get; }

    internal AssistantFileAssociation(Internal.Models.AssistantFileObject internalFile)
    {
        AssistantId = internalFile.AssistantId;
        FileId = internalFile.Id;
        CreatedAt = internalFile.CreatedAt;
    }
}

using System;
using System.Collections.Generic;
namespace OpenAI.Assistants;

public partial class AssistantThread
{
    public string Id { get; }

    public DateTimeOffset CreatedAt { get; }

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


    internal AssistantThread(Internal.Models.ThreadObject internalThread)
    {
        Id = internalThread.Id;
        Metadata = internalThread.Metadata;
        CreatedAt = internalThread.CreatedAt;
    }

}

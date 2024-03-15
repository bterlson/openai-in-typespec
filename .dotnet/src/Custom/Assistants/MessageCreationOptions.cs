using OpenAI.ClientShared.Internal;
using System.ClientModel.Internal;

using System.Collections.Generic;

namespace OpenAI.Assistants;

/// <summary>
/// Represents additional options available when creating a new <see cref="ThreadMessage"/>.
/// </summary>
public partial class MessageCreationOptions
{
    /// <summary>
    /// A collection of IDs for previously uploaded files that are made accessible to the message. These IDs are the
    /// basis for the functionality of file-based tools like <c>retrieval</c>.
    /// </summary>
    public IList<string> FileIds { get; } = new ChangeTrackingList<string>();

    /// <summary>
    /// An optional key/value mapping of additional, supplemental data items to attach to the <see cref="ThreadMessage"/>.
    /// This information may be useful for storing custom details in a structured format.
    /// </summary>
    /// <remarks>
    /// <list type="bullet">
    ///     <item><b>Keys</b> can be a maximum of 64 characters in length.</item>
    ///     <item><b>Values</b> can be a maximum of 512 characters in length.</item>
    /// </list>
    /// </remarks>
    public IDictionary<string, string> Metadata { get; } = new ChangeTrackingDictionary<string, string>();
}
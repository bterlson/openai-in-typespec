using OpenAI.ClientShared.Internal;
using System.ClientModel.Internal;

using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace OpenAI.Assistants;

public partial class ThreadInitializationMessage
{
    public required MessageRole Role { get; set; }

    public required string Content { get; set; }

    /// <summary>
    /// A list of File IDs that the message should use.There can be a maximum of 10 files attached to a message. Useful
    /// for tools like retrieval and code_interpreter that can access and use files.
    /// </summary>
    public IList<string> FileIds { get; } = new OptionalList<string>();

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
    public IDictionary<string, string> Metadata { get; } = new OptionalDictionary<string, string>();

    [SetsRequiredMembers]
    public ThreadInitializationMessage(MessageRole role, string content)
    {
        Role = role;
        Content = content;
    }

    public ThreadInitializationMessage()
    { }

    public static implicit operator ThreadInitializationMessage(string content)
        => new(MessageRole.User, content);
}

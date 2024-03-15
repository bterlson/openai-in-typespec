using OpenAI.ClientShared.Internal;
using System.ClientModel.Internal;

using System.Collections.Generic;

namespace OpenAI.Assistants;

/// <summary>
/// Represents additional options available when modifying an existing <see cref="Assistant"/>.
/// </summary>
public partial class AssistantModificationOptions
{
    /// <summary>
    /// The new model that the assistant should use when creating messages.
    /// </summary>
    public string Model { get; }

    /// <summary>
    /// A new, friendly name for the assistant. Its <see cref="Assistant.Id"/> will remain unchanged.
    /// </summary>
    public string Name { get; }

    /// <summary>
    /// A new description to associate with the assistant.
    /// </summary>
    public string Description { get; }

    /// <summary>
    /// New, default instructions for the assistant to use when creating messages.
    /// </summary>
    public string Instructions { get; }

    /// <summary>
    /// A new collection of default tool definitions to enable for the assistant. Available tools include:
    /// <para>
    /// <list type="bullet">
    /// <item>
    ///     <c>code_interpreter</c> - <see cref="CodeInterpreterToolDefinition"/> 
    ///     - works with data, math, and computer code
    /// </item>
    /// <item>
    ///     <c>retrieval</c> - <see cref="RetrievalToolDefinition"/> 
    ///     - dynamically enriches an assistant's context with content from uploaded, indexed files
    /// </item>
    /// <item>
    ///     <c>function</c> - <see cref="FunctionToolDefinition"/>
    ///     - enables caller-provided custom functions for actions and enrichment
    /// </item>
    /// </list>
    /// </para>
    /// </summary>
    public IList<ToolDefinition> Tools { get; } = new ChangeTrackingList<ToolDefinition>();

    /// <summary>
    /// A new collection of IDs for previously uploaded files that are made accessible to the assistant. These IDs are
    /// the basis for the functionality of file-based tools like <c>retrieval</c>.
    /// </summary>
    public IList<string> FileIds { get; } = new ChangeTrackingList<string>();

    /// <summary>
    /// A replacement for the optional key/value mapping of additional, supplemental data items to attach to the
    /// <see cref="Assistant"/>. This information may be useful for storing custom details in a structured format.
    /// </summary>
    /// <remarks>
    /// <list type="bullet">
    ///     <item><b>Keys</b> can be a maximum of 64 characters in length.</item>
    ///     <item><b>Values</b> can be a maximum of 512 characters in length.</item>
    /// </list>
    /// </remarks>
    public IDictionary<string, string> Metadata { get; } = new ChangeTrackingDictionary<string, string>();
}
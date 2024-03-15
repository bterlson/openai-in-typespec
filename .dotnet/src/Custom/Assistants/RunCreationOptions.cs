using OpenAI.ClientShared.Internal;
using System.ClientModel.Internal;

using System.Collections.Generic;

namespace OpenAI.Assistants;

/// <summary>
/// Represents additional options available when creating a new <see cref="ThreadRun"/>.
/// </summary>
public partial class RunCreationOptions
{


    /// <summary>
    /// A run-specific model name that will override the assistant's defined model. If not provided, the assistant's
    /// selection will be used.
    /// </summary>
    public string OverrideModel { get; set; }

    /// <summary>
    /// A run specific replacement for the assistant's default instructions that will override the assistant-level
    /// instructions. If not specified, the assistant's instructions will be used.
    /// </summary>
    public string OverrideInstructions { get; set; }

    /// <summary>
    /// Run-specific additional instructions that will be appended to the assistant-level instructions solely for this
    /// run. Unlike <see cref="OverrideInstructions"/>, the assistant's instructions are preserved and these additional
    /// instructions are concatenated.
    /// </summary>
    public string AdditionalInstructions { get; set; }

    /// <summary>
    /// A run-specific collection of tool definitions that will override the assistant-level defaults. If not provided,
    /// the assistant's defined tools will be used. Available tools include:
    /// <para>
    /// <list type="bullet">
    /// <item>
    ///     <c>code_interpreter</c> - <see cref="CodeInterpreterToolDefinition"/> 
    ///     - works with data, math, and computer code
    /// </item>
    /// <item>
    ///     <c>retrieval</c> - <see cref="RetrievalToolDefinition"/> 
    ///     - dynamically enriches an Run's context with content from uploaded, indexed files
    /// </item>
    /// <item>
    ///     <c>function</c> - <see cref="FunctionToolDefinition"/>
    ///     - enables caller-provided custom functions for actions and enrichment
    /// </item>
    /// </list>
    /// </para>
    /// </summary>
    public IList<ToolDefinition> OverrideTools { get; } = new ChangeTrackingList<ToolDefinition>();

    /// <summary>
    /// An optional key/value mapping of additional, supplemental data items to attach to the <see cref="ThreadRun"/>.
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
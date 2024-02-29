using System;
using System.Collections.Generic;
using System.Text.Json;

namespace OpenAI.Assistants;

public partial class Assistant
{
    public string Id { get; }
    public DateTimeOffset CreatedAt { get; }
    public string Name { get; }
    public string Description { get; }
    public string DefaultModel { get; }
    public string DefaultInstructions { get; }
    public IReadOnlyList<ToolDefinition> DefaultTools { get; }
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

    internal Assistant(Internal.Models.AssistantObject internalAssistant)
    {
        Id = internalAssistant.Id;
        CreatedAt = internalAssistant.CreatedAt;
        Name = internalAssistant.Name;
        Description = internalAssistant.Description;
        DefaultModel = internalAssistant.Model;
        DefaultInstructions = internalAssistant.Instructions;
        Metadata = internalAssistant.Metadata;

        if (internalAssistant.Tools != null)
        {
            List<ToolDefinition> tools = [];
            foreach (BinaryData unionToolDefinitionData in internalAssistant.Tools)
            {
                tools.Add(ToolDefinition.DeserializeToolDefinition(JsonDocument.Parse(unionToolDefinitionData).RootElement));
            }
            DefaultTools = tools;
        }
    }
}

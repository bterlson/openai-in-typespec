using System;
using System.Diagnostics.CodeAnalysis;

namespace OpenAI.Chat;

/// <summary>
/// Represents the definition of a function tool that is callable by the model for a chat completion request.
/// </summary>
public class ChatFunctionToolDefinition : ChatToolDefinition
{
    /// <summary>
    /// The name of the function that the tool represents.
    /// </summary>
    public required string Name { get; set; }
    /// <summary>
    /// A friendly description of the function. This supplements <see cref="Name"/> in informing the model about when
    /// it should call the function.
    /// </summary>
    public string Description { get; set; }
    /// <summary>
    /// The parameter information for the function, provided in JSON Schema format.
    /// </summary>
    /// <remarks>
    /// The <see cref="BinaryData.FromObjectAsJson{T}(T, System.Text.Json.JsonSerializerOptions?)"/> method provides
    /// an easy definition interface using the <c>dynamic</c> type:
    /// <para><code>
    /// Parameters = BinaryData.FromObjectAsJson(new
    /// {
    ///     type = "object",
    ///     properties = new
    ///     {
    ///         your_function_argument = new
    ///         {
    ///             type = "string",
    ///             description = "the description of your function argument"
    ///         }
    ///     },
    ///     required = new[] { "your_function_argument" }
    /// })
    /// </code></para>
    /// </remarks>
    public BinaryData Parameters { get; set; }
    /// <summary>
    /// Creates a new instance of <see cref="ChatFunctionToolDefinition"/>.
    /// </summary>
    public ChatFunctionToolDefinition() { }
    /// <summary>
    /// Creates a new instance of <see cref="ChatFunctionToolDefinition"/>.
    /// </summary>
    /// <param name="name"> The <c>name</c> of the function. </param>
    /// <param name="description"> The <c>description</c> of the function. </param>
    /// <param name="parameters"> The <c>parameters</c> into the function, in JSON Schema format. </param>
    [SetsRequiredMembers]
    public ChatFunctionToolDefinition(string name, string description = null, BinaryData parameters = null)
    {
        Name = name;
        Description = description;
        Parameters = parameters;
    }
}
namespace OpenAI.Chat;

using System;
using System.Collections.Generic;
using System.Text.Json;

/// <summary>
/// Represents an incremental item of new data in a streaming response to a chat completion request.
/// </summary>
public partial class StreamingChatUpdate
{
    /// <summary>
    /// Gets a unique identifier associated with this streamed Chat Completions response.
    /// </summary>
    /// <remarks>
    /// <para>
    /// Corresponds to <c>$.id</c> in the underlying REST schema.
    /// </para>
    /// When using Azure OpenAI, note that the values of <see cref="Id"/> and <see cref="Created"/> may not be
    /// populated until the first <see cref="StreamingChatUpdate"/> containing role, content, or
    /// function information.
    /// </remarks>
    public string Id { get; }

    /// <summary>
    /// Gets the first timestamp associated with generation activity for this completions response,
    /// represented as seconds since the beginning of the Unix epoch of 00:00 on 1 Jan 1970.
    /// </summary>
    /// <remarks>
    /// <para>
    /// Corresponds to <c>$.created</c> in the underlying REST schema.
    /// </para>
    /// When using Azure OpenAI, note that the values of <see cref="Id"/> and <see cref="Created"/> may not be
    /// populated until the first <see cref="StreamingChatUpdate"/> containing role, content, or
    /// function information.
    /// </remarks>
    public DateTimeOffset? Created { get; }

    /// <summary>
    /// Gets the <see cref="ChatRole"/> associated with this update.
    /// </summary>
    /// <remarks>
    /// <para>
    /// Corresponds to e.g. <c>$.choices[0].delta.role</c> in the underlying REST schema.
    /// </para>
    /// <see cref="ChatRole"/> assignment typically occurs in a single update across a streamed Chat Completions
    /// choice and the value should be considered to be persist for all subsequent updates without a
    /// <see cref="ChatRole"/> that bear the same <see cref="ChoiceIndex"/>.
    /// </remarks>
    public ChatRole? Role { get; }

    /// <summary>
    /// Gets the content fragment associated with this update.
    /// </summary>
    /// <remarks>
    /// <para>
    /// Corresponds to e.g. <c>$.choices[0].delta.content</c> in the underlying REST schema.
    /// </para>
    /// Each update contains only a small number of tokens. When presenting or reconstituting a full, streamed
    /// response, all <see cref="ContentUpdate"/> values for the same <see cref="ChoiceIndex"/> should be
    /// combined.
    /// </remarks>
    public string ContentUpdate { get; }

    /// <summary>
    /// Gets the name of a function to be called.
    /// </summary>
    /// <remarks>
    /// Corresponds to e.g. <c>$.choices[0].delta.function_call.name</c> in the underlying REST schema.
    /// </remarks>
    public string FunctionName { get; }

    /// <summary>
    /// Gets a function arguments fragment associated with this update.
    /// </summary>
    /// <remarks>
    /// <para>
    /// Corresponds to e.g. <c>$.choices[0].delta.function_call.arguments</c> in the underlying REST schema.
    /// </para>
    ///
    /// <para>
    /// Each update contains only a small number of tokens. When presenting or reconstituting a full, streamed
    /// arguments body, all <see cref="FunctionArgumentsUpdate"/> values for the same <see cref="ChoiceIndex"/>
    /// should be combined.
    /// </para>
    ///
    /// <para>
    /// As is the case for non-streaming <see cref="ChatFunctionCall.Arguments"/>, the content provided for function
    /// arguments is not guaranteed to be well-formed JSON or to contain expected data. Callers should validate
    /// function arguments before using them.
    /// </para>
    /// </remarks>
    public string FunctionArgumentsUpdate { get; }

    /// <summary>
    /// An incremental update payload for a tool call that is part of this response.
    /// </summary>
    /// <remarks>
    /// <para>
    /// Corresponds to e.g. $.choices[0].delta.tool_calls[0].index in the REST API schema.
    /// </para>
    /// <para>
    /// To differentiate between parallel streaming tool calls within a single streaming choice, use the value of the
    /// <see cref="StreamingToolCallUpdate.ToolCallIndex"/> property.
    /// </para>
    /// <para>
    /// Please note <see cref="StreamingToolCallUpdate"/> is the base class. According to the scenario, a derived class
    /// of the base class might need to be assigned here, or this property needs to be casted to one of the possible
    /// derived classes.
    /// The available derived classes include: <see cref="StreamingFunctionToolCallUpdate"/>.
    /// </para>
    /// </remarks>
    public StreamingToolCallUpdate ToolCallUpdate { get; }

    /// <summary>
    /// Gets the <see cref="ChatFinishReason"/> associated with this update.
    /// </summary>
    /// <remarks>
    /// <para>
    /// Corresponds to e.g. $.choices[0].finish_reason in the underlying REST schema.
    /// </para>
    /// <para>
    /// <see cref="ChatFinishReason"/> assignment typically appears in the final streamed update message associated
    /// with a choice.
    /// </para>
    /// </remarks>
    public ChatFinishReason? FinishReason { get; }

    /// <summary>
    /// Gets the choice index associated with this streamed update.
    /// </summary>
    /// <remarks>
    /// <para>
    /// Corresponds to e.g. <c>$.choices[0].index</c> in the underlying REST schema.
    /// </para>
    /// <para>
    /// Unless a value greater than <c>1</c> was provided as the <c>choiceCount</c> to
    /// <see cref="ChatClient.CompleteChatStreaming(IEnumerable{ChatRequestMessage}, int?, ChatCompletionOptions)"/>,
    /// only one choice will be generated. In that case, this value will always be 0 and may not need to be considered.
    /// </para>
    /// <para>
    /// When a value greater than <c>1</c> to that <c>choiceCount</c> is provided, this index represents
    /// which logical <c>choice</c> the <see cref="StreamingChatUpdate"/> information is associated with. In the event
    /// that a single underlying server-sent event contains multiple choices, multiple instances of
    /// <see cref="StreamingChatUpdate"/> will be created.
    /// </para>
    /// </remarks>
    public int? ChoiceIndex { get; }

    /// <inheritdoc cref="ChatCompletion.SystemFingerprint"/>
    public string SystemFingerprint { get; }

    /// <summary>
    /// The log probability information for choices in the chat completion response, as requested via
    /// <see cref="ChatCompletionOptions.IncludeLogProbabilities"/>.
    /// </summary>
    public ChatLogProbabilityCollection LogProbabilities { get; }

    internal StreamingChatUpdate(
        string id,
        DateTimeOffset created,
        string systemFingerprint = null,
        int? choiceIndex = null,
        ChatRole? role = null,
        string contentUpdate = null,
        ChatFinishReason? finishReason = null,
        string functionName = null,
        string functionArgumentsUpdate = null,
        StreamingToolCallUpdate toolCallUpdate = null,
        ChatLogProbabilityCollection logProbabilities = null)
    {
        Id = id;
        Created = created;
        SystemFingerprint = systemFingerprint;
        ChoiceIndex = choiceIndex;
        Role = role;
        ContentUpdate = contentUpdate;
        FinishReason = finishReason;
        FunctionName = functionName;
        FunctionArgumentsUpdate = functionArgumentsUpdate;
        ToolCallUpdate = toolCallUpdate;
        LogProbabilities = logProbabilities;
    }

    internal static List<StreamingChatUpdate> DeserializeStreamingChatUpdates(JsonElement element)
    {
        List<StreamingChatUpdate> results = [];
        if (element.ValueKind == JsonValueKind.Null)
        {
            return results;
        }
        string id = default;
        DateTimeOffset created = default;
        string systemFingerprint = null;
        foreach (JsonProperty property in element.EnumerateObject())
        {
            if (property.NameEquals("id"u8))
            {
                id = property.Value.GetString();
                continue;
            }
            if (property.NameEquals("created"u8))
            {
                created = DateTimeOffset.FromUnixTimeSeconds(property.Value.GetInt64());
                continue;
            }
            if (property.NameEquals("system_fingerprint"))
            {
                systemFingerprint = property.Value.GetString();
                continue;
            }
            if (property.NameEquals("choices"u8))
            {
                foreach (JsonElement choiceElement in property.Value.EnumerateArray())
                {
                    ChatRole? role = null;
                    string contentUpdate = null;
                    string functionName = null;
                    string functionArgumentsUpdate = null;
                    int choiceIndex = 0;
                    ChatFinishReason? finishReason = null;
                    List<StreamingToolCallUpdate> toolCallUpdates = [];
                    ChatLogProbabilityCollection logProbabilities = null;

                    foreach (JsonProperty choiceProperty in choiceElement.EnumerateObject())
                    {
                        if (choiceProperty.NameEquals("index"u8))
                        {
                            choiceIndex = choiceProperty.Value.GetInt32();
                            continue;
                        }
                        if (choiceProperty.NameEquals("finish_reason"u8))
                        {
                            if (choiceProperty.Value.ValueKind == JsonValueKind.Null)
                            {
                                finishReason = null;
                                continue;
                            }
                            finishReason = choiceProperty.Value.GetString() switch
                            {
                                "stop" => ChatFinishReason.Stopped,
                                "length" => ChatFinishReason.Length,
                                "tool_calls" => ChatFinishReason.ToolCalls,
                                "function_call" => ChatFinishReason.FunctionCall,
                                "content_filter" => ChatFinishReason.ContentFilter,
                                _ => throw new ArgumentException(nameof(finishReason)),
                            };
                            continue;
                        }
                        if (choiceProperty.NameEquals("delta"u8))
                        {
                            foreach (JsonProperty deltaProperty in choiceProperty.Value.EnumerateObject())
                            {
                                if (deltaProperty.NameEquals("role"u8))
                                {
                                    role = deltaProperty.Value.GetString() switch
                                    {
                                        "system" => ChatRole.System,
                                        "user" => ChatRole.User,
                                        "assistant" => ChatRole.Assistant,
                                        "tool" => ChatRole.Tool,
                                        "function" => ChatRole.Function,
                                        _ => throw new ArgumentException(nameof(role)),
                                    };
                                    continue;
                                }
                                if (deltaProperty.NameEquals("content"u8))
                                {
                                    contentUpdate = deltaProperty.Value.GetString();
                                    continue;
                                }
                                if (deltaProperty.NameEquals("function_call"u8))
                                {
                                    foreach (JsonProperty functionProperty in deltaProperty.Value.EnumerateObject())
                                    {
                                        if (functionProperty.NameEquals("name"u8))
                                        {
                                            functionName = functionProperty.Value.GetString();
                                            continue;
                                        }
                                        if (functionProperty.NameEquals("arguments"u8))
                                        {
                                            functionArgumentsUpdate = functionProperty.Value.GetString();
                                        }
                                    }
                                }
                                if (deltaProperty.NameEquals("tool_calls"))
                                {
                                    foreach (JsonElement toolCallElement in deltaProperty.Value.EnumerateArray())
                                    {
                                        toolCallUpdates.Add(
                                            StreamingToolCallUpdate.DeserializeStreamingToolCallUpdate(toolCallElement));
                                    }
                                }
                            }
                        }
                        if (choiceProperty.NameEquals("logprobs"u8))
                        {
                            Internal.Models.CreateChatCompletionResponseChoiceLogprobs internalLogprobs
                                = Internal.Models.CreateChatCompletionResponseChoiceLogprobs.DeserializeCreateChatCompletionResponseChoiceLogprobs(
                                    choiceProperty.Value);
                            logProbabilities = ChatLogProbabilityCollection.FromInternalData(internalLogprobs);
                        }
                    }
                    // In the unlikely event that more than one tool call arrives on a single chunk, we'll generate
                    // separate updates just like for choices. Adding a "null" if empty lets us avoid a separate loop.
                    if (toolCallUpdates.Count == 0)
                    {
                        toolCallUpdates.Add(null);
                    }
                    foreach (StreamingToolCallUpdate toolCallUpdate in toolCallUpdates)
                    {
                        results.Add(new StreamingChatUpdate(
                            id,
                            created,
                            systemFingerprint,
                            choiceIndex,
                            role,
                            contentUpdate,
                            finishReason,
                            functionName,
                            functionArgumentsUpdate,
                            toolCallUpdate,
                            logProbabilities));
                    }
                }
                continue;
            }
        }
        if (results.Count == 0)
        {
            results.Add(new StreamingChatUpdate(id, created, systemFingerprint));
        }
        return results;
    }
}

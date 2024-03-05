using OpenAI.ClientShared.Internal;
using System;
using System.Collections.Generic;

namespace OpenAI.Chat;

/// <inheritdoc cref="Internal.Models.CreateChatCompletionResponse"/>
public class ChatCompletion
{
    private Internal.Models.CreateChatCompletionResponse _internalResponse;
    private long _internalChoiceIndex;

    /// <inheritdoc cref="Internal.Models.CreateChatCompletionResponse.Id"/>
    public string Id => _internalResponse.Id;
    /// <inheritdoc cref="Internal.Models.CreateChatCompletionResponse.SystemFingerprint"/>
    public string SystemFingerprint => _internalResponse.SystemFingerprint;
    /// <inheritdoc cref="Internal.Models.CreateChatCompletionResponse.Created"/>
    public DateTimeOffset CreatedAt => _internalResponse.Created;
    /// <inheritdoc cref="Internal.Models.CreateChatCompletionResponse.Usage"/>
    public ChatTokenUsage Usage { get; }
    /// <inheritdoc cref="Internal.Models.CreateChatCompletionResponseChoice.FinishReason"/>
    public ChatFinishReason FinishReason { get; }
    /// <inheritdoc cref="Internal.Models.ChatCompletionResponseMessage.Content"/>
    public ChatMessageContent Content { get; }
    /// <inheritdoc cref="Internal.Models.ChatCompletionResponseMessage.ToolCalls"/>
    public IReadOnlyList<ChatToolCall> ToolCalls { get; }
    /// <inheritdoc cref="Internal.Models.ChatCompletionResponseMessage.FunctionCall"/>
    public ChatFunctionCall FunctionCall { get; }
    /// <inheritdoc cref="Internal.Models.ChatCompletionResponseMessage.Role"/>
    public ChatRole Role { get; }
    /// <inheritdoc cref="Internal.Models.CreateChatCompletionResponseChoice.Logprobs"/>
    public ChatLogProbabilityCollection LogProbabilities { get; }
    /// <inheritdoc cref="Internal.Models.CreateChatCompletionResponseChoice.Index"/>
    public long Index => _internalResponse.Choices[(int)_internalChoiceIndex].Index;

    internal ChatCompletion(Internal.Models.CreateChatCompletionResponse internalResponse, long internalChoiceIndex)
    {
        Internal.Models.CreateChatCompletionResponseChoice internalChoice = internalResponse.Choices[(int)internalChoiceIndex];
        _internalResponse = internalResponse;
        _internalChoiceIndex = internalChoiceIndex;
        Role = internalChoice.Message.Role.ToString() switch
        {
            "system" => ChatRole.System,
            "user" => ChatRole.User,
            "assistant" => ChatRole.Assistant,
            "tool" => ChatRole.Tool,
            "function" => ChatRole.Function,
            _ => throw new ArgumentException(nameof(internalChoice.Message.Role)),
        };
        Usage = new(_internalResponse.Usage);
        FinishReason = internalChoice.FinishReason.ToString() switch
        {
            "stop" => ChatFinishReason.Stopped,
            "length" => ChatFinishReason.Length,
            "tool_calls" => ChatFinishReason.ToolCalls,
            "function_call" => ChatFinishReason.FunctionCall,
            "content_filter" => ChatFinishReason.ContentFilter,
            _ => throw new ArgumentException(nameof(internalChoice.FinishReason)),
        };
        Content = internalChoice.Message.Content;
        if (internalChoice.Message.ToolCalls != null)
        {
            OptionalList<ChatToolCall> toolCalls = [];
            foreach (Internal.Models.ChatCompletionMessageToolCall internalToolCall in internalChoice.Message.ToolCalls)
            {
                if (internalToolCall.Type == "function")
                {
                    toolCalls.Add(new ChatFunctionToolCall(internalToolCall.Id, internalToolCall.Function.Name, internalToolCall.Function.Arguments));
                }
            }
            ToolCalls = toolCalls;
        }
        if (internalChoice.Message.FunctionCall != null)
        {
            FunctionCall = new(internalChoice.Message.FunctionCall.Name, internalChoice.Message.FunctionCall.Arguments);
        }
        if (internalChoice.Logprobs != null)
        {
            LogProbabilities = ChatLogProbabilityCollection.FromInternalData(internalChoice.Logprobs);
        }
    }
}

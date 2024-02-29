using System;
using System.ClientModel;
using System.ClientModel.Primitives;
using System.Collections;
using System.Collections.Generic;

namespace OpenAI.Chat;

/// <summary>
/// A common, base representation of a message provided as input into a chat completion request.
/// </summary>
/// <remarks>
/// <list type="table">
/// <listheader>
///     <type>Type -</type>
///     <role>Role -</role>
///     <note>Description</note>
/// </listheader>
/// <item>
///     <type><see cref="ChatRequestSystemMessage"/> -</type>
///     <role><c>system</c> -</role>
///     <note>Instructions to the model that guide the behavior of future <c>assistant</c> messages.</note>
/// </item>
/// <item>
///     <type><see cref="ChatRequestUserMessage"/> -</type>
///     <role><c>user</c> -</role>
///     <note>Input messages from the caller, typically paired with <c>assistant</c> messages in a conversation.</note>
/// </item>
/// <item>
///     <type><see cref="ChatRequestAssistantMessage"/> -</type>
///     <role><c>assistant</c> -</role>
///     <note>
///         Output messages from the model with responses to the <c>user</c> or calls to tools or functions that are
///         needed to continue the logical conversation.
///     </note>
/// </item>
/// <item>
///     <type><see cref="ChatRequestToolMessage"/> -</type>
///     <role><c>tool</c> -</role>
///     <note>
///         Resolution information for a <see cref="ChatToolCall"/> in an earlier
///         <see cref="ChatRequestAssistantMessage"/> that was made against a supplied
///         <see cref="ChatToolDefinition"/>.
///     </note>
/// </item>
/// <item>
///     <type><see cref="ChatRequestFunctionMessage"/> -</type>
///     <role><c>function</c> -</role>
///     <note>
///         Resolution information for a <see cref="ChatFunctionCall"/> in an earlier
///         <see cref="ChatRequestAssistantMessage"/> that was made against a supplied
///         <see cref="ChatFunctionDefinition"/>. Note that <c>functions</c> are deprecated in favor of
///         <c>tool_calls</c>.
///     </note>
/// </item>
/// </list>
/// </remarks>
public abstract partial class ChatRequestMessage
{
    /// <summary>
    /// The <c>role</c> associated with the message.
    /// </summary>
    public ChatRole Role { get; }

    /// <summary>
    /// The content associated with the message. The interpretation of this content will vary depending on the message type.
    /// </summary>
    public ReadOnlyMemory<ChatMessageContent> Content => _contentItems.AsMemory();
    private readonly ChatMessageContent[] _contentItems;

    internal ChatRequestMessage(ChatRole role, ChatMessageContent content)
        : this(role, [content])
    { }

    internal ChatRequestMessage(ChatRole role, ChatMessageContent[] content)
    {
        Role = role;
        _contentItems = content;
    }

    /// <inheritdoc cref="ChatRequestSystemMessage.ChatRequestSystemMessage(string)"/>
    public static ChatRequestSystemMessage CreateSystemMessage(string content)
        => new ChatRequestSystemMessage(content);

    /// <inheritdoc cref="ChatRequestUserMessage.ChatRequestUserMessage(string)"/>
    public static ChatRequestUserMessage CreateUserMessage(string content)
        => new ChatRequestUserMessage(content);

    /// <inheritdoc cref="ChatRequestUserMessage.ChatRequestUserMessage(IEnumerable{ChatMessageContent})"/>
    public static ChatRequestUserMessage CreateUserMessage(IEnumerable<ChatMessageContent> contentItems)
        => new ChatRequestUserMessage(contentItems);

    /// <inheritdoc cref="ChatRequestUserMessage.ChatRequestUserMessage(IEnumerable{ChatMessageContent})"/>
    public static ChatRequestUserMessage CreateUserMessage(params ChatMessageContent[] contentItems)
        => new ChatRequestUserMessage(contentItems);

    /// <inheritdoc cref="ChatRequestAssistantMessage.ChatRequestAssistantMessage(string)"/>
    public static ChatRequestAssistantMessage CreateAssistantMessage(string content)
        => new ChatRequestAssistantMessage(content);

    /// <inheritdoc cref="ChatRequestToolMessage.ChatRequestToolMessage(string, string)"/>
    public static ChatRequestToolMessage CreateToolMessage(string toolCallId, string content)
        => new ChatRequestToolMessage(toolCallId, content);

    /// <inheritdoc cref="ChatRequestFunctionMessage.ChatRequestFunctionMessage(string, string)"/>
    public static ChatRequestFunctionMessage CreateFunctionMessage(string toolCallId, string content)
        => new ChatRequestFunctionMessage(toolCallId, content);
}

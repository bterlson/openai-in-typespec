using System;

namespace OpenAI.Chat;

/// <summary>
/// Represents a requested <c>response_format</c> for the model to use, enabling "JSON mode" for guaranteed valid output.
/// </summary>
/// <remarks>
/// <b>Important</b>: when using JSON mode, the model <b><u>must</u></b> also be instructed to produce JSON via a
/// <c>system</c> or <c>user</c> message.
/// <para>
/// Without this paired, message-based accompaniment, the model may generate an unending stream of whitespace until the
/// generation reaches the token limit, resulting in a long-running and seemingly "stuck" request.
/// </para>
/// <para>
/// Also note that the message content may be partially cut off if <c>finish_reason</c> is <c>length</c>, which
/// indicates that the generation exceeded <c>max_tokens</c> or the conversation exceeded the max context length for
/// the model.
/// </para>
/// </remarks>
public enum ChatResponseFormat
{
    /// <summary>
    /// Specifies that the model should provide plain, textual output.
    /// </summary>
    Text,
    /// <summary>
    /// Specifies that the model should enable "JSON mode" and better guarantee the emission of valid JSON.
    /// </summary>
    /// <remarks>
    /// <b>Important</b>: when using JSON mode, the model <b><u>must</u></b> also be instructed to produce JSON via a
    /// <c>system</c> or <c>user</c> message.
    /// <para>
    /// Without this paired, message-based accompaniment, the model may generate an unending stream of whitespace until the
    /// generation reaches the token limit, resulting in a long-running and seemingly "stuck" request.
    /// </para>
    /// <para>
    /// Also note that the message content may be partially cut off if <c>finish_reason</c> is <c>length</c>, which
    /// indicates that the generation exceeded <c>max_tokens</c> or the conversation exceeded the max context length for
    /// the model.
    /// </para>
    /// </remarks>
    JsonObject,
}
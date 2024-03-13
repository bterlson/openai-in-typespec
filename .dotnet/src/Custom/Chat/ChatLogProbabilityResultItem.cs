using System.Collections.Generic;

namespace OpenAI.Chat;

/// <summary>
/// Represents a single item of log probability information as requested via
/// <see cref="ChatCompletionOptions.IncludeLogProbabilities"/> and
/// <see cref="ChatCompletionOptions.LogProbabilityCount"/>.
/// </summary>
public class ChatLogProbabilityResultItem
{
    /// <summary>
    /// The token for which this log probability information applies.
    /// </summary>
    public string Token { get; }
    /// <summary>
    /// The <c>logprob</c> for the token.
    /// </summary>
    public double LogProbability { get; }
    /// <summary>
    /// A list of integers representing the UTF-8 bytes representation of the token. Useful in instances where
    /// characters are represented by multiple tokens and their byte representations must be combined to generate
    /// the correct text representation. Can be null if there is no bytes representation for the token.
    /// </summary>
    public IReadOnlyList<int> Utf8ByteValues { get; }
    /// <summary>
    /// Creates a new instance of <see cref="ChatLogProbabilityResultItem"/>.
    /// </summary>
    protected ChatLogProbabilityResultItem() { }
    /// <summary>
    /// Creates a new instance of <see cref="ChatLogProbabilityResultItem"/>.
    /// </summary>
    /// <param name="token"> The token represented by this item. </param>
    /// <param name="logProbability"> The <c>logprob</c> for the token. </param>
    /// <param name="byteValues"> The UTF8 byte value sequence representation for the token. </param>
    internal ChatLogProbabilityResultItem(string token, double logProbability, IEnumerable<int> byteValues)
    {
        Token = token;
        LogProbability = logProbability;
        Utf8ByteValues = new List<int>(byteValues);
    }
}
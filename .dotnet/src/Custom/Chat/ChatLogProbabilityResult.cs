namespace OpenAI.Chat;

using System.Collections.Generic;
using System.Linq;

/// <summary>
/// Represents a single token's log probability information, as requested via
/// <see cref="ChatCompletionOptions.IncludeLogProbabilities"/>.
/// </summary>
public class ChatLogProbabilityResult
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
    /// List of the most likely tokens and their log probability at this token position. In rare cases,
    /// there may be fewer than the number of requested top_logprobs returned, as supplied via
    /// <see cref="ChatCompletionOptions.LogProbabilityCount"/>.
    /// </summary>
    public IReadOnlyList<ChatLogProbabilityResultItem> AlternateLogProbabilities { get; }
    internal ChatLogProbabilityResult(
        string token,
        double logProbability,
        IEnumerable<int> byteValues,
        IEnumerable<ChatLogProbabilityResultItem> alternateLogProbabilities)
        {
            Token = token;
            LogProbability = logProbability;
            Utf8ByteValues = byteValues.ToList();
            AlternateLogProbabilities = alternateLogProbabilities.ToList();
        }
}

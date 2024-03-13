using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace OpenAI.Chat;

/// <summary>
/// Represents a collection of log probability result information as requested via
/// <see cref="ChatCompletionOptions.IncludeLogProbabilities"/>.
/// </summary>
public class ChatLogProbabilityCollection : ReadOnlyCollection<ChatLogProbabilityResult>
{
    internal ChatLogProbabilityCollection(IList<ChatLogProbabilityResult> list) : base(list) { }
    internal static ChatLogProbabilityCollection FromInternalData(
        Internal.Models.CreateChatCompletionResponseChoiceLogprobs internalLogprobs)
    {
        if (internalLogprobs == null)
        {
            return null;
        }
        List<ChatLogProbabilityResult> logProbabilities = [];
        foreach (Internal.Models.ChatCompletionTokenLogprob internalLogprob in internalLogprobs.Content)
        {
            List<ChatLogProbabilityResultItem> alternateLogProbabilities = null;
            if (internalLogprob.TopLogprobs != null)
            {
                alternateLogProbabilities = [];
                foreach (Internal.Models.ChatCompletionTokenLogprobTopLogprob internalTopLogprob in internalLogprob.TopLogprobs)
                {
                    List<int> convertedByteValues = internalLogprob.Bytes.Select(longByteValue => (int)longByteValue).ToList();
                    alternateLogProbabilities.Add(new(
                        internalLogprob.Token,
                        internalLogprob.Logprob,
                        convertedByteValues));
                }
            }
            List<int> convertedResultByteValues = internalLogprob.Bytes.Select(longByteValue => (int)longByteValue).ToList();
            logProbabilities.Add(new(
                internalLogprob.Token,
                internalLogprob.Logprob,
                convertedResultByteValues,
                alternateLogProbabilities));
        }
        return new ChatLogProbabilityCollection(logProbabilities);
    }
}
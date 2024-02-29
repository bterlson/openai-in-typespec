using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace OpenAI.Chat;

/// <summary>
/// Represents a chat completions response payload that contains information about multiple requested chat completion
/// choices.
/// </summary>
public class ChatCompletionCollection : ReadOnlyCollection<ChatCompletion>
{
    internal ChatCompletionCollection(IList<ChatCompletion> list) : base(list) { }
}
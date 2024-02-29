using System;
using System.ClientModel;
using System.ClientModel.Primitives;
using System.Text.Json;

namespace OpenAI.Assistants;

public abstract partial class RequiredToolCall : RunRequiredAction
{
    public string Id { get; }

    internal RequiredToolCall(string id)
    {
        Id = id;
    }

    internal static RequiredToolCall DeserializeRequiredToolCall(
        JsonElement element,
        ModelReaderWriterOptions options)
    {
        options ??= new ModelReaderWriterOptions("W");

        if (element.ValueKind == JsonValueKind.Null)
        {
            return null;
        }

        foreach (var property in element.EnumerateObject())
        {
            if (property.NameEquals("function"u8))
            {
                return RequiredFunctionToolCall.DeserializeRequiredFunctionToolCall(element, options);
            }
        }
        throw new ArgumentException(nameof(element));
    }
}

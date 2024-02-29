using System;
using System.ClientModel.Internal;

using System.ClientModel;
using System.ClientModel.Primitives;
using System.Collections.Generic;
using System.Text.Json;

namespace OpenAI.Assistants;

public abstract partial class RunRequiredAction :  IJsonModel<IList<RunRequiredAction>>
{
    IList<RunRequiredAction> IJsonModel<IList<RunRequiredAction>>.Create(ref Utf8JsonReader reader, ModelReaderWriterOptions options)
    {
        var format = options.Format == "W" ? ((IPersistableModel<IList<RunRequiredAction>>)this).GetFormatFromOptions(options) : options.Format;
        if (format != "J")
        {
            throw new FormatException($"The model {nameof(RunRequiredAction)} does not support '{format}' format.");
        }
        using JsonDocument document = JsonDocument.ParseValue(ref reader);
        return DeserializeRunRequiredActions(document.RootElement, options);
    }

    IList<RunRequiredAction> IPersistableModel<IList<RunRequiredAction>>.Create(BinaryData data, ModelReaderWriterOptions options)
    {
        var format = options.Format == "W" ? ((IPersistableModel<IList<RunRequiredAction>>)this).GetFormatFromOptions(options) : options.Format;

        switch (format)
        {
            case "J":
                {
                    using JsonDocument document = JsonDocument.Parse(data);
                    return DeserializeRunRequiredActions(document.RootElement, options);
                }
            default:
                throw new FormatException($"The model {nameof(RunRequiredAction)} does not support '{options.Format}' format.");
        }
    }

    string IPersistableModel<IList<RunRequiredAction>>.GetFormatFromOptions(ModelReaderWriterOptions options) => "J";

    void IJsonModel<IList<RunRequiredAction>>.Write(Utf8JsonWriter writer, ModelReaderWriterOptions options)
    {
        writer.WriteStartObject();
        WriteDerived(writer, options);
        writer.WriteEndObject();
    }

    BinaryData IPersistableModel<IList<RunRequiredAction>>.Write(ModelReaderWriterOptions options)
    {
        var format = options.Format == "W" ? ((IPersistableModel<IList<RunRequiredAction>>)this).GetFormatFromOptions(options) : options.Format;

        switch (format)
        {
            case "J":
                return ModelReaderWriter.Write(this, options);
            default:
                throw new FormatException($"The model {nameof(RunRequiredAction)} does not support '{options.Format}' format.");
        }
    }

    internal abstract void WriteDerived(Utf8JsonWriter writer, ModelReaderWriterOptions options);

    internal static IList<RunRequiredAction> DeserializeRunRequiredActions(
        JsonElement element,
        ModelReaderWriterOptions options = null)
    {
        options ??= new ModelReaderWriterOptions("W");

        if (element.ValueKind == JsonValueKind.Null)
        {
            return null;
        }

        List<RunRequiredAction> actions = null;

        foreach (var topProperty in element.EnumerateObject())
        {
            if (topProperty.NameEquals("submit_tool_outputs"u8))
            {
                foreach (var submitObjectProperty in topProperty.Value.EnumerateObject())
                {
                    if (submitObjectProperty.NameEquals("tool_calls"u8))
                    {
                        foreach (var toolCallObject in submitObjectProperty.Value.EnumerateArray())
                        {
                            foreach (var toolCallProperty in toolCallObject.EnumerateObject())
                            {
                                if ((toolCallProperty.NameEquals("type"u8) && toolCallProperty.Value.ValueEquals("function"u8))
                                    || (toolCallProperty.NameEquals("function"u8)))
                                {
                                    actions ??= [];
                                    actions.Add(RequiredFunctionToolCall.DeserializeRequiredFunctionToolCall(
                                        toolCallObject,
                                        options));
                                    continue;
                                }
                            }
                        }
                    }
                }
            }
        }

        return actions;
    }
}

using System;
using System.ClientModel.Internal;

using System.ClientModel;
using System.ClientModel.Primitives;
using System.ComponentModel.Design;
using System.Text.Json;
using OpenAI.ClientShared.Internal;

namespace OpenAI.Chat;

public abstract partial class ChatRequestMessage :  IJsonModel<ChatRequestMessage>
{
    void IJsonModel<ChatRequestMessage>.Write(Utf8JsonWriter writer, ModelReaderWriterOptions options)
    {
        writer.WriteStartObject();
        writer.WriteString("role"u8, Role switch
        {
            ChatRole.System => "system",
            ChatRole.User => "user",
            ChatRole.Assistant => "assistant",
            ChatRole.Tool => "tool",
            ChatRole.Function => "function",
            _ => throw new ArgumentException(nameof(Role))
        });
        if (OptionalProperty.IsDefined(Content))
        {
            writer.WritePropertyName("content"u8);
            if (Content.Span.Length == 0)
            {
                writer.WriteNullValue();
            }
            else if (Content.Span.Length == 1)
            {
                if (Content.Span[0].ContentKind == ChatMessageContentKind.Text)
                {
                    writer.WriteStringValue(Content.Span[0].ToText());
                }
                else
                {
                    throw new InvalidOperationException();
                }
            }
            else if (Content.Span.Length > 1)
            {
                writer.WriteStartArray();
                foreach (ChatMessageContent contentItem in Content.Span)
                {
                    writer.WriteStartObject();
                    if (contentItem.ContentKind == ChatMessageContentKind.Text)
                    {
                        writer.WriteString("type"u8, "text"u8);
                        writer.WriteString("text"u8, contentItem.ToText());
                    }
                    else if (contentItem.ContentKind == ChatMessageContentKind.Image)
                    {
                        writer.WriteString("type"u8, "image_url"u8);
                        writer.WritePropertyName("image_url"u8);
                        writer.WriteStartObject();
                        writer.WriteString("url"u8, contentItem.ToUri().AbsoluteUri);
                        writer.WriteEndObject();
                    }
                    else
                    {
                        throw new InvalidOperationException();
                    }
                    writer.WriteEndObject();
                }
                writer.WriteEndArray();
            }
        }
        WriteDerivedAdditions(writer, options);
        writer.WriteEndObject();
    }

    ChatRequestMessage IJsonModel<ChatRequestMessage>.Create(ref Utf8JsonReader reader, ModelReaderWriterOptions options)
    {
        throw new NotImplementedException();
    }

    BinaryData IPersistableModel<ChatRequestMessage>.Write(ModelReaderWriterOptions options)
    {
        throw new NotImplementedException();
    }

    ChatRequestMessage IPersistableModel<ChatRequestMessage>.Create(BinaryData data, ModelReaderWriterOptions options)
    {
        throw new NotImplementedException();
    }

    string IPersistableModel<ChatRequestMessage>.GetFormatFromOptions(ModelReaderWriterOptions options) => "J";

    internal abstract void WriteDerivedAdditions(Utf8JsonWriter writer, ModelReaderWriterOptions options);
}

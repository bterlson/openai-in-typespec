import "../common/models.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

namespace OpenAI;

model CreateMessageRequest {
  /** The role of the entity that is creating the message. Currently only `user` is supported. */
  role: "user"; // TODO: The generated spec add "assistants" to this enum.

  /** The content of the message. */
  @minLength(1)
  @maxLength(32768)
  content: string;

  /**
   * A list of [File](/docs/api-reference/files) IDs that the message should use. There can be a
   * maximum of 10 files attached to a message. Useful for tools like `retrieval` and
   * `code_interpreter` that can access and use files.
   */
  @minItems(1)
  @maxItems(10)
  file_ids?: string[] = [];

  /**
  * Set of 16 key-value pairs that can be attached to an object. This can be useful for storing
  * additional information about the object in a structured format. Keys can be a maximum of 64
  * characters long and values can be a maxium of 512 characters long.
  */
  @extension("x-oaiTypeLabel", "map")
  metadata?: Record<string> | null;
}

model ModifyMessageRequest {
  /**
  * Set of 16 key-value pairs that can be attached to an object. This can be useful for storing
  * additional information about the object in a structured format. Keys can be a maximum of 64
  * characters long and values can be a maxium of 512 characters long.
  */
  @extension("x-oaiTypeLabel", "map")
  metadata?: Record<string> | null;
}

model ListMessagesResponse {
  object: "list";
  data: MessageObject[];
  first_id: string;
  last_id: string;
  has_more: boolean;
}

model ListMessageFilesResponse {
    object: "list";
    data: MessageFileObject[];
    first_id: string;
    last_id: string;
    has_more: boolean;
}

model MessageObject {
  /** The identifier, which can be referenced in API endpoints. */
  id: string;

  /** The object type, which is always `thread.message`. */
  object: "thread.message";

  /** The Unix timestamp (in seconds) for when the message was created. */
  @encode("unixTimestamp", int32)
  created_at: utcDateTime;

  /** The [thread](/docs/api-reference/threads) ID that this message belongs to. */
  thread_id: string;

  /** The entity that produced the message. One of `user` or `assistant`. */
  role: "user" | "assistant";

  /** The content of the message in array of text and/or images. */
  content: MessageObjectContent[];

  /**
   * If applicable, the ID of the [assistant](/docs/api-reference/assistants) that authored this
   * message.
   */
  assistant_id: string | null;

  /**
   * If applicable, the ID of the [run](/docs/api-reference/runs) associated with the authoring of
   * this message.
   */
  run_id: string | null;

  /**
    * A list of [file](/docs/api-reference/files) IDs that the assistant should use. Useful for
    * tools like retrieval and code_interpreter that can access files. A maximum of 10 files can be
    * attached to a message.
    */
  @maxItems(10)
  file_ids: string[] = [];

  /**
  * Set of 16 key-value pairs that can be attached to an object. This can be useful for storing
  * additional information about the object in a structured format. Keys can be a maximum of 64
  * characters long and values can be a maxium of 512 characters long.
  */
  @extension("x-oaiTypeLabel", "map")
  metadata: Record<string> | null;
}

@oneOf
@extension("x-oaiExpandable", true)
union MessageObjectContent {
  MessageContentImageFileObject,
  MessageContentTextObject,
}

/** References an image [File](/docs/api-reference/files) in the content of a message. */
model MessageContentImageFileObject {
  /** Always `image_file`. */
  type: "image_file";

  image_file: {
    /** The [File](/docs/api-reference/files) ID of the image in the message content. */
    file_id: string;
  }
}

/** The text content that is part of a message. */
model MessageContentTextObject {
  /** Always `text`. */
  type: "text"; // TODO: The generated spec adds "json_object" to this enum.

  text: {
    /** The data that makes up the text. */
    value: string;

    annotations: MessageContentTextObjectAnnotations[];
  }
}

@oneOf
@extension("x-oaiExpandable", true)
union MessageContentTextObjectAnnotations {
  MessageContentTextAnnotationsFileCitationObject,
  MessageContentTextAnnotationsFilePathObject,
}

/** 
 * A citation within the message that points to a specific quote from a specific File associated
 * with the assistant or the message. Generated when the assistant uses the "retrieval" tool to
 * search files.
 */
model MessageContentTextAnnotationsFileCitationObject {
  /** Always `file_citation`. */
  type: "file_citation";

  /** The text in the message content that needs to be replaced. */
  text: string;

  file_citation: {
    /** The ID of the specific File the citation is from. */
    file_id: string;

    /** The specific quote in the file. */
    quote: string;
  };

  @minValue(0)
  start_index: safeint;

  @minValue(0)
  end_index: safeint;
}

/** 
 * A URL for the file that's generated when the assistant used the `code_interpreter` tool to
 * generate a file. 
 */
model MessageContentTextAnnotationsFilePathObject {
  /** Always `file_path`. */
  type: "file_path";

  /** The text in the message content that needs to be replaced. */
  text: string;

  file_path: {
    /** The ID of the file that was generated. */
    file_id: string;
  };

  @minValue(0)
  start_index: safeint;

  @minValue(0)
  end_index: safeint;
}

/** A list of files attached to a `message`. */
model MessageFileObject {
  /** TThe identifier, which can be referenced in API endpoints. */
  id: string;

  /** The object type, which is always `thread.message.file`. */
  object: "thread.message.file";

  /** The Unix timestamp (in seconds) for when the message file was created. */
  @encode("unixTimestamp", int32)
  created_at: utcDateTime;

  /** The ID of the [message](/docs/api-reference/messages) that the [File](/docs/api-reference/files) is attached to. */
  message_id: string;
}
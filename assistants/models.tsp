import "../common/models.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

namespace OpenAI;

model CreateAssistantRequest {
  /**
   * ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to
   * see all of your available models, or see our [Model overview](/docs/models/overview) for
   * descriptions of them.
   */
  `model`: string;

  /** The name of the assistant. The maximum length is 256 characters. */
  @maxLength(256)
  name?: string | null;

  /** The description of the assistant. The maximum length is 512 characters. */
  @maxLength(512)
  description?: string | null;

  /** The system instructions that the assistant uses. The maximum length is 32768 characters. */
  @maxLength(32768)
  instructions?: string | null;

  /**
   * A list of tool enabled on the assistant. There can be a maximum of 128 tools per assistant.
   * Tools can be of types `code_interpreter`, `retrieval`, or `function`.
   */
  
  tools?: CreateAssistantRequestTools = [];

  /**
   * A list of [file](/docs/api-reference/files) IDs attached to this assistant. There can be a
   * maximum of 20 files attached to the assistant. Files are ordered by their creation date in
   * ascending order.
   */
  @maxItems(20)
  file_ids?: string[] = [];

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful for storing
   * additional information about the object in a structured format. Keys can be a maximum of 64
   * characters long and values can be a maxium of 512 characters long.
   */
  @extension("x-oaiTypeLabel", "map")
  metadata?: Record<string> | null;
}

model ModifyAssistantRequest {
  /**
   * ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to
   * see all of your available models, or see our [Model overview](/docs/models/overview) for
   * descriptions of them.
   */
  `model`?: string;

  /** The name of the assistant. The maximum length is 256 characters. */
  @maxLength(256)
  name?: string | null;

  /** The description of the assistant. The maximum length is 512 characters. */
  @maxLength(512)
  description?: string | null;

  /** The system instructions that the assistant uses. The maximum length is 32768 characters. */
  @maxLength(32768)
  instructions?: string | null;

  /**
   * A list of tool enabled on the assistant. There can be a maximum of 128 tools per assistant.
   * Tools can be of types `code_interpreter`, `retrieval`, or `function`.
   */
  tools?: CreateAssistantRequestTools = [];

  /**
   * A list of [file](/docs/api-reference/files) IDs attached to this assistant. There can be a
   * maximum of 20 files attached to the assistant. Files are ordered by their creation date in
   * ascending order.
   */
  @maxItems(20)
  file_ids?: string[] = [];

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful for storing
   * additional information about the object in a structured format. Keys can be a maximum of 64
   * characters long and values can be a maxium of 512 characters long.
   */
  @extension("x-oaiTypeLabel", "map")
  metadata?: Record<string> | null;
}

model CreateAssistantFileRequest {
  /**
   * A [File](/docs/api-reference/files) ID (with `purpose="assistants"`) that the assistant should
   * use. Useful for tools like `retrieval` and `code_interpreter` that can access files.
   */
  file_id: string;
}

model ListAssistantsResponse {
  object: "list";
  data: AssistantObject[];
  first_id: string;
  last_id: string;
  has_more: boolean;
}

model DeleteAssistantResponse {
  id: string;
  deleted: boolean;
  object: "assistant.deleted";
}

model ListAssistantFilesResponse {
  object: "list";
  data: AssistantFileObject[];
  first_id: string;
  last_id: string;
  has_more: boolean;
}

/**
 * Deletes the association between the assistant and the file, but does not delete the
 * [File](/docs/api-reference/files) object itself.
 */
model DeleteAssistantFileResponse {
  id: string;
  deleted: boolean;
  object: "assistant.file.deleted";
}

@maxItems(128)
model CreateAssistantRequestTools is CreateAssistantRequestTool[];

@oneOf
@extension("x-oaiExpandable", true)
union CreateAssistantRequestTool {
  AssistantToolsCode,
  AssistantToolsRetrieval,
  AssistantToolsFunction
}

model AssistantToolsCode {
  /** The type of tool being defined: `code_interpreter` */
  type: "code_interpreter";
}

model AssistantToolsRetrieval {
  /** The type of tool being defined: `retrieval` */
  type: "retrieval";
}

model AssistantToolsFunction {
  /** The type of tool being defined: `function` */
  type: "function";
  
  function: FunctionObject;
}

/** Represents an `assistant` that can call the model and use tools. */
model AssistantObject {
  /** The identifier, which can be referenced in API endpoints. */
  id: string;

  /** The object type, which is always `assistant`. */
  object: "assistant";

  /** The Unix timestamp (in seconds) for when the assistant was created. */
  @encode("unixTimestamp", int32)
  created_at: utcDateTime;

  /** The name of the assistant. The maximum length is 256 characters. */
  @maxLength(256)
  name: string | null;

  /** The description of the assistant. The maximum length is 512 characters. */
  @maxLength(512)
  description: string | null;

  /**
   * ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to
   * see all of your available models, or see our [Model overview](/docs/models/overview) for
   * descriptions of them.
   */
  `model`: string;

  /** The system instructions that the assistant uses. The maximum length is 32768 characters. */
  @maxLength(32768)
  instructions: string | null;

  /**
   * A list of tool enabled on the assistant. There can be a maximum of 128 tools per assistant.
   * Tools can be of types `code_interpreter`, `retrieval`, or `function`.
   */
  tools: CreateAssistantRequestTools = [];

  /**
    * A list of [file](/docs/api-reference/files) IDs attached to this assistant. There can be a
    * maximum of 20 files attached to the assistant. Files are ordered by their creation date in
    * ascending order.
    */
  @maxItems(20)
  file_ids: string[] = [];

  /**
    * Set of 16 key-value pairs that can be attached to an object. This can be useful for storing
    * additional information about the object in a structured format. Keys can be a maximum of 64
    * characters long and values can be a maxium of 512 characters long.
    */
  @extension("x-oaiTypeLabel", "map")
  metadata: Record<string> | null;
}

/** A list of [Files](/docs/api-reference/files) attached to an `assistant`. */
model AssistantFileObject {
  /** The identifier, which can be referenced in API endpoints. */
  id: string;

  /** The object type, which is always `assistant.file`. */
  object: "assistant.file";

  /** The Unix timestamp (in seconds) for when the assistant file was created. */
  @encode("unixTimestamp", int32)
  created_at: utcDateTime;

  /** The assistant ID that the file is attached to. */
  assistant_id: string;
}
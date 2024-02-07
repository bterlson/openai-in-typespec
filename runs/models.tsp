import "../common/models.tsp";
import "../assistants/models.tsp";
import "../threads/models.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

namespace OpenAI;

model CreateRunRequest {
  /** The ID of the [assistant](/docs/api-reference/assistants) to use to execute this run. */
  assistant_id: string;

  /** 
   * The ID of the [Model](/docs/api-reference/models) to be used to execute this run. If a value
   * is provided here, it will override the model associated with the assistant. If not, the model
   * associated with the assistant will be used. */
  `model`?: string | null;

  /**
   * Overrides the [instructions](/docs/api-reference/assistants/createAssistant) of the assistant.
   * This is useful for modifying the behavior on a per-run basis.
   */
  instructions?: string | null;

  /**
   * Appends additional instructions at the end of the instructions for the run. This is useful for
   * modifying the behavior on a per-run basis without overriding other instructions.
   */
  additional_instructions?: string | null;

  /**
   * Override the tools the assistant can use for this run. This is useful for modifying the
   * behavior on a per-run basis.
   */
  tools?: CreateRunRequestTools | null;

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful for storing
   * additional information about the object in a structured format. Keys can be a maximum of 64
   * characters long and values can be a maxium of 512 characters long.
   */
  @extension("x-oaiTypeLabel", "map")
  metadata?: Record<string> | null;
}

model ModifyRunRequest {
  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful for storing
   * additional information about the object in a structured format. Keys can be a maximum of 64
   * characters long and values can be a maxium of 512 characters long.
   */
  @extension("x-oaiTypeLabel", "map")
  metadata?: Record<string> | null;
}

model CreateThreadAndRunRequest {
  /** The ID of the [assistant](/docs/api-reference/assistants) to use to execute this run. */
  assistant_id: string;

  /** If no thread is provided, an empty thread will be created. */
  thread?: CreateThreadRequest;

  /**
   * The ID of the [Model](/docs/api-reference/models) to be used to execute this run. If a value is
   * provided here, it will override the model associated with the assistant. If not, the model
   * associated with the assistant will be used.
   */
  `model`?: string | null;

  /**
   * Override the default system message of the assistant. This is useful for modifying the behavior
   * on a per-run basis.
   */
  instructions?: string | null;

  /**
   * Override the tools the assistant can use for this run. This is useful for modifying the
   * behavior on a per-run basis.
   */
  tools?: CreateRunRequestTools | null;

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful for storing
   * additional information about the object in a structured format. Keys can be a maximum of 64
   * characters long and values can be a maxium of 512 characters long.
   */
  @extension("x-oaiTypeLabel", "map")
  metadata?: Record<string> | null;
}

model SubmitToolOutputsRunRequest {
  /** A list of tools for which the outputs are being submitted. */
  tool_outputs: {
    /**
     * The ID of the tool call in the `required_action` object within the run object the output is
     * being submitted for. */
    tool_call_id?: string;

    /** The output of the tool call to be submitted to continue the run. */
    output?: string;
  }
}

model ListRunsResponse {
  object: "list";
  data: RunObject[];
  first_id: string;
  last_id: string;
  has_more: boolean;
}

model ListRunStepsResponse {
  object: "list";
  data: RunStepObject[];
  first_id: string;
  last_id: string;
  has_more: boolean;
}

@maxItems(20)
model CreateRunRequestTools is CreateRunRequestTool[];

@oneOf
@extension("x-oaiExpandable", true)
union CreateRunRequestTool {
  AssistantToolsCode,
  AssistantToolsRetrieval,
  AssistantToolsFunction
}

@oneOf
@extension("x-oaiExpandable", true)
union RunStepDetails {
  RunStepDetailsMessageCreationObject,
  RunStepDetailsToolCallsObject,
}

/** Details of the message creation by the run step. */
model RunStepDetailsMessageCreationObject {
  /** Details of the message creation by the run step. */
  type: "message_creation";

  message_creation: {
    /** The ID of the message that was created by this run step. */
    message_id: string;
  }
}

/** Details of the tool call. */
model RunStepDetailsToolCallsObject {
  /** Always `tool_calls`. */
  type: "tool_calls";

  /**
   * An array of tool calls the run step was involved in. These can be associated with one of three
   * types of tools: `code_interpreter`, `retrieval`, or `function`.
   */
  tool_calls: RunStepDetailsToolCallsObjectToolCalls;
}

model RunStepDetailsToolCallsObjectToolCalls is RunStepDetailsToolCallsObjectToolCall[];

@oneOf
@extension("x-oaiExpandable", true)
union RunStepDetailsToolCallsObjectToolCall {
  RunStepDetailsToolCallsCodeObject,
  RunStepDetailsToolCallsRetrievalObject,
  RunStepDetailsToolCallsFunctionObject,
}

/** Details of the Code Interpreter tool call the run step was involved in. */
model RunStepDetailsToolCallsCodeObject {
  /** The ID of the tool call. */
  id: string;

  /**
   * The type of tool call. This is always going to be `code_interpreter` for this type of tool
   * call.
   */
  type: "code_interpreter";

  /** The Code Interpreter tool call definition. */
  code_interpreter: {
    /** The input to the Code Interpreter tool call. */
    input: string;

    /**
     * The outputs from the Code Interpreter tool call. Code Interpreter can output one or more
     * items, including text (`logs`) or images (`image`). Each of these are represented by a
     * different object type.
     */
    outputs: RunStepDetailsToolCallsCodeOutputs;
  }
}

model RunStepDetailsToolCallsCodeOutputs is RunStepDetailsToolCallsCodeOutput[];

@oneOf
@extension("x-oaiExpandable", true)
union RunStepDetailsToolCallsCodeOutput {
  RunStepDetailsToolCallsCodeOutputLogsObject,
  RunStepDetailsToolCallsCodeOutputImageObject,
}

/** Text output from the Code Interpreter tool call as part of a run step. */
model RunStepDetailsToolCallsCodeOutputLogsObject {
  /** Always `logs`. */
  type: "logs";

  /** The text output from the Code Interpreter tool call. */
  logs: string;
}

model RunStepDetailsToolCallsCodeOutputImageObject {
  /** Always `image`. */
  type: "image";

  image: {
    /** The [file](/docs/api-reference/files) ID of the image. */
    file_id: string;
  }
}

model RunStepDetailsToolCallsRetrievalObject {
  /** The ID of the tool call object. */
  id: string;

  /** The type of tool call. This is always going to be `retrieval` for this type of tool call. */
  type: "retrieval";

  /** For now, this is always going to be an empty object. */
  @extension("x-oaiTypeLabel", "map")
  retrieval: { }; // TODO: Is this the appropriate way to represent an empty object?
}

model RunStepDetailsToolCallsFunctionObject { 
  /** The ID of the tool call object. */
  id: string;

  /** The type of tool call. This is always going to be `function` for this type of tool call. */
  type: "function";

  /** The definition of the function that was called. */
  function: {
    /** The name of the function. */
    name: string;

    /** The arguments passed to the function. */
    arguments: string;

    /**
     * The output of the function. This will be `null` if the outputs have not been
     * [submitted](/docs/api-reference/runs/submitToolOutputs) yet.
     */
    output: string | null;
  }
}

/**
 * Usage statistics related to the run. This value will be `null` if the run is not in a terminal
 * state (i.e. `in_progress`, `queued`, etc.).
 */
model RunCompletionUsage {
  /** Number of completion tokens used over the course of the run. */
  completion_tokens: safeint;

  /** Number of prompt tokens used over the course of the run. */
  prompt_tokens: safeint;

  /** Total number of tokens used (prompt + completion). */
  total_tokens: safeint;
}

/**
 * Usage statistics related to the run step. This value will be `null` while the run step's status
 * is `in_progress`.
 */
model RunStepCompletionUsage {
  /** Number of completion tokens used over the course of the run step. */
  completion_tokens: safeint;

  /** Number of prompt tokens used over the course of the run step. */
  prompt_tokens: safeint;

  /** Total number of tokens used (prompt + completion). */
  total_tokens: safeint;
}

/** Represents an execution run on a [thread](/docs/api-reference/threads). */
model RunObject {
  /** The identifier, which can be referenced in API endpoints. */
  id: string;

  /** The object type, which is always `thread.run`. */
  object: "thread.run";

  /** The Unix timestamp (in seconds) for when the run was created. */
  @encode("unixTimestamp", int32)
  created_at: utcDateTime;

  /**
   * The ID of the [thread](/docs/api-reference/threads) that was executed on as a part of this
   * run.
   */
  thread_id: string;

  /** The ID of the [assistant](/docs/api-reference/assistants) used for execution of this run. */
  assistant_id: string;

  /**
   * The status of the run, which can be either `queued`, `in_progress`, `requires_action`,
   * `cancelling`, `cancelled`, `failed`, `completed`, or `expired`.
   */
  status:
    | "queued"
    | "in_progress"
    | "requires_action"
    | "cancelling"
    | "cancelled"
    | "failed"
    | "completed"
    | "expired";

  /**
   * Details on the action required to continue the run. Will be `null` if no action is
   * required.
   */
  required_action: {
    /** For now, this is always `submit_tool_outputs`. */
    type: "submit_tool_outputs";

    /** Details on the tool outputs needed for this run to continue. */
    submit_tool_outputs: {
      /** A list of the relevant tool calls. */
      tool_calls: RunToolCallObject[];
    }
  } | null;

  /** The last error associated with this run. Will be `null` if there are no errors. */
  last_error: {
    /** One of `server_error` or `rate_limit_exceeded`. */
    code: "server_error" | "rate_limit_exceeded";

    /** A human-readable description of the error. */
    message: string;
  } | null;

  /** The Unix timestamp (in seconds) for when the run will expire. */
  @encode("unixTimestamp", int32)
  expires_at: utcDateTime;

  /** The Unix timestamp (in seconds) for when the run was started. */
  @encode("unixTimestamp", int32)
  started_at: utcDateTime | null;

  /** The Unix timestamp (in seconds) for when the run was cancelled. */
  @encode("unixTimestamp", int32)
  cancelled_at: utcDateTime | null;

  /** The Unix timestamp (in seconds) for when the run failed. */
  @encode("unixTimestamp", int32)
  failed_at: utcDateTime | null;

  /** The Unix timestamp (in seconds) for when the run was completed. */
  @encode("unixTimestamp", int32)
  completed_at: utcDateTime | null;

  /** The model that the [assistant](/docs/api-reference/assistants) used for this run. */
  `model`: string;

  /** The instructions that the [assistant](/docs/api-reference/assistants) used for this run. */
  instructions: string;

  /** The list of tools that the [assistant](/docs/api-reference/assistants) used for this run. */
  tools: CreateRunRequestTools;

  /**
   * The list of [File](/docs/api-reference/files) IDs the
   * [assistant](/docs/api-reference/assistants) used for this run.
   */
  file_ids: string[] = [];

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful for storing
   * additional information about the object in a structured format. Keys can be a maximum of 64
   * characters long and values can be a maxium of 512 characters long.
   */
  @extension("x-oaiTypeLabel", "map")
  metadata: Record<string> | null;

  usage: RunCompletionUsage | null;
}

/** Represents a step in execution of a run. */
model RunStepObject {
  /** The identifier of the run step, which can be referenced in API endpoints. */
  id: string;

  /** The object type, which is always `thread.run.step`. */
  object: "thread.run.step";

  /** The Unix timestamp (in seconds) for when the run step was created. */
  @encode("unixTimestamp", int32)
  created_at: utcDateTime;

  /** The ID of the [assistant](/docs/api-reference/assistants) associated with the run step. */
  assistant_id: string;

  /** The ID of the [thread](/docs/api-reference/threads) that was run. */
  thread_id: string;

  /** The ID of the [run](/docs/api-reference/runs) that this run step is a part of. */
  run_id: string;

  /** The type of run step, which can be either `message_creation` or `tool_calls`. */
  type: "message_creation" | "tool_calls";

  /**
   * The status of the run step, which can be either `in_progress`, `cancelled`, `failed`,
   * `completed`, or `expired`.
   */
  status: "in_progress" | "cancelled" | "failed" | "completed" | "expired";

  /** The details of the run step. */
  step_details: RunStepDetails;

  /** The last error associated with this run step. Will be `null` if there are no errors. */
  last_error: {
    /** One of `server_error` or `rate_limit_exceeded`. */
    code: "server_error" | "rate_limit_exceeded";

    /** A human-readable description of the error. */
    message: string;
  } | null;

  /**
   * The Unix timestamp (in seconds) for when the run step expired. A step is considered expired
   * if the parent run is expired.
   */
  @encode("unixTimestamp", int32)
  expires_at: utcDateTime | null;

  /** The Unix timestamp (in seconds) for when the run step was cancelled. */
  @encode("unixTimestamp", int32)
  cancelled_at: utcDateTime | null;

  /** The Unix timestamp (in seconds) for when the run step failed. */
  @encode("unixTimestamp", int32)
  failed_at: utcDateTime | null;

  /** T The Unix timestamp (in seconds) for when the run step completed.. */
  @encode("unixTimestamp", int32)
  completed_at: utcDateTime | null;

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful for storing
   * additional information about the object in a structured format. Keys can be a maximum of 64
   * characters long and values can be a maxium of 512 characters long.
   */
  @extension("x-oaiTypeLabel", "map")
  metadata: Record<string> | null;

  usage: RunCompletionUsage | null;
}

/** Tool call objects */
model RunToolCallObject {
  /**
   * The ID of the tool call. This ID must be referenced when you submit the tool outputs in using
   * the [Submit tool outputs to run](/docs/api-reference/runs/submitToolOutputs) endpoint.
   */
  id: string;

  /** The type of tool call the output is required for. For now, this is always `function`. */
  type: "function";

  /** The function definition. */
  function: {
    /** The name of the function. */
    name: string;

    /** The arguments that the model expects you to pass to the function. */
    arguments: string;
  }
}
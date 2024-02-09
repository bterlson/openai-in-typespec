import "../common/models.tsp";
import "../messages/models.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

namespace OpenAI;

model CreateThreadRequest {
  /** A list of [messages](/docs/api-reference/messages) to start the thread with. */
  messages?: CreateMessageRequest[];

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful for storing
   * additional information about the object in a structured format. Keys can be a maximum of 64
   * characters long and values can be a maxium of 512 characters long.
   */
  metadata?: Record<string> | null;
}

model ModifyThreadRequest {
  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful for storing
   * additional information about the object in a structured format. Keys can be a maximum of 64
   * characters long and values can be a maxium of 512 characters long.
   */
  metadata?: Record<string> | null;
}

model DeleteThreadResponse {
  id: string;
  deleted: boolean;
  object: "thread.deleted";
}

/** Represents a thread that contains [messages](/docs/api-reference/messages). */
model ThreadObject {
  /** The identifier, which can be referenced in API endpoints. */
  id: string;

  /** The object type, which is always `thread`. */
  object: "thread";

  /** The Unix timestamp (in seconds) for when the thread was created. */
  @encode("unixTimestamp", int32)
  created_at: utcDateTime;

  /**
    * Set of 16 key-value pairs that can be attached to an object. This can be useful for storing
    * additional information about the object in a structured format. Keys can be a maximum of 64
    * characters long and values can be a maxium of 512 characters long.
    */
  @extension("x-oaiTypeLabel", "map")
  metadata: Record<string> | null;
}
import "@typespec/http";
import "@typespec/openapi";

import "../common/errors.tsp";
import "./models.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

namespace OpenAI;

@route("/threads")
interface Threads {
  @post
  @operationId("createThread")
  @tag("OpenAI")
  @summary("Create a thread.")
  createThread(
    @body thread: CreateThreadRequest,
  ): ThreadObject | ErrorResponse;

  @route("{thread_id}")
  @get
  @operationId("getThread")
  @tag("OpenAI")
  @summary("Retrieves a thread.")
  getThread(
    /** The ID of the thread to retrieve. */
    @path thread_id: string,
  ): ThreadObject | ErrorResponse;

  @route("{thread_id}")
  @post
  @operationId("modifyThread")
  @tag("OpenAI")
  @summary("Modifies a thread.")
  modifyThread(
    /** The ID of the thread to modify. Only the `metadata` can be modified. */
    @path thread_id: string,
    @body thread: ModifyThreadRequest,
  ): ThreadObject | ErrorResponse;

  @route("{thread_id}")
  @delete
  @operationId("deleteThread")
  @tag("OpenAI")
  @summary("Delete a thread.")
  deleteThread(
    /** The ID of the thread to delete. */
    @path thread_id: string,
  ): DeleteThreadResponse | ErrorResponse;
}

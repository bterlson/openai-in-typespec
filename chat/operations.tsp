import "@typespec/http";
import "@typespec/openapi";

import "../common/errors.tsp";
import "./models.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

namespace OpenAI;

@route("/chat")
interface Chat {
  @route("completions")
  @post
  @operationId("createChatCompletion")
  @tag("OpenAI")
  @summary("Creates a model response for the given chat conversation.")
  createChatCompletion(
    ...CreateChatCompletionRequest,
  ): CreateChatCompletionResponse | ErrorResponse;
}
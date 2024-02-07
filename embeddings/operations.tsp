import "@typespec/http";
import "@typespec/openapi";

import "../common/errors.tsp";
import "./models.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

namespace OpenAI;

@route("/embeddings")
interface Embeddings {
  @post
  @operationId("createEmbedding")
  @tag("Embeddings")
  @summary("Creates an embedding vector representing the input text.")
  createEmbedding(
    @body embedding: CreateEmbeddingRequest,
  ): CreateEmbeddingResponse | ErrorResponse;
}

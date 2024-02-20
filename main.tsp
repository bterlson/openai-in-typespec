import "@typespec/http";
import "@typespec/openapi3";
import "@typespec/openapi";
import "@azure-tools/typespec-client-generator-core";

import "./audio";
import "./assistants";
import "./chat";
import "./completions";
import "./embeddings";
import "./files";
import "./fine-tuning";
import "./images";
import "./messages";
import "./models";
import "./moderations";
import "./runs";
import "./threads";

using TypeSpec.Http;
using Azure.ClientGenerator.Core;

/** The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details. */
@service({
  title: "OpenAI API",
  termsOfService: "https://openai.com/policies/terms-of-use",
  contact: {
    name: "OpenAI Support",
    url: "https://help.openai.com",
  },
  license: {
    name: "MIT",
    url: "https://github.com/openai/openai-openapi/blob/master/LICENSE",
  },
  version: "2.0.0",
})
@server("https://api.openai.com/v1", "OpenAI Endpoint")
@useAuth(BearerAuth)
namespace OpenAI;

@@projectedName(OpenAI.CreateEmbeddingRequest, "csharp", "GenerateEmbeddingsOptions");
@@projectedName(OpenAI.CreateEmbeddingResponse, "csharp", "EmbeddingCollection");
@@projectedName(OpenAI.EmbeddingUsage, "csharp", "EmbeddingTokenUsage");

@@access(OpenAI.Embeddings.createEmbedding, Access.internal, "csharp");
@@access(OpenAI.CreateEmbeddingRequest, Access.public, "csharp");
@@access(OpenAI.CreateEmbeddingResponse, Access.public, "csharp");
@@access(OpenAI.EmbeddingUsage, Access.public, "csharp");
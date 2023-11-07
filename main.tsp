import "@typespec/http";
import "@typespec/openapi3";
import "@typespec/openapi";
import "@typespec/versioning";

import "./audio";
import "./completions";
import "./edits";
import "./embeddings";
import "./files";
import "./fine-tuning";
import "./images";
import "./moderation";
import "./versions.tsp";

using TypeSpec.Http;
using TypeSpec.Versioning;


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
  }
})
@server("https://api.openai.com/v1", "OpenAI Endpoint")
@useAuth(BearerAuth)
@useDependency(ModelDefinitions.OpenAIFlavors.OpenAI)
namespace OpenAI;


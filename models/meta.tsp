import "./models.tsp";
import "./operations.tsp";

using TypeSpec.OpenAPI;

namespace OpenAI;

// TODO: Fill in example here.
@@extension(OpenAI.Model,
  "x-oaiMeta",
  """
    name: "The model object",
    example: "*retrieve_model_response"
  """
);
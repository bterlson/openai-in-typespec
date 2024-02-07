import "./models.tsp";
import "./operations.tsp";

using TypeSpec.OpenAPI;

namespace OpenAI;

// TODO: Fill in example here.
@@extension(OpenAI.CreateModerationResponse,
  "x-oaiMeta",
  """
    name: "The moderation object",
    example: "*moderation_example"
  """
);
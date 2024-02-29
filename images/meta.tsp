import "./models.tsp";
import "./operations.tsp";

using TypeSpec.OpenAPI;

namespace OpenAI;

@@extension(OpenAI.Image,
  "x-oaiMeta",
  """
    name: "The image object",
    example: |
      {
        "url": "...",
        "revised_prompt": "..."
      }
  """
);
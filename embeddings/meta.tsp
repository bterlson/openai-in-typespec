import "./models.tsp";
import "./operations.tsp";

using TypeSpec.OpenAPI;

namespace OpenAI;

@@extension(OpenAI.Embedding,
  "x-oaiMeta",
  """
    name: The embedding object
    example: |
      {
        "object": "embedding",
        "embedding": [
          0.0023064255,
          -0.009327292,
          .... (1536 floats total for ada-002)
          -0.0028842222,
        ],
        "index": 0
      }
  """
);
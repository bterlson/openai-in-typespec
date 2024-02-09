import "./models.tsp";

import "@typespec/openapi";

using TypeSpec.OpenAPI;

namespace OpenAI;

@@extension(OpenAI.ThreadObject,
  "x-oaiMeta",
  """
    name: The thread object
    beta: true
    example: |
      {
        "id": "thread_abc123",
        "object": "thread",
        "created_at": 1698107661,
        "metadata": {}
      }
  """
);
import "./models.tsp";
import "./operations.tsp";

using TypeSpec.OpenAPI;

namespace OpenAI;

@@extension(OpenAI.OpenAIFile,
  "x-oaiMeta",
  """
    name: The file object
    example: |
      {
        "id": "file-abc123",
        "object": "file",
        "bytes": 120000,
        "created_at": 1677610602,
        "filename": "salesOverview.pdf",
        "purpose": "assistants",
      }
   """
);
import "./models.tsp";

import "@typespec/openapi";

using TypeSpec.OpenAPI;

namespace OpenAI;

// TODO: Fill in example here.
@@extension(OpenAI.ListAssistantsResponse,
  "x-oaiMeta",
  """
    name: List assistants response object
    group: chat
    example: *list_assistants_example
  """
);

// TODO: Fill in example here.
@@extension(OpenAI.AssistantObject,
  "x-oaiMeta",
  """
    name: The assistant object
    beta: true
    example: *create_assistants_example
  """
);

@@extension(OpenAI.AssistantFileObject,
  "x-oaiMeta",
  """
    name: The assistant file object
    beta: true
    example: |
      {
        "id": "file-abc123",
        "object": "assistant.file",
        "created_at": 1699055364,
        "assistant_id": "asst_abc123"
      }
  """
);
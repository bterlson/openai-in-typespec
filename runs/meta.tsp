import "./models.tsp";

import "@typespec/openapi";

using TypeSpec.OpenAPI;

namespace OpenAI;

@@extension(OpenAI.RunObject,
  "x-oaiMeta",
  """
    name: The run object
    beta: true
    example: |
      {
        "id": "run_abc123",
        "object": "thread.run",
        "created_at": 1698107661,
        "assistant_id": "asst_abc123",
        "thread_id": "thread_abc123",
        "status": "completed",
        "started_at": 1699073476,
        "expires_at": null,
        "cancelled_at": null,
        "failed_at": null,
        "completed_at": 1699073498,
        "last_error": null,
        "model": "gpt-4",
        "instructions": null,
        "tools": [{"type": "retrieval"}, {"type": "code_interpreter"}],
        "file_ids": [],
        "metadata": {},
        "usage": {
          "prompt_tokens": 123,
          "completion_tokens": 456,
          "total_tokens": 579
        }
      }
  """
);

// TODO: Fill in example here.
@@extension(OpenAI.RunStepObject,
  "x-oaiMeta",
  """
    name: The run step object
    beta: true
    example: *run_step_object_example
  """
);
import "./models.tsp";

import "@typespec/openapi";

using TypeSpec.OpenAPI;

namespace OpenAI;

@@extension(OpenAI.MessageObject,
  "x-oaiMeta",
  """
    name: The message object
    beta: true
    example: |
        {
        "id": "msg_abc123",
        "object": "thread.message",
        "created_at": 1698983503,
        "thread_id": "thread_abc123",
        "role": "assistant",
        "content": [
            {
            "type": "text",
            "text": {
                "value": "Hi! How can I help you today?",
                "annotations": []
            }
            }
        ],
        "file_ids": [],
        "assistant_id": "asst_abc123",
        "run_id": "run_abc123",
        "metadata": {}
        }
  """
);

@@extension(OpenAI.MessageFileObject,
  "x-oaiMeta",
  """
    name: The message file object
    beta: true
    example: |
      {
        "id": "file-abc123",
        "object": "thread.message.file",
        "created_at": 1698107661,
        "message_id": "message_QLoItBbqwyAJEzlTy4y9kOMM",
        "file_id": "file-abc123"
      }
  """
);
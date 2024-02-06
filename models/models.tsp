using TypeSpec.OpenAPI;

namespace OpenAI;

model ListModelsResponse {
  object: "list";
  data: Model[];
}

model DeleteModelResponse {
  id: string;
  deleted: boolean;
  object: "model";
}

/** Describes an OpenAI model offering that can be used with the API. */
// TODO: Fill in example here.
@extension(
  "x-oaiMeta",
  {
    name: "The model object",
    example: "*retrieve_model_response"
  }
)
model Model {
  /** The model identifier, which can be referenced in the API endpoints. */
  id: string;

  /** The Unix timestamp (in seconds) when the model was created. */
  @encode("unixTimestamp", int32)
  created: utcDateTime;

  /** The object type, which is always "model". */
  object: "model";

  /** The organization that owns the model. */
  owned_by: string;
}
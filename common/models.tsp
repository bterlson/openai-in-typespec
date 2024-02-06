using TypeSpec.OpenAPI;

namespace OpenAI;

scalar User extends string;

@minItems(1)
model TokenArray is safeint[];

@minItems(1)
model TokenArrayArray is TokenArray[];

model FunctionObject {
  /**
   * A description of what the function does, used by the model to choose when and how to call the
   * function.
   */
  description?: string;

  /**
   * The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and
   * dashes, with a maximum length of 64.
   */
  name: string;

  parameters?: FunctionParameters;
}

/**
 * The parameters the functions accepts, described as a JSON Schema object. See the
 * [guide](/docs/guides/gpt/function-calling) for examples, and the
 * [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for documentation
 * about the format.\n\nTo describe a function that accepts no parameters, provide the value
 * `{\"type\": \"object\", \"properties\": {}}`.
 */
model FunctionParameters is Record<unknown>;
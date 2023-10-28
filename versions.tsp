import "@typespec/versioning";

@Versioning.versioned(OpenAIFlavors)
namespace ModelDefinitions;

enum OpenAIFlavors {
    OpenAI,
    Azure,
}
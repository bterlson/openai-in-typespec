import "@typespec/versioning";
import "./openai.js";

extern dec azure(target);
extern dec azureVersion(target);

@Versioning.versioned(OpenAIFlavors)
namespace ModelDefinitions {


    enum OpenAIFlavors {
        OpenAI,
        @azureVersion
        Azure,
    }
}
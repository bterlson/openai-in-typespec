import "@typespec/versioning";
import "./openai.js";

extern dec azure(target: TypeSpec.Reflection.Model | TypeSpec.Reflection.ModelProperty | TypeSpec.Reflection.Operation);
extern dec azureVersion(target: TypeSpec.Reflection.EnumMember);

@Versioning.versioned(OpenAIFlavors)
namespace ModelDefinitions {


    enum OpenAIFlavors {
        OpenAI,
        @azureVersion
        Azure,
    }
}
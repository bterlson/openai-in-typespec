import "@typespec/http";
import "@typespec/openapi3";
import "@typespec/openapi";
import "@typespec/versioning";

import "./audio";
import "./completions";
import "./edits";
import "./embeddings";
import "./files";
import "./fine-tuning";
import "./images";
import "./moderation";
import "./versions.tsp";

import "./main.tsp";

using TypeSpec.Http;

/** The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details. */
@service({
  title: "Azure OpenAI API",
  termsOfService: "https://openai.com/policies/terms-of-use",
  contact: {
    name: "OpenAI Support",
    url: "https://help.openai.com",
  },
  license: {
    name: "MIT",
    url: "https://github.com/openai/openai-openapi/blob/master/LICENSE",
  },
})
@server("{base_url}/openai", "OpenAI Endpoint", {
    base_url: url;
})
@useAuth(BearerAuth)
@TypeSpec.Versioning.useDependency(ModelDefinitions.OpenAIFlavors.Azure)
namespace AzureOpenAI {
    @route("deployments/{deploymentId}/chat")
    namespace Chat {
        interface Completions {
            @route("completions")
            op createCompletion is OpenAI.Chat.Completions.createChatCompletion;
        };
    }

    @route("deployments/{deploymentId}/extensions/chat")
    namespace ChatExtensions {
      @route("completions")
      op createCompletionOnYourOwnData(... ModelDefinitions.CreateChatCompletionRequest, dataSources: DataSource[]): ModelDefinitions.CreateChatCompletionResponse;
    }

    @route("deployments/{deploymentId}/completions")
    namespace Completions {
      op createCompletion is OpenAI.Completions.createCompletion;
    }

    @route("deployments/{deploymentId}/embeddings")
    namespace Embeddings {
      op createEmbedding is OpenAI.Embeddings.createEmbedding;
    }

    @route("deployments/{deploymentId}/audio")
    namespace Audio {
      @route("transcriptions")
      op transcriptions is OpenAI.Audio.Transcriptions.createTranscription;

      @route("translations")
      op translations is OpenAI.Audio.Translations.createTranslation;
    }

    @route("/files")
    interface Files extends OpenAI.Files {};

    @route("/fine-tunes")
    interface FineTunes extends OpenAI.FineTunes {};

    @route("/fine-tuning")
    interface FineTuning extends OpenAI.FineTunes {};

    @route("/models")
    interface Models extends OpenAI.Models {};

    @route("/models")
    interface Images extends OpenAI.Images {};

    model DataSource {};
}

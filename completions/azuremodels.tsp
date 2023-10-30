import "../versions.tsp";

namespace ModelDefinitions;

using TypeSpec.Versioning;

@added(OpenAIFlavors.Azure)
model ContentFilterResult {
  severity: "safe" | "low" | "medium" | "high";
  filtered: boolean;
}

@added(OpenAIFlavors.Azure)
model ErrorBase {
  code?: string;
  message?: string;
};

@added(OpenAIFlavors.Azure)
model ContentFilterResults {
  sexual: ContentFilterResult;
  violence: ContentFilterResult;
  hate: ContentFilterResult;
  self_harm: ContentFilterResult;
  error: ErrorBase;
}


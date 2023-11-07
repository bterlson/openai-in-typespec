import "../versions.tsp";

namespace ModelDefinitions;

using TypeSpec.Versioning;

@azure
model ContentFilterResult {
  severity: "safe" | "low" | "medium" | "high";
  filtered: boolean;
}

@azure
model ErrorBase {
  code?: string;
  message?: string;
};

@azure
model ContentFilterResults {
  sexual: ContentFilterResult;
  violence: ContentFilterResult;
  hate: ContentFilterResult;
  self_harm: ContentFilterResult;
  error: ErrorBase;
}


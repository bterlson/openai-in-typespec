using TypeSpec.OpenAPI;

namespace OpenAI;

model CreateFineTuningJobRequest {
  /**
   * The name of the model to fine-tune. You can select one of the
   * [supported models](/docs/guides/fine-tuning/what-models-can-be-fine-tuned).
   */
  @extension("x-oaiTypeLabel", "string")
  `model`: string | "babbage-002" | "davinci-002" | "gpt-3.5-turbo";

  /**
   * The ID of an uploaded file that contains training data.
   * 
   * See [upload file](/docs/api-reference/files/upload) for how to upload a file.
   * 
   * Your dataset must be formatted as a JSONL file. Additionally, you must upload your file with
   * the purpose `fine-tune`.
   * 
   * See the [fine-tuning guide](/docs/guides/fine-tuning) for more details.
   */
  training_file: string;

  /** The hyperparameters used for the fine-tuning job. */
  hyperparameters?: {
    /**
     * Number of examples in each batch. A larger batch size means that model parameters are
     * updated less frequently, but with lower variance.
     */
    batch_size?: "auto" | BatchSize = "auto";

    /**
     * Scaling factor for the learning rate. A smaller learning rate may be useful to avoid 
     * overfitting.
     */
    learning_rate_multiplier?: "auto" | LearningRateMultiplier = "auto";

    /**
     * The number of epochs to train the model for. An epoch refers to one full cycle through the
     * training dataset.
     */
    n_epochs?: "auto" | NEpochs = "auto";
  };

  /**
   * A string of up to 18 characters that will be added to your fine-tuned model name.
   *
   * For example, a `suffix` of "custom-model-name" would produce a model name like
   * `ft:gpt-3.5-turbo:openai:custom-model-name:7p4lURel`.
   */
  suffix?: SuffixString | null = null;

  /**
   * The ID of an uploaded file that contains validation data.
   * 
   * If you provide this file, the data is used to generate validation metrics periodically during
   * fine-tuning. These metrics can be viewed in the fine-tuning results file. The same data should
   * not be present in both train and validation files.
   * 
   * Your dataset must be formatted as a JSONL file. You must upload your file with the purpose
   * `fine-tune`.
   * 
   * See the [fine-tuning guide](/docs/guides/fine-tuning) for more details.
   */
  validation_file?: string | null;
}

model ListPaginatedFineTuningJobsResponse {
  data: FineTuningJob[];

  has_more: boolean;

  object: "list";
}

model ListFineTuningJobEventsResponse {
  data: FineTuningJobEvent[];

  object: "list";

  // TODO: The sample in the OpenAPI spec includes a `has_more` property that is not included here.
}

@minValue(1)
@maxValue(50)
scalar NEpochs extends safeint;

@minValue(1)
@maxValue(256)
scalar BatchSize extends safeint;

@minValueExclusive(0)
scalar LearningRateMultiplier extends float64;

@minLength(1)
@maxLength(40)
scalar SuffixString extends string;

/* The `fine_tuning.job` object represents a fine-tuning job that has been created through the API. */
model FineTuningJob {
  /** The object identifier, which can be referenced in the API endpoints. */
  id: string;

  /** The Unix timestamp (in seconds) for when the fine-tuning job was created. */
  @encode("unixTimestamp", int32)
  created_at: utcDateTime;

  /**
   * For fine-tuning jobs that have `failed`, this will contain more information on the cause of the
   * failure.
   */
  error: {
    /** A machine-readable error code. */
    code: string;

    /** A human-readable error message. */
    message: string;

    /**
     * The parameter that was invalid, usually `training_file` or `validation_file`. This field will
     * be null if the failure was not parameter-specific.
     */
    param: string | null;
  } | null;

  /**
   * The name of the fine-tuned model that is being created. The value will be null if the
   * fine-tuning job is still running.
   */
  fine_tuned_model: string | null;

  /**
   * The Unix timestamp (in seconds) for when the fine-tuning job was finished. The value will be
   * null if the fine-tuning job is still running.
   */
  @encode("unixTimestamp", int32)
  finished_at: utcDateTime | null;

  /**
   * The hyperparameters used for the fine-tuning job. See the
   * [fine-tuning guide](/docs/guides/fine-tuning) for more details.
   */
  hyperparameters: {
    /**
     * The number of epochs to train the model for. An epoch refers to one full cycle through the
     * training dataset.
     *
     * "auto" decides the optimal number of epochs based on the size of the dataset. If setting the
     * number manually, we support any number between 1 and 50 epochs.
     */
    n_epochs: "auto" | NEpochs = "auto";
  };

  /** The base model that is being fine-tuned. */
  `model`: string;

  /** The object type, which is always "fine_tuning.job". */
  object: "fine_tuning.job";

  /** The organization that owns the fine-tuning job. */
  organization_id: string;

  /**
   * The compiled results file ID(s) for the fine-tuning job. You can retrieve the results with the
   * [Files API](/docs/api-reference/files/retrieve-contents).
   */
  result_files: string[];

  /**
   * The current status of the fine-tuning job, which can be either `validating_files`, `queued`,
   * `running`, `succeeded`, `failed`, or `cancelled`.
   */
  status:
    |  "validating_files"
    | "queued"
    | "running"
    | "succeeded"
    | "failed"
    | "cancelled";

  /**
   * The total number of billable tokens processed by this fine-tuning job. The value will be null
   * if the fine-tuning job is still running.
   */
  trained_tokens: safeint | null;

  /**
   * The file ID used for training. You can retrieve the training data with the
   * [Files API](/docs/api-reference/files/retrieve-contents).
   */
  training_file: string;

  /**
   * The file ID used for validation. You can retrieve the validation results with the
   * [Files API](/docs/api-reference/files/retrieve-contents).
   */
  validation_file: string | null;
}

/** Fine-tuning job event object */
model FineTuningJobEvent {
  id: string;

  @encode("unixTimestamp", int32)
  created_at: utcDateTime;

  level: "info" | "warn" | "error";

  message: string;

  object: "fine_tuning.job.event";
}
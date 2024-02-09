import "@typespec/http";
import "@typespec/openapi";

import "../common/errors.tsp";
import "./models.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

namespace OpenAI;

@route("/fine_tuning")
namespace FineTuning {
  @route("jobs")
  interface Jobs {
    /**
     * Creates a job that fine-tunes a specified model from a given dataset.
     *
     * Response includes details of the enqueued job including job status and the name of the
     * fine-tuned models once complete.
     *
     * [Learn more about fine-tuning](/docs/guides/fine-tuning)
     */
    @post
    @tag("Fine-tuning")
    @operationId("createFineTuningJob")
    createFineTuningJob(
      @body job: CreateFineTuningJobRequest,
    ): FineTuningJob | ErrorResponse;

    @get
    @tag("Fine-tuning")
    @operationId("listPaginatedFineTuningJobs")
    listPaginatedFineTuningJobs(
      /** Identifier for the last job from the previous pagination request. */
      @query after?: string,

      /** Number of fine-tuning jobs to retrieve. */
      @query limit?: safeint = 20,
    ): ListPaginatedFineTuningJobsResponse | ErrorResponse;

    @summary("""
    Get info about a fine-tuning job.
  
    [Learn more about fine-tuning](/docs/guides/fine-tuning)
    """)
    @route("{fine_tuning_job_id}")
    @tag("Fine-tuning")
    @get
    @operationId("retrieveFineTuningJob")
    retrieveFineTuningJob(
      @path fine_tuning_job_id: string,
    ): FineTuningJob | ErrorResponse;

    @summary("Get status updates for a fine-tuning job.")
    @tag("Fine-tuning")
    @route("{fine_tuning_job_id}/events")
    @get
    @operationId("listFineTuningEvents")
    listFineTuningEvents(
      /** The ID of the fine-tuning job to get events for. */
      @path fine_tuning_job_id: string,

      /** Identifier for the last event from the previous pagination request. */
      @query after?: string,

      /** Number of events to retrieve. */
      @query limit?: integer = 20,
    ): ListFineTuningJobEventsResponse | ErrorResponse;

    @summary("Immediately cancel a fine-tune job.")
    @tag("Fine-tuning")
    @route("{fine_tuning_job_id}/cancel")
    @post
    @operationId("cancelFineTuningJob")
    cancelFineTuningJob(
      /** The ID of the fine-tuning job to cancel. */
      @path fine_tuning_job_id: string,
    ): FineTuningJob | ErrorResponse;
  }
}

@route("/fine-tunes")
interface FineTunes {
  #deprecated "deprecated"
  @post
  @tag("Fine-tuning")
  @summary("""
  Creates a job that fine-tunes a specified model from a given dataset.

  Response includes details of the enqueued job including job status and the name of the fine-tuned models once complete.

  [Learn more about fine-tuning](/docs/guides/legacy-fine-tuning)
  """)
  @operationId("createFineTune")
  createFineTune(
    @body fine_tune: CreateFineTuneRequest,
  ): FineTune | ErrorResponse;

  #deprecated "deprecated"
  @get
  @tag("Fine-tuning")
  @summary("List your organization's fine-tuning jobs")
  @operationId("listFineTunes")
  listFineTunes(): ListFineTunesResponse | ErrorResponse;

  #deprecated "deprecated"
  @get
  @route("{fine_tune_id}")
  @tag("Fine-tuning")
  @summary("""
  Gets info about the fine-tune job.

  [Learn more about fine-tuning](/docs/guides/legacy-fine-tuning)
  """)
  @operationId("retrieveFineTune")
  retrieveFineTune(
    /** The ID of the fine-tune job */
    @path fine_tune_id: string,
  ): FineTune | ErrorResponse;

  #deprecated "deprecated"
  @route("{fine_tune_id}/events")
  @get
  @tag("Fine-tuning")
  @summary("Get fine-grained status updates for a fine-tune job.")
  @operationId("listFineTuneEvents")
  listFineTuneEvents(
    /** The ID of the fine-tune job to get events for. */
    @path fine_tune_id: string,

    /**
     * Whether to stream events for the fine-tune job. If set to true, events will be sent as
     * data-only
     * [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format)
     * as they become available. The stream will terminate with a `data: [DONE]` message when the
     * job is finished (succeeded, cancelled, or failed).
     *
     * If set to false, only events generated so far will be returned.
     */
    @query stream?: boolean = false,
  ): ListFineTuneEventsResponse | ErrorResponse;

  #deprecated "deprecated"
  @route("{fine_tune_id}/cancel")
  @post
  @tag("Fine-tuning")
  @summary("Immediately cancel a fine-tune job.")
  @operationId("cancelFineTune")
  cancelFineTune(
    /** The ID of the fine-tune job to cancel */
    @path fine_tune_id: string,
  ): FineTune | ErrorResponse;
}
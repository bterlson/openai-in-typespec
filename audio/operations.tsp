import "@typespec/http";
import "@typespec/openapi";

import "../common/errors.tsp";
import "./models.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

namespace OpenAI;

@route("/audio")
interface Audio {
  @route("speech")
  @post
  @operationId("createSpeech")
  @tag("OpenAI")
  @summary("Generates audio from the input text.")
  createSpeech(
    @body speech: CreateSpeechRequest,
  ): {
    @header contentType: "application/octet-stream";
    @header("Transfer-Encoding") transferEncoding: "chunked";
    @body @encode("binary") audio: bytes;
  };

  @route("transcriptions")
  @post
  @operationId("createTranscription")
  @tag("OpenAI")
  @summary("Transcribes audio into the input language.")
  createTranscription(
    @header contentType: "multipart/form-data",
    @body audio: CreateTranscriptionRequest,
  ):
  | CreateTranscriptionResponse
  | {
      @header contentType: "text/plain";
      @body text: string; 
    }
  | ErrorResponse;

  @route("translations")
  @post
  @operationId("createTranslation")
  @tag("OpenAI")
  @summary("Transcribes audio into the input language.")
  createTranslation(
    @header contentType: "multipart/form-data",
    @body audio: CreateTranslationRequest,
  ): 
  | CreateTranslationResponse
  | {
      @header contentType: "text/plain";
      @body text: string; 
    }
  | ErrorResponse;
}
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
  @tag("Audio")
  @summary("Generates audio from the input text.")
  createSpeech(
    @body speech: CreateSpeechRequest,
  ): {
    /** chunked */
    @header("Transfer-Encoding") transferEncoding?: string;

    @header contentType: "application/octet-stream";
    @body @encode("binary") audio: bytes;
  };

  @route("transcriptions")
  @post
  @operationId("createTranscription")
  @tag("Audio")
  @summary("Transcribes audio into the input language.")
  createTranscription(
    @header contentType: "multipart/form-data",
    @body audio: CreateTranscriptionRequest,
  ):
  | CreateTranscriptionResponse
  | {
      // TODO: Is this the appropriate way to describe the multiple possible response types?
      @header contentType: "text/plain";
      @body text: string; 
    }
  | ErrorResponse;

  @route("translations")
  @post
  @operationId("createTranslation")
  @tag("Audio")
  @summary("Translates audio into English..")
  createTranslation(
    @header contentType: "multipart/form-data",
    @body audio: CreateTranslationRequest,
  ): 
  | CreateTranslationResponse
  | {
      // TODO: Is this the appropriate way to describe the multiple possible response types?
      @header contentType: "text/plain";
      @body text: string; 
    }
  | ErrorResponse;
}
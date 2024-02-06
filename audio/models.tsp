import "../common/models.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

namespace OpenAI;

model CreateSpeechRequest {
  /** One of the available [TTS models](/docs/models/tts): `tts-1` or `tts-1-hd` */
  @extension("x-oaiTypeLabel", "string")
  `model`: string | TEXT_TO_SPEECH_MODELS;

  /**
   * The text to generate audio for. The maximum length is 4096 characters.
   */
  @maxLength(4096)
  input: string;

  /**
   * The voice to use when generating the audio. Supported voices are `alloy`, `echo`, `fable`,
   * `onyx`, `nova`, and `shimmer`. Previews of the voices are available in the
   * [Text to speech guide](/docs/guides/text-to-speech/voice-options).
   */
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

  /**
   * The format of the transcript output, in one of these options: json, text, srt, verbose_json, or
   * vtt.
   */
  response_format?: "json" | "text" | "srt" | "verbose_json" | "vtt" = "json";

  /**
   * The speed of the generated audio. Select a value from `0.25` to `4.0`. `1.0` is the default.
   */
  @minValue(0.25)
  @maxValue(4.0)
  speed?: float64 = 1.0;
}

model CreateTranscriptionRequest {
  /**
   * The audio file object (not file name) to transcribe, in one of these formats: flac, mp3, mp4,
   * mpeg, mpga, m4a, ogg, wav, or webm.
   */
  @encode("binary")
  @extension("x-oaiTypeLabel", "file")
  file: bytes;

  /** ID of the model to use. Only `whisper-1` is currently available. */
  @extension("x-oaiTypeLabel", "string")
  `model`: string | SPEECH_TO_TEXT_MODELS;

  /**
   * The language of the input audio. Supplying the input language in
   * [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) format will improve accuracy
   * and latency.
   */
  language?: string;

  /**
   * An optional text to guide the model's style or continue a previous audio segment. The
   * [prompt](/docs/guides/speech-to-text/prompting) should match the audio language.
   */
  prompt?: string;

  /**
   * The format of the transcript output, in one of these options: json, text, srt, verbose_json, or
   * vtt.
   */
  response_format?: "json" | "text" | "srt" | "verbose_json" | "vtt" = "json";

  /**
   * The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more
   * random, while lower values like 0.2 will make it more focused and deterministic. If set to 0,
   * the model will use [log probability](https://en.wikipedia.org/wiki/Log_probability) to
   * automatically increase the temperature until certain thresholds are hit.
   */
  @minValue(0)
  @maxValue(1)
  temperature?: float64 = 0;
}

model CreateTranslationRequest {
  /**
   * The audio file object (not file name) to translate, in one of these formats: flac, mp3, mp4,
   * mpeg, mpga, m4a, ogg, wav, or webm.
   */
  @encode("binary")
  @extension("x-oaiTypeLabel", "file")
  file: bytes;

  /** ID of the model to use. Only `whisper-1` is currently available. */
  @extension("x-oaiTypeLabel", "string")
  `model`: string | SPEECH_TO_TEXT_MODELS;

  /**
   * An optional text to guide the model's style or continue a previous audio segment. The
   * [prompt](/docs/guides/speech-to-text/prompting) should match the audio language.
   */
  prompt?: string;

  // NOTE: this is just string in the actual API?
  /**
   * The format of the transcript output, in one of these options: json, text, srt, verbose_json, or
   * vtt.
   */
  response_format?: "json" | "text" | "srt" | "verbose_json" | "vtt" = "json";

  /**
   * The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more
   * random, while lower values like 0.2 will make it more focused and deterministic. If set to 0,
   * the model will use [log probability](https://en.wikipedia.org/wiki/Log_probability) to
   * automatically increase the temperature until certain thresholds are hit.
   */
  @minValue(0)
  @maxValue(1)
  temperature?: float64 = 0;
}

// TODO: This model is not defined in the OpenAI API spec.
model CreateTranscriptionResponse {
  /** The transcribed text for the provided audio data. */
  text: string;

  /** The label that describes which operation type generated the accompanying response data. */
  task?: "transcribe";

  /** The spoken language that was detected in the audio data. */
  language?: string;

  /**
   * The total duration of the audio processed to produce accompanying transcription information.
   */
  @encode("seconds", float64)
  duration?: duration;

  /**
   * A collection of information about the timing, probabilities, and other detail of each processed
   * audio segment.
   */
  segments?: AudioSegment[];
}

// TODO: This model is not defined in the OpenAI API spec.
model CreateTranslationResponse {
  /** The translated text for the provided audio data. */
  text: string;

  /** The label that describes which operation type generated the accompanying response data. */
  task?: "translate";

  /** The spoken language that was detected in the audio data. */
  language?: string;

  /** The total duration of the audio processed to produce accompanying translation information. */
  @encode("seconds", float64)
  duration?: duration;

  /**
   * A collection of information about the timing, probabilities, and other detail of each processed
   * audio segment.
   */
  segments?: AudioSegment[];
}

alias TEXT_TO_SPEECH_MODELS =
  | "tts-1"
  | "tts-1-hd";

alias SPEECH_TO_TEXT_MODELS =
  | "whisper-1";

// TODO: This model is not defined in the OpenAI API spec.
model AudioSegment {
  /** The zero-based index of this segment. */
  id: safeint;

  /**
   * The seek position associated with the processing of this audio segment. Seek positions are
   * expressed as hundredths of seconds. The model may process several segments from a single seek
   * position, so while the seek position will never represent a later time than the segment's
   * start, the segment's start may represent a significantly later time than the segment's
   * associated seek position.
  */
  seek: safeint;

  /** The time at which this segment started relative to the beginning of the audio. */
  @encode("seconds", float64)
  start: duration;

  /** The time at which this segment ended relative to the beginning of the audio. */
  @encode("seconds", float64)
  end: duration;

  /** The text that was part of this audio segment. */
  text: string;

  /** The token IDs matching the text in this audio segment. */
  tokens: TokenArray;

  /** The temperature score associated with this audio segment. */
  @minValue(0)
  @maxValue(1)
  temperature: float64;

  /** The average log probability associated with this audio segment. */
  avg_logprob: float64;

  /** The compression ratio of this audio segment. */
  compression_ratio: float64;

  /** The probability of no speech detection within this audio segment. */
  no_speech_prob: float64;
}
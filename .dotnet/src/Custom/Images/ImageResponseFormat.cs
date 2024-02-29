using System;

namespace OpenAI.Images;

/// <summary>
/// Represents the available output methods for generated images.
/// <list type="bullet">
/// <item>
///     <c>url</c> - <see cref="ImageResponseFormat.Uri"/> - Default, provides a temporary internet location that
///     the generated image can be retrieved from.
/// </item>
/// <item>
///     <c>b64_json</c> - <see cref="ImageResponseFormat.Bytes"/> - Provides the full image data on the response,
///     encoded in the result as a base64 string. This offers the fastest round trip time but can drastically
///     increase the size of response payloads.
/// </item>
/// </list>
/// </summary>
public enum ImageResponseFormat
{
    /// <summary>
    /// Instructs the request to return image data directly on the response, encoded as a base64 string in the response
    /// JSON. This minimizes availability time but drastically increases the size of responses, required bandwidth, and
    /// immediate memory needs. This is equivalent to <c>b64_json</c> in the REST API.
    /// </summary>
    Bytes,
    /// <summary>
    /// The default setting that instructs the request to return a temporary internet location from which the image can
    /// be retrieved.
    /// </summary>
    Uri,
}
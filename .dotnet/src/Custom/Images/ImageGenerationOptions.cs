namespace OpenAI.Images;

/// <summary>
/// Represents additional options available to control the behavior of an image generation operation.
/// </summary>
public partial class ImageGenerationOptions
{
    /// <summary>
    /// Specifies the quality level of the image that will be generated. This setting is only available when using
    /// the <c>dall-e-3</c> model.
    /// <list type="bullet">
    /// <item>
    ///     <c>hd</c> - <see cref="ImageQuality.High"/> - Finer details, greater consistency, slower, more intensive.
    /// </item>
    /// <item>
    ///     <c>standard</c> - <see cref="ImageQuality.Standard"/> - The default quality level that's faster and less
    ///     intensive but may also be less detailed and consistent than <c>hd</c>.
    /// </item>
    /// </list>
    /// </summary>
    public ImageQuality? Quality { get; set; }
    /// <summary>
    /// Specifies the desired output representation of the generated image.
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
    public ImageResponseFormat? ResponseFormat { get; set; }
    /// <summary>
    /// Specifies the dimensions of the generated image. Larger images take longer to create.
    /// <para>
    /// <b>Available for <c>dall-e-2</c></b>:
    /// <list type="bullet">
    /// <item><c>1024x1024</c> - <see cref="ImageSize.Size1024x1024"/> - default</item>
    /// <item><c>256x256</c> - <see cref="ImageSize.Size256x256"/></item> - small
    /// <item><c>512x512</c> - <see cref="ImageSize.Size512x512"/></item> - medium
    /// </list>
    /// </para>
    /// <para>
    /// <b>Available for <c>dall-e-3</c>:</b>
    /// <list type="bullet">
    /// <item><c>1024x1024</c> - <see cref="ImageSize.Size1024x1024"/> - default</item>
    /// <item><c>1024x1792</c> - <see cref="ImageSize.Size1024x1792"/> - extra tall</item>
    /// <item><c>1792x1024</c> - <see cref="ImageSize.Size1792x1024"/> - extra wide</item>
    /// </list>
    /// </para>
    /// </summary>
    public ImageSize? Size { get; set; }
    /// <summary>
    /// The style kind to guide the generation of the image.
    /// <list type="bullet">
    /// <item>
    ///     <c>vivid</c> - <see cref="ImageStyle.Vivid"/> - default, a style that tends towards more realistic,
    ///     dramatic images.
    /// </item>
    /// <item>
    ///     <c>natural</c> - <see cref="ImageStyle.Natural"/> - a more subdued style with less tendency towards
    ///     realism and striking imagery.
    /// </item>
    /// </list>
    /// </summary>
    public ImageStyle? Style { get; set; }
    /// <summary>
    /// An optional identifier for the end user that can help OpenAI monitor for and detect abuse.
    /// </summary>
    public string User { get; set; }
}
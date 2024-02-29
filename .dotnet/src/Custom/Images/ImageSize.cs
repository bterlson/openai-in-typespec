namespace OpenAI.Images;

/// <summary>
/// Represents the available output dimensions for generated images.
/// </summary>
public enum ImageSize
{
    /// <summary>
    /// A square image with 1024 pixels of both width and height.
    /// <para>
    /// <b>Supported</b> and <b>default</b> for both <c>dall-e-2</c> and <c>dall-e-3</c> models.
    /// </para>
    /// </summary>
    Size1024x1024,
    /// <summary>
    /// An extra tall image, 1024 pixels wide by 1792 pixels high.
    /// <para>
    /// Supported <b>only</b> for the <c>dall-e-3</c> model.
    /// </para>
    /// </summary>
    Size1024x1792,
    /// <summary>
    /// An extra wide image, 1792 pixels wide by 1024 pixels high.
    /// <para>
    /// Supported <b>only</b> for the <c>dall-e-3</c> model.
    /// </para>
    /// </summary>
    Size1792x1024,
    /// <summary>
    /// A small, square image with 256 pixels of both width and height.
    /// <para>
    /// Supported <b>only</b> for the older <c>dall-e-2</c> model.
    /// </para>
    /// </summary>
    Size256x256,
    /// <summary>
    /// A medium-small, square image with 512 pixels of both width and height.
    /// <para>
    /// Supported <b>only</b> for the older <c>dall-e-2</c> model.
    /// </para>
    /// </summary>
    Size512x512,
}
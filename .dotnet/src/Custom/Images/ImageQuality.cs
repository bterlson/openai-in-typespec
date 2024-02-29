namespace OpenAI.Images;

/// <summary>
/// A representation of the quality setting for image operations that controls the level of work that the model will
/// perform.
/// </summary>
/// <remarks>
/// Available qualities consist of:
/// <list type="bullet">
/// <item><see cref="Standard"/> - <c>standard</c> - The default setting that balances speed, detail, and consistecy. </item>
/// <item><see cref="High"/> - <c>hd</c> - Better consistency and finer details, but may be slower. </item>
/// </list>
/// </remarks>
public enum ImageQuality
{
    /// <summary>
    /// The <c>hd</c> image quality that provides finer details and greater consistency but may be slower.
    /// </summary>
    High,
    /// <summary>
    /// The <c>standard</c> image quality that provides a balanced mix of detailing, consistency, and speed.
    /// </summary>
    Standard,
}
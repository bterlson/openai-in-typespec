namespace OpenAI.Images;

/// <summary>
/// The style of the generated images. Must be one of vivid or natural. Vivid causes the model to lean towards
/// generating hyper-real and dramatic images. Natural causes the model to produce more natural, less hyper-real
/// looking images. This param is only supported for <c>dall-e-3</c>.
/// </summary>
public enum ImageStyle
{
    /// <summary>
    /// The <c>vivid</c> style, with which the model will tend towards hyper-realistic, dramatic imagery.
    /// </summary>
    Vivid,
    /// <summary>
    /// The <c>natural</c> style, with which the model will not tend towards hyper-realistic, dramatic imagery.
    /// </summary>
    Natural,
}
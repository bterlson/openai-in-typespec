using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace OpenAI.Images;

/// <summary>
/// Represents an image generation response payload that contains information for multiple generated images.
/// </summary>
public class ImageGenerationCollection : ReadOnlyCollection<GeneratedImage>
{
    internal ImageGenerationCollection(IList<GeneratedImage> list) : base(list) { }
}
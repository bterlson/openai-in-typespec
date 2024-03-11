using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace OpenAI.Images;

/// <summary>
/// Represents an image generation response payload that contains information for multiple generated images.
/// </summary>
public class GeneratedImageCollection : ReadOnlyCollection<GeneratedImage>
{
    internal GeneratedImageCollection(IList<GeneratedImage> list) : base(list) { }
}
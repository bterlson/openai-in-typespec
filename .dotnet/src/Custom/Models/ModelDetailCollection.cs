using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace OpenAI.ModelManagement;

/// <summary>
/// Represents a collection of entries for available models.
/// </summary>
public partial class ModelDetailCollection : ReadOnlyCollection<ModelDetails>
{
    internal ModelDetailCollection(IList<ModelDetails> list) : base(list)
    {}
}

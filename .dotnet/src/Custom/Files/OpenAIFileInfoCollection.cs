using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace OpenAI.Files;

public partial class OpenAIFileInfoCollection : ReadOnlyCollection<OpenAIFileInfo>
{
    internal OpenAIFileInfoCollection(IList<OpenAIFileInfo> list) : base(list)
    {
    }
}
using System;
using System.Collections.Generic;
using System.Text;

namespace OpenAI.Models
{
    public partial class GenerateEmbeddingsOptions
    {
        internal BinaryData Input { get; set; }

        internal GenerateEmbeddingsOptionsModel Model { get; set; }
    }
}

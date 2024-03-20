using System;
using System.ClientModel;
using System.ClientModel;
using System.ClientModel.Primitives;
using System.Threading;

namespace OpenAI;

/// <summary>
/// Client-level options for the OpenAI service.
/// </summary>
public partial class OpenAIClientOptions : RequestOptions
{
    /// <summary>
    /// Gets or sets a non-default base endpoint that clients should use when connecting.
    /// </summary>
    public Uri Endpoint { get; set; }

    // Note: this type currently proxies RequestOptions properties manually via the matching internal type. This is a
    //       temporary extra step pending richer integration with code generation.

    internal Internal.OpenAIClientOptions InternalOptions { get; }

    public new void AddPolicy(PipelinePolicy policy, PipelinePosition position)
    {
        InternalOptions.AddPolicy(policy, position);
    }

    public OpenAIClientOptions()
        : this(internalOptions: null)
    { }

    internal OpenAIClientOptions(Internal.OpenAIClientOptions internalOptions = null)
    {
        internalOptions ??= new();
        InternalOptions = internalOptions;
    }
}

using System;

namespace OpenAI.ModelManagement;

/// <summary>
/// Represents information about a single available model entry.
/// </summary>
public partial class ModelDetails
{
    /// <summary>
    /// The ID of the model as used when calling the service. An example is 'gpt-3.5-turbo'.
    /// </summary>
    public string Id { get; }
    /// <summary>
    /// The timestamp when the current model entry became available.
    /// </summary>
    public DateTimeOffset CreatedAt { get; }
    /// <summary>
    /// The name of the organization that owns the model.
    /// </summary>
    public string OwnerOrganization { get; }

    internal ModelDetails(Internal.Models.Model internalModel)
    {
        Id = internalModel.Id;
        CreatedAt = internalModel.Created;
        OwnerOrganization = internalModel.OwnedBy;
    }
}

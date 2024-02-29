using NUnit.Framework;
using OpenAI.ModelManagement;
using System.ClientModel;
using System.Linq;
using System.Threading.Tasks;

namespace OpenAI.Tests.Models;

public partial class ModelManagementClientTests
{
    [Test]
    public async Task CanListModels()
    {
        ModelManagementClient client = new();
        ClientResult<ModelDetailCollection> result = await client.GetModelsAsync();
        Assert.That(result.Value, Is.Not.Null.Or.Empty);
        Assert.That(result.Value.Any(modelInfo => modelInfo.Id.ToLowerInvariant().Contains("whisper")));
    }

    [Test]
    public async Task CanRetrieveModelInfo()
    {
        ModelManagementClient client = new();
        ClientResult<ModelDetails> result = await client.GetModelInfoAsync("gpt-3.5-turbo");
        Assert.That(result.Value, Is.Not.Null);
        Assert.That(result.Value.OwnerOrganization.ToLowerInvariant(), Contains.Substring("openai"));
    }
}

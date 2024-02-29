using OpenAI.Chat;

namespace OpenAI.Assistants;

public partial class RunError
{
    public RunErrorCode ErrorCode { get; }
    public string ErrorMessage { get; }

    internal RunError(RunErrorCode errorCode, string errorMessage)
    {
        ErrorCode = errorCode;
        ErrorMessage = errorMessage;
    }

    internal RunError(Internal.Models.RunObjectLastError internalError)
    {
        if (internalError.Code != null)
        {
            ErrorCode = new(internalError.Code.ToString());
        }
        ErrorMessage = internalError.Message;
    }
}

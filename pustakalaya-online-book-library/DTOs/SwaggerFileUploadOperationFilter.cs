using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace pustakalaya_online_book_library.DTOs
{
    public class SwaggerFileUploadOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var fileParams = context.MethodInfo
                .GetParameters()
                .Where(p => p.ParameterType == typeof(IFormFile));

            foreach (var param in fileParams)
            {
                operation.RequestBody.Content["multipart/form-data"].Schema.Properties[param.Name] = new OpenApiSchema
                {
                    Type = "string",
                    Format = "binary"
                };
            }
        }
    }
}
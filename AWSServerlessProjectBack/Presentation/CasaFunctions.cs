using System.Net;
using System.Text.Json;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using AWS.Lambda.Powertools.Logging;
using AWS.Lambda.Powertools.Metrics;
using AWS.Lambda.Powertools.Tracing;
using AWSServerlessProjectBack.Business;
using AWSServerlessProjectBack.Configuration;
using AWSServerlessProjectBack.Models.DTOs;
using Microsoft.Extensions.DependencyInjection;

namespace AWSServerlessProjectBack.Presentation
{
    public class CasaFunctions
    {
        private readonly ICasaService _casaService;
        private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        public CasaFunctions()
        {
            var provider = ServiceConfiguration.BuildServiceProvider();
            _casaService = provider.GetRequiredService<ICasaService>();
        }

        [Logging(LogEvent = true, CorrelationIdPath = CorrelationIdPaths.ApiGatewayRest)]
        [Metrics(CaptureColdStart = true)]
        [Tracing(CaptureMode = TracingCaptureMode.ResponseAndError)]
        public async Task<APIGatewayProxyResponse> GetAllCasas(APIGatewayProxyRequest request, ILambdaContext context)
        {
            try
            {
                var qs = request.QueryStringParameters;
                var page = qs != null && qs.TryGetValue("page", out var pageStr) && int.TryParse(pageStr, out var p) ? p : 1;
                var pageSize = qs != null && qs.TryGetValue("pageSize", out var pageSizeStr) && int.TryParse(pageSizeStr, out var ps) ? ps : 20;

                var result = await _casaService.GetAllAsync(page, pageSize);
                return OkResponse(result);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error al obtener casas");
                return ErrorResponse(HttpStatusCode.InternalServerError, "Error interno del servidor");
            }
        }

        [Logging(LogEvent = true, CorrelationIdPath = CorrelationIdPaths.ApiGatewayRest)]
        [Metrics(CaptureColdStart = true)]
        [Tracing(CaptureMode = TracingCaptureMode.ResponseAndError)]
        public async Task<APIGatewayProxyResponse> GetCasa(APIGatewayProxyRequest request, ILambdaContext context)
        {
            try
            {
                if (!int.TryParse(request.PathParameters?["id"], out var id))
                    return ErrorResponse(HttpStatusCode.BadRequest, "ID inválido");

                var result = await _casaService.GetByIdAsync(id);
                if (result == null) return ErrorResponse(HttpStatusCode.NotFound, "Casa no encontrada");

                return OkResponse(result);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error al obtener casa");
                return ErrorResponse(HttpStatusCode.InternalServerError, "Error interno del servidor");
            }
        }

        [Logging(LogEvent = true, CorrelationIdPath = CorrelationIdPaths.ApiGatewayRest)]
        [Metrics(CaptureColdStart = true)]
        [Tracing(CaptureMode = TracingCaptureMode.ResponseAndError)]
        public async Task<APIGatewayProxyResponse> CreateCasa(APIGatewayProxyRequest request, ILambdaContext context)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Body))
                    return ErrorResponse(HttpStatusCode.BadRequest, "Cuerpo de la petición requerido");

                var dto = JsonSerializer.Deserialize<CasaRequestDto>(request.Body, JsonOptions);
                if (dto == null) return ErrorResponse(HttpStatusCode.BadRequest, "Datos inválidos");

                var result = await _casaService.CreateAsync(dto);
                return CreatedResponse(result);
            }
            catch (JsonException)
            {
                return ErrorResponse(HttpStatusCode.BadRequest, "JSON inválido");
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error al crear casa");
                return ErrorResponse(HttpStatusCode.InternalServerError, "Error interno del servidor");
            }
        }

        [Logging(LogEvent = true, CorrelationIdPath = CorrelationIdPaths.ApiGatewayRest)]
        [Metrics(CaptureColdStart = true)]
        [Tracing(CaptureMode = TracingCaptureMode.ResponseAndError)]
        public async Task<APIGatewayProxyResponse> UpdateCasa(APIGatewayProxyRequest request, ILambdaContext context)
        {
            try
            {
                if (!int.TryParse(request.PathParameters?["id"], out var id))
                    return ErrorResponse(HttpStatusCode.BadRequest, "ID inválido");

                if (string.IsNullOrEmpty(request.Body))
                    return ErrorResponse(HttpStatusCode.BadRequest, "Cuerpo de la petición requerido");

                var dto = JsonSerializer.Deserialize<CasaRequestDto>(request.Body, JsonOptions);
                if (dto == null) return ErrorResponse(HttpStatusCode.BadRequest, "Datos inválidos");

                var updated = await _casaService.UpdateAsync(id, dto);
                if (!updated) return ErrorResponse(HttpStatusCode.NotFound, "Casa no encontrada");

                return NoContentResponse();
            }
            catch (JsonException)
            {
                return ErrorResponse(HttpStatusCode.BadRequest, "JSON inválido");
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error al actualizar casa");
                return ErrorResponse(HttpStatusCode.InternalServerError, "Error interno del servidor");
            }
        }

        [Logging(LogEvent = true, CorrelationIdPath = CorrelationIdPaths.ApiGatewayRest)]
        [Metrics(CaptureColdStart = true)]
        [Tracing(CaptureMode = TracingCaptureMode.ResponseAndError)]
        public async Task<APIGatewayProxyResponse> DeleteCasa(APIGatewayProxyRequest request, ILambdaContext context)
        {
            try
            {
                if (!int.TryParse(request.PathParameters?["id"], out var id))
                    return ErrorResponse(HttpStatusCode.BadRequest, "ID inválido");

                var deleted = await _casaService.DeleteAsync(id);
                if (!deleted) return ErrorResponse(HttpStatusCode.NotFound, "Casa no encontrada");

                return NoContentResponse();
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Error al eliminar casa");
                return ErrorResponse(HttpStatusCode.InternalServerError, "Error interno del servidor");
            }
        }

        private static APIGatewayProxyResponse OkResponse(object data) => new()
        {
            StatusCode = (int)HttpStatusCode.OK,
            Body = JsonSerializer.Serialize(data, JsonOptions),
            Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
        };

        private static APIGatewayProxyResponse CreatedResponse(object data) => new()
        {
            StatusCode = (int)HttpStatusCode.Created,
            Body = JsonSerializer.Serialize(data, JsonOptions),
            Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
        };

        private static APIGatewayProxyResponse NoContentResponse() => new()
        {
            StatusCode = (int)HttpStatusCode.NoContent,
            Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
        };

        private static APIGatewayProxyResponse ErrorResponse(HttpStatusCode statusCode, string message) => new()
        {
            StatusCode = (int)statusCode,
            Body = JsonSerializer.Serialize(new { error = message }, JsonOptions),
            Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
        };
    }
}

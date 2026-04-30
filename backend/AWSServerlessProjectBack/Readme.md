# Backend - CRUD Casas (AWS Serverless)

API REST serverless para gestión de propiedades inmobiliarias. Construida con .NET 10, AWS Lambda, API Gateway y PostgreSQL (RDS).

## Arquitectura

```
Cliente → API Gateway → Lambda (.NET 10) → RDS PostgreSQL
```

Capas internas de cada función Lambda:

```
Presentation (CasaFunctions)
    ↓
Business (CasaService)
    ↓
Persistence (CasaRepository → funciones almacenadas PostgreSQL)
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/casas` | Listar casas (paginado) |
| GET | `/casas/{id}` | Obtener casa por ID |
| POST | `/casas` | Crear casa |
| PUT | `/casas/{id}` | Actualizar casa |
| DELETE | `/casas/{id}` | Eliminar casa |

**URL base:** `https://g3oak4ydna.execute-api.us-east-1.amazonaws.com/Prod/`

### Parámetros de paginación (GET /casas)

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `page` | int | 1 | Número de página |
| `pageSize` | int | 20 | Resultados por página |

## Prerrequisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [AWS CLI](https://aws.amazon.com/cli/) configurado con credenciales válidas
- [Amazon.Lambda.Tools](https://github.com/aws/aws-extensions-for-dotnet-cli)

```bash
dotnet tool install -g Amazon.Lambda.Tools
```

## Correr localmente

1. Clonar el repositorio y pararse en la carpeta del proyecto:

```bash
cd backend/AWSServerlessProjectBack
```

2. Configurar la variable de entorno con la cadena de conexión a la BD:

```bash
# Windows PowerShell
$env:DB_CONNECTION_STRING = "Host=<host>;Port=5432;Database=CasasDB;Username=postgres;Password=<password>"
```

3. Compilar el proyecto:

```bash
dotnet build
```

> Para pruebas locales completas se recomienda usar [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) con `sam local start-api`.

## Despliegue

El despliegue se hace en dos pasos: empaquetar el código y actualizar cada función Lambda en AWS.

### Paso 1 — Generar el paquete

Desde `backend/AWSServerlessProjectBack/`:

```powershell
dotnet lambda package -c Release -f net10.0 --output-package ./casas-lambda.zip
```

O usando el script incluido:

```powershell
.\build.ps1
```

### Paso 2 — Actualizar las funciones en AWS

Ejecutar para cada función (reemplazar `<nombre-funcion>` con el nombre real en AWS):

```bash
aws lambda update-function-code \
  --function-name <nombre-funcion> \
  --zip-file fileb://casas-lambda.zip \
  --region us-east-1
```

Las funciones desplegadas son:

| Nombre en AWS | Handler |
|---------------|---------|
| `GetAllCasas` | `CasaFunctions::GetAllCasas` |
| `GetCasa` | `CasaFunctions::GetCasa` |
| `CreateCasa` | `CasaFunctions::CreateCasa` |
| `UpdateCasa` | `CasaFunctions::UpdateCasa` |
| `DeleteCasa` | `CasaFunctions::DeleteCasa` |

### Variables de entorno en Lambda

Configuradas en `serverless.template` y aplicadas automáticamente al desplegar:

| Variable | Descripción |
|----------|-------------|
| `DB_CONNECTION_STRING` | Cadena de conexión a RDS PostgreSQL |
| `POWERTOOLS_SERVICE_NAME` | Nombre del servicio para logs y trazas |
| `POWERTOOLS_LOG_LEVEL` | Nivel de logging (`Info`) |

## Stack CloudFormation

- **Nombre:** `awsserverless-casas`
- **Región:** `us-east-1`
- **S3 bucket artefactos:** `awsserverless-casas-360131674505-us-east-1`

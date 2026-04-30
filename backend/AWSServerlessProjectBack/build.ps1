Write-Host "Building and packaging Lambda..." -ForegroundColor Cyan

dotnet lambda package -c Release -f net8.0 --output-package ./casas-lambda.zip

if ($LASTEXITCODE -eq 0) {
    Write-Host "Package created: casas-lambda.zip" -ForegroundColor Green
} else {
    Write-Host "Build failed." -ForegroundColor Red
    exit 1
}

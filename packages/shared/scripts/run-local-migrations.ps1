param(
  [string]$envFile = "../../.env.development"
)

# Load env file (simple key=value lines)
Get-Content $envFile | ForEach-Object {
  if ($_ -match "^\s*#") { return }
  if ($_ -match "^\s*$") { return }
  $parts = $_ -split '='; if ($parts.Length -ge 2) { Set-Item -Path Env:$($parts[0].Trim()) -Value $parts[1].Trim() }
}

Write-Host "Bringing up docker-compose infra..."
docker compose -f ../../docker-compose.dev.yml up -d

Write-Host "Waiting for Postgres to be ready..."
for ($i=0; $i -lt 60; $i++) {
  try {
    docker run --rm --network host postgres:14 pg_isready -h 127.0.0.1 -p 5432 -U postgres | Out-Null
    break
  } catch { Start-Sleep -Seconds 1 }
}

Write-Host "Running migrations and seeds"
pnpm --filter @nusantara/shared run migrate
pnpm --filter @nusantara/shared run seed
pnpm --filter @nusantara/shared run migrate:smoke

Write-Host "Done"

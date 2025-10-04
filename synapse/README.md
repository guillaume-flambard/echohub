# Matrix Synapse Setup for EchoHub

## Initial Setup

1. Copy the environment example:
```bash
cp .env.matrix.example .env.matrix
```

2. Edit `.env.matrix` and set secure passwords and tokens

3. Generate Synapse configuration:
```bash
docker compose -f docker-compose.matrix.yml run --rm synapse generate
```

4. Edit `synapse/data/homeserver.yaml`:
   - Set `enable_registration: true` (initially, for creating admin user)
   - Configure database connection to use PostgreSQL
   - Add application service registration file

5. Start the services:
```bash
docker compose -f docker-compose.matrix.yml up -d
```

## Create Admin User

```bash
docker exec -it echohub_synapse register_new_matrix_user \
  -u admin \
  -p YOUR_PASSWORD \
  -a \
  -c /data/homeserver.yaml \
  http://localhost:8008
```

## Application Service Configuration

Create `synapse/data/appservice-minerva.yaml`:

```yaml
id: "minerva"
url: "http://host.docker.internal:3000"
as_token: "YOUR_AS_TOKEN"
hs_token: "YOUR_HS_TOKEN"
sender_localpart: "minerva_bot"
namespaces:
  users:
    - exclusive: true
      regex: "@app_.*:echohub.local"
  aliases:
    - exclusive: false
      regex: "#.*:echohub.local"
  rooms: []
```

Then add to `homeserver.yaml`:

```yaml
app_service_config_files:
  - /data/appservice-minerva.yaml
```

## Stop Services

```bash
docker compose -f docker-compose.matrix.yml down
```

## Logs

```bash
docker compose -f docker-compose.matrix.yml logs -f synapse
```

# Element Web Setup for Human Messaging

EchoHub includes Element Web, the official Matrix client, for human-to-human messaging.

## Quick Start

1. **Start Matrix services** (Synapse homeserver + Element Web):
   ```bash
   docker compose -f docker-compose.matrix.yml up -d
   ```

2. **Access Element Web**:
   - Open browser to: http://localhost:8009
   - You should see the Element login page with "EchoHub Element" branding

3. **Create your first user**:
   ```bash
   # Register a new Matrix user via Synapse
   docker exec -it echohub_synapse register_new_matrix_user \
     -u your_username \
     -p your_password \
     -a \
     -c /data/homeserver.yaml \
     http://localhost:8008
   ```

4. **Login to Element**:
   - Username: `@your_username:echohub.local`
   - Password: `your_password`
   - Homeserver: Should auto-detect as `echohub.local`

## Services

The Matrix stack includes:

- **Synapse**: Matrix homeserver (port 8008)
- **Element Web**: Web client for messaging (port 8009)
- **PostgreSQL**: Database for Synapse (internal)

## Features

Element Web provides:
- Direct messages between users
- Group chats and rooms
- File sharing
- Voice/video calls (via Jitsi)
- End-to-end encryption
- Message history

## Configuration

Element configuration is at `element/config.json`:

```json
{
  "default_server_config": {
    "m.homeserver": {
      "base_url": "http://localhost:8008",
      "server_name": "echohub.local"
    }
  },
  "brand": "EchoHub Element",
  "default_country_code": "TH",
  "default_theme": "dark"
}
```

## Integration with EchoHub

Human contacts in EchoHub are Matrix users. To add a human contact:

1. User registers on Element (via Element Web or API)
2. Add their Matrix ID (`@username:echohub.local`) as a contact in EchoHub
3. Chat with them via the EchoHub interface or Element Web

## Stopping Services

```bash
# Stop all Matrix services
docker compose -f docker-compose.matrix.yml down

# Stop and remove all data (reset)
docker compose -f docker-compose.matrix.yml down -v
```

## Troubleshooting

### Element won't load
- Check Synapse is running: `docker logs echohub_synapse`
- Check Element is running: `docker logs echohub_element`
- Visit http://localhost:8008/_matrix/client/versions to verify Synapse

### Can't login
- Make sure you created a user (see step 3 above)
- Username format must be `@username:echohub.local`
- Check Synapse logs for errors

### Connection issues
- Element connects to Synapse at http://localhost:8008
- Both services must be running
- If using a different hostname, update `element/config.json`

## Advanced: Admin API

Create users via Synapse Admin API:

```bash
# Get admin access token first
# Then register users via API
curl -X POST http://localhost:8008/_synapse/admin/v2/users/@newuser:echohub.local \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"password": "newpassword", "admin": false}'
```

## Next Steps

1. **Integrate with EchoHub Hub**: Create human contacts and chat via the unified interface
2. **Enable federation**: Connect to other Matrix servers (optional)
3. **Add bots**: Create Minerva AI bot users for app interactions
4. **Mobile access**: Element is available on iOS/Android, pointing to your homeserver

---

For more information:
- Element Web: https://element.io
- Matrix Protocol: https://matrix.org
- Synapse Documentation: https://matrix-org.github.io/synapse/

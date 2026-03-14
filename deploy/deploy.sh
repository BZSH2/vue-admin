#!/usr/bin/env bash
set -euo pipefail

: "${DEPLOY_PATH:?DEPLOY_PATH is required}"
: "${DEPLOY_IMAGE:?DEPLOY_IMAGE is required}"
: "${ACR_REGISTRY:?ACR_REGISTRY is required}"
: "${ACR_USERNAME:?ACR_USERNAME is required}"
: "${ACR_PASSWORD:?ACR_PASSWORD is required}"

COMPOSE_FILE="${DEPLOY_PATH}/docker-compose.prod.yml"

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "Compose file not found: $COMPOSE_FILE" >&2
  exit 1
fi

cd "$DEPLOY_PATH"

echo "$ACR_PASSWORD" | docker login "$ACR_REGISTRY" -u "$ACR_USERNAME" --password-stdin
export DEPLOY_IMAGE

docker compose -f "$COMPOSE_FILE" pull

docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

for _ in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:25000/" >/dev/null; then
    echo "Deploy succeeded: frontend is responding."

    # 仅作为提示性检查，不影响整体部署结果
    if ! curl -fsS "http://127.0.0.1:25000/api" >/dev/null; then
      echo "Warning: /api 返回非 2xx 状态码，请稍后检查后端或代理配置。" >&2
    fi

    exit 0
  fi
  sleep 2
done

echo "Health check failed, dumping container state..." >&2
docker compose -f "$COMPOSE_FILE" ps >&2 || true
docker compose -f "$COMPOSE_FILE" logs --no-color --tail=200 >&2 || true
exit 1

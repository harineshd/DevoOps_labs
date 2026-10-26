#!/bin/sh
set -e

# Discover active DNS resolver from /etc/resolv.conf
RESOLVER=$(awk 'BEGIN{ORS=" "} $1=="nameserver" {print $2}' /etc/resolv.conf | xargs)
if [ -z "$RESOLVER" ]; then
    RESOLVER="127.0.0.11"
fi

export RESOLVER
export BACKEND_HOST=${BACKEND_HOST:-backend:5000}

echo "[StreamFlix Frontend] Auto-configured DNS Resolver: $RESOLVER"
echo "[StreamFlix Frontend] Proxying /api to Backend: http://$BACKEND_HOST"

# Render template to default.conf
envsubst '${BACKEND_HOST} ${RESOLVER}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"

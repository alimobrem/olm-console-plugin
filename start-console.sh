#!/usr/bin/env bash

set -euo pipefail

CONSOLE_IMAGE=${CONSOLE_IMAGE:="quay.io/openshift/origin-console:latest"}
CONSOLE_PORT=${CONSOLE_PORT:=9000}
PLUGIN_PORT=${PLUGIN_PORT:=9001}
PLUGIN_NAME="olm-console-plugin"

echo "Starting OpenShift Console with ${PLUGIN_NAME} plugin..."

# Use podman if available, otherwise docker
CONTAINER_RUNTIME=$(command -v podman 2>/dev/null || command -v docker 2>/dev/null)

if [ -z "$CONTAINER_RUNTIME" ]; then
  echo "Error: podman or docker is required to run this script."
  exit 1
fi

echo "Using container runtime: $CONTAINER_RUNTIME"
echo "Console image: $CONSOLE_IMAGE"
echo "Console URL: http://localhost:${CONSOLE_PORT}"
echo "Plugin server: http://localhost:${PLUGIN_PORT}"

$CONTAINER_RUNTIME run \
  --rm \
  --name console \
  -p "$CONSOLE_PORT":9000 \
  --env BRIDGE_USER_AUTH="disabled" \
  --env BRIDGE_K8S_MODE="off-cluster" \
  --env BRIDGE_K8S_AUTH="bearer-token" \
  --env BRIDGE_K8S_MODE_OFF_CLUSTER_ENDPOINT="$(oc whoami --show-server)" \
  --env BRIDGE_K8S_MODE_OFF_CLUSTER_SKIP_VERIFY_TLS=true \
  --env BRIDGE_K8S_AUTH_BEARER_TOKEN="$(oc whoami --show-token)" \
  --env BRIDGE_PLUGINS="${PLUGIN_NAME}=http://host.containers.internal:${PLUGIN_PORT}" \
  --env BRIDGE_PLUGIN_PROXY='{}' \
  "$CONSOLE_IMAGE"

# OLM Console Plugin

OpenShift Console dynamic plugin for [Operator Lifecycle Manager](https://olm.operatorframework.io/) (OLM).

Provides the operator catalog, installation, and management UI for OpenShift Console as a standalone dynamic plugin using [webpack module federation](https://webpack.js.org/concepts/module-federation/).

## Features

- **OperatorHub** — browse, search, and install operators from catalog sources
- **Installed Operators** — manage ClusterServiceVersions, view operator status and details
- **Subscriptions** — manage operator update channels, approval strategies, and upgrades
- **InstallPlans** — review and approve operator installation plans
- **CatalogSources** — manage operator catalog sources
- **Operand Management** — create, edit, and delete custom resources owned by operators
- **OLMv1 Support** — tech preview support for the next-generation OLM API (ClusterExtension, ClusterCatalog)
- **Topology Integration** — operator-backed services in the topology view
- **Dashboard Health** — operator health status card on the cluster dashboard

## Prerequisites

- [Node.js](https://nodejs.org/) >= 22 with [corepack](https://npmjs.com/package/corepack) enabled
- [oc](https://console.redhat.com/openshift/downloads) CLI and an OpenShift cluster
- [Docker](https://www.docker.com) or [podman](https://podman.io) 3.2.0+ (for running the console container)

## Local Development

### 1. Build the plugin

```sh
yarn install
yarn build
```

### 2. Start the plugin HTTP server

```sh
yarn http-server
```

The plugin assets will be served at `http://localhost:9001`.

### 3. Start the console

In a separate terminal:

```sh
oc login https://your-cluster:6443 -u kubeadmin -p <password>
yarn start-console
```

Navigate to [http://localhost:9000](http://localhost:9000) to see the console with the plugin loaded.

### Development build with watch

```sh
yarn build-dev
```

## Deployment on Cluster

### Apply the manifests

```sh
oc apply -f oc-manifest.yaml
```

This creates:
- `olm-console-plugin` Namespace
- Deployment running the plugin's nginx server
- Service with a signed serving certificate
- `ConsolePlugin` resource to register the plugin with the console

### Enable the plugin

```sh
oc patch console.operator.openshift.io cluster \
  --type merge \
  --patch '{"spec":{"plugins":["olm-console-plugin"]}}'
```

### Custom image

Build and push your own image:

```sh
docker build -t quay.io/<your-account>/olm-console-plugin:latest .
docker push quay.io/<your-account>/olm-console-plugin:latest
```

Update the Deployment image in `oc-manifest.yaml` to match.

## Project Structure

```
├── console-extensions.json    # 52 console extension declarations
├── Dockerfile                 # Container image build
├── nginx.conf                 # HTTPS server config
├── oc-manifest.yaml           # OpenShift deployment manifests
├── packages/
│   └── olm-types/             # Shared OLM types, models, and constants
├── src/
│   ├── olm/                   # OLMv0 components (operators.coreos.com)
│   │   ├── actions/           # Action providers for operator resources
│   │   ├── components/        # UI components (pages, modals, descriptors)
│   │   ├── hooks/             # React hooks for OLM resources
│   │   └── utils/             # Utilities and filters
│   ├── olmv1/                 # OLMv1 components (olm.operatorframework.io)
│   │   ├── actions/           # ClusterExtension action providers
│   │   ├── components/        # ClusterExtension UI, catalog, installed software
│   │   └── hooks/             # OLMv1 catalog and flag hooks
│   └── utils/                 # SDK compatibility shims and shared utilities
├── locales/                   # i18n translation files
├── webpack.config.ts          # Webpack module federation config
└── start-console.sh           # Local console runner script
```

## Console Extensions

This plugin registers 52 console extensions:

| Category | Count | Examples |
|----------|-------|---------|
| Pages | 15 | CSV list/detail, Subscription, InstallPlan, OperatorHub, CatalogSource |
| Model metadata | 8 | ClusterServiceVersion, Subscription, InstallPlan, CatalogSource, etc. |
| Catalog | 5 | Operator catalog items, categories, item types |
| Actions | 6 | Operator, operand, subscription, catalog source actions |
| Topology | 4 | Operator-backed service sidebar sections and links |
| Feature flags | 4 | OLM, OLMv1, ClusterCatalog, ClusterExtension API detection |
| Dashboard | 1 | Operator health status card |
| Navigation | 1 | Installed Software nav item (OLMv1) |
| User preferences | 2 | OLMv1 catalog toggle |
| Other | 6 | Resource create, flag providers |

## Internationalization

Translation keys use the `olm~` and `olm-v1~` namespaces. English translation files are at:

- `locales/en/plugin__olm-console-plugin.json` (388 keys)
- `locales/en/olm-v1.json` (58 keys)

To update translations after modifying user-facing strings:

```sh
yarn i18n
```

## Related

- [openshift/console](https://github.com/openshift/console) — OpenShift Console
- [Console Dynamic Plugin SDK](https://github.com/openshift/console/tree/main/frontend/packages/console-dynamic-plugin-sdk) — Plugin SDK documentation
- [Console Plugin Template](https://github.com/openshift/console-plugin-template) — Starter template for new plugins
- [operator-framework/olm](https://github.com/operator-framework/operator-lifecycle-manager) — Operator Lifecycle Manager

# OLM Dynamic Plugin Migration Status

## Overall: 174/174 production files migrated (100%)

Zero `@console/` imports remain in production code. 19 test files still have `@console/` jest mocks (non-blocking).

## Completed Phases

### Phase 0: Dependency Decoupling — DONE
- 0.1: `@openshift-console/olm-types` shared types package (7 files)
- 0.2: Form widgets moved to `console-shared/dynamic-form/form-widgets/` (5 files)
- 0.3: OLMv1 components inlined into `console-shared/catalog/olmv1/` (3 files)
- 0.4: 11 consumer files updated, 7 package.json files updated with olm-types dependency
- OLM/OLMv1 packages' types.ts, models.ts, const.ts now re-export from olm-types (single source of truth)

### Phase 1: Dynamic Plugin Scaffold — DONE
- `plugins/olm-console-plugin/` with full scaffold
- 52 merged console extensions (OLMv0 + OLMv1)
- webpack.config.ts, tsconfig.json, Dockerfile, nginx.conf, oc-manifest.yaml

### Phase 2: Import Rewrites — DONE (100%)
- 174/174 production files have zero `@console/` imports
- 45 utility shim files created in `src/utils/`
- All `@console/internal/module/k8s` → `k8s-shims.ts` barrel
- All `@console/internal/models` → `internal-models.ts`
- All `@console/internal/components/*` → local shims (factory-shims, utils-shims, etc.)
- All `@console/shared` hooks → SDK equivalents
- All `@console/shared` components → local implementations
- All `@console/app`, `@console/topology` → local shims
- Framework components implemented: DynamicForm, Conditions, CatalogPageOverlay, MultiTabListPage, form field/widget registry, markdown renderer, etc.

### Phase 3: Static Plugin Removal — PREPARED
- OLM types/models/const are thin re-export shims pointing to `@openshift-console/olm-types`
- OLM descriptor form components re-export from `console-shared`
- OLMv1 components re-export from `console-shared`
- **Blocker for full removal**: knative-plugin imports `descriptorsToUISchema` from OLM operand utils (2 production files)
- Static packages can be deleted once: (a) knative dependency is resolved, (b) dynamic plugin is deployed on cluster

### Phase 4: Build, Deploy, Verify — PENDING
- CI/CD pipeline setup needed
- Container image build
- ConsolePlugin CR deployment
- Full verification checklist (52 extension points)
- i18n translation file migration (`olm~` → `plugin__olm-console-plugin~`)

## Files Summary

| Category | Count |
|----------|-------|
| Production source files | 174 |
| Utility shim files | 45 |
| Test files (unmigrated mocks) | 19 |
| Console extensions | 52 |
| New packages created | 2 (olm-types, olm-console-plugin) |
| Existing files modified | 22 (across 7 console packages) |

## Remaining Work for Production Readiness

1. **i18n**: Run `yarn i18n` to migrate translation keys to `plugin__olm-console-plugin` namespace
2. **Test files**: Update 19 jest mock paths from `@console/` to `@openshift-console/`
3. **knative-plugin**: Resolve `descriptorsToUISchema` dependency before static plugin deletion
4. **SyncMarkdownView**: Integrate DOMPurify for safe HTML rendering (currently renders as plain text)
5. **Factory shims**: The DetailsPage/Table/MultiListPage stubs need the actual SDK implementations wired up for full runtime functionality
6. **CI/CD**: Set up build pipeline, container image, and deployment manifests

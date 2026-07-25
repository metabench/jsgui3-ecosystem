# Oracle Data Grid Demo Deployment

> **Last verified:** 2026-07-11
> **Status:** Online and interaction-tested

## Live Demo

- URL: <http://141.144.193.218:52000/>
- Application: server-hosted Team Directory data-grid example
- Owner: `jsgui3-server`
- Source: `examples/jsgui3-html/04) data-grid/`

The page is rendered and served through `jsgui3-server`; it is not a static
HTML substitute. Its browser control supports filtering, score sorting,
pagination, and stable model-backed row selection.

## Runtime Layout

| Item | Value |
| --- | --- |
| Oracle host OS | Ubuntu |
| Remote application directory | `/home/ubuntu/apps/jsgui3-data-grid` |
| PM2 process | `jsgui3-data-grid` |
| Entrypoint | `server-vendor.js` |
| TCP port | `52000` |
| Bindings | loopback and Oracle private interface |
| Public protocol | HTTP |

OCI security-list ingress and the host's persisted `iptables` rules permit TCP
52000. PM2 startup is enabled and the current process list has been saved. The
unrelated `crawl-server-v4` process on port 3200 was left running and unchanged.

The deployed application uses the published jsgui3 package set already present
on the host plus a deployment-local vendored copy of `jsgui3-server`. That copy
contains the current control-optimizer correction needed to retain the resource
roots initialized by `jsgui3-client`. It is deliberately outside
`node_modules`, so the package installation remains untouched. Deployment-local
case-compatibility links are also present for package imports whose historical
filename casing differs on Linux.

## Verification Performed

The public URL was tested in a real Chromium browser, not only with an HTTP
probe. The verified flow was:

1. load the initial grid and asset bundles without browser errors;
2. select Ada Lovelace and confirm both the selected row and bound status text;
3. filter for `engineer` and confirm the derived result range;
4. clear the filter;
5. sort by score and confirm Mary Jackson is first;
6. move to the next page and confirm Katherine Johnson is shown.

Final operational checks also confirmed HTTP 200 from both the host loopback
address and the public URL, the PM2 process online, the expected listening
sockets, and the persisted firewall rule.

## Local Validation Record

- Optimizer root-feature regression: 11/11 passing.
- Focused data-grid browser test: passing.
- Standalone binding data-grid state flow: passing.
- Full server-hosted examples browser file: 8/10 passing; the data grid passes.
  The remaining timeouts are in the separate MVVM counter and binding-debugger
  examples and are not exercised by this deployment.

## Operations and Rollback

SSH access is configured through the machine's standard SSH configuration and
private-key locations; no Oracle API token is required for routine host access.
Use the configured Oracle SSH host entry rather than placing key material in
this repository.

Useful on-host checks:

```bash
pm2 status
pm2 logs jsgui3-data-grid --lines 100
curl -f http://127.0.0.1:52000/
sudo ss -ltnp | grep 52000
```

The earlier minimal demo remains at `/home/ubuntu/apps/jsgui3-demo` as a
rollback source. Switching applications requires intentionally changing the
PM2 process and saving the new process list; do not disturb the crawler process.

## Known Limit

The public endpoint is HTTP-only. A domain name, TLS certificate, and reverse
proxy are required before treating it as a production endpoint.

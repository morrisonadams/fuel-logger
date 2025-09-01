# Changelog

## 1.0.4
- Ensure the service listens on the correct internal port to prevent Bad Gateway errors when the mapped host port changes.

## 1.0.3
- Fix service script shebang to avoid s6-overlay PID 1 error.

## 1.0.2
- Explicitly disable Docker's `--init` in add-on config to avoid s6-overlay PID 1 error.

## 1.0.1
- Use correct `with-contenv` path in startup script to ensure s6 remains PID 1.

## 1.0.0
- Initial release.

# Reglas de Codificación

## REGLA PERMANENTE
1. Nunca usar `Set-Content -Encoding UTF8` en PowerShell 5.1.
2. Todo archivo .html, .css, .js, .json se escribe con Python (`encoding='utf-8'`) o con VS Code.
3. Si hay que usar PowerShell, usar `[System.IO.File]::WriteAllText("ruta", $contenido, [System.Text.UTF8Encoding]::new($false))`.

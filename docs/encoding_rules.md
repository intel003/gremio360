# Reglas de Codificación

## REGLA PERMANENTE
1. Nunca usar `Set-Content -Encoding UTF8` en PowerShell 5.1.
2. Todo archivo .html, .css, .js, .json se escribe con Python (`encoding='utf-8'`) o con VS Code.
3. Si hay que usar PowerShell, usar `[System.IO.File]::WriteAllText("ruta", $contenido, [System.Text.UTF8Encoding]::new($false))`.

## PROHIBICIÓN DE REGEX GENÉRICAS PARA MOJIBAKE
Prohibido "arreglar" mojibake con `re.sub()` genéricas. Regex como `re.sub(r's', '🧉', html)` o `re.sub(r'ao', 'año', html)` reemplazan todas las ocurrencias y destruyen el HTML. Si el archivo está corrupto a nivel de bytes, la única solución correcta es `git checkout <commit-sano> -- index.html` y re-aplicar los cambios con Python leyendo el archivo en modo utf-8.

## VERIFICACIÓN DE MOJIBAKE EN PRODUCCIÓN
Verificación obligatoria antes de cada push: correr `python -c "import urllib.request; html = urllib.request.urlopen('https://intel003.github.io/gremio360/').read().decode('utf-8', errors='replace'); print('Mojibake:', html.count('Ã'))"` y confirmar que el número de "Ã" es 0. Si es mayor a 0, no cerrar la tarea.

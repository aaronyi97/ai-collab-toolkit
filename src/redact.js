const SECRET_PATTERNS = [
  /sk-[A-Za-z0-9_-]{12,}/g,
  /AKIA[0-9A-Z]{16}/g,
  /(api[_-]?key|token|cookie|secret)\s*[:=]\s*[^\s,;]+/gi,
];

export function redact(text) {
  let output = String(text ?? "");
  output = output.replace(/\/Users\/[^\/\s]+/g, "/Users/<redacted>");
  output = output.replace(/\/home\/[^\/\s]+/g, "/home/<redacted>");
  for (const pattern of SECRET_PATTERNS) {
    output = output.replace(pattern, (match) => {
      const key = match.split(/[:=]/)[0];
      return key && key !== match ? key + "=<redacted>" : "<redacted-secret>";
    });
  }
  return output;
}

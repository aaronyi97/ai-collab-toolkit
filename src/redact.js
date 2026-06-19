const SECRET_PATTERNS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
  /sk-[A-Za-z0-9_-]{12,}/g,
  /AKIA[0-9A-Z]{16}/g,
  /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/g,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g,
  /(api[_-]?key|token|cookie|secret|private(?:[_-\s]+key)?)\s*[:=：]\s*[^\s,;]+/gi,
  /\b(password|passwd|pwd)\s*(?:[:=：]\s*|\s+)[^\s,;]+/gi,
];

function redactedSecret(match) {
  if (/^-----BEGIN /.test(match)) {
    return "<redacted-secret>";
  }
  const labelled = match.match(/^([A-Za-z0-9_\-\s]+?)\s*[:=：]/);
  if (labelled) {
    return labelled[1].trim().replace(/\s+/g, " ") + "=<redacted>";
  }
  const passwordLike = match.match(/^(password|passwd|pwd)\s+/i);
  if (passwordLike) {
    return passwordLike[1] + "=<redacted>";
  }
  return "<redacted-secret>";
}

export function redact(text) {
  let output = String(text ?? "");
  output = output.replace(/\/Users\/[^\/\s]+/g, "/Users/<redacted>");
  output = output.replace(/\/home\/[^\/\s]+/g, "/home/<redacted>");
  for (const pattern of SECRET_PATTERNS) {
    output = output.replace(pattern, redactedSecret);
  }
  return output;
}

const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
const testDatabaseName = /(?:^|[-_])test(?:$|[-_])/i;

export function isDedicatedTestDatabaseUrl(value) {
  try {
    const url = new URL(value);
    const databaseName = decodeURIComponent(url.pathname.slice(1));
    const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");

    return (
      ["postgres:", "postgresql:"].includes(url.protocol) &&
      localHosts.has(host) &&
      testDatabaseName.test(databaseName)
    );
  } catch {
    return false;
  }
}

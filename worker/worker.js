// Travel Checklist Cloudflare Worker v1.0.0
// Required variables / secrets:
// Secret: APP_PASSWORD, GH_TOKEN
// Plaintext: GH_OWNER, GH_REPO, GH_BRANCH, DATA_PATH

const DEFAULT_DATA = {
  appVersion: "v1.0.0",
  schemaVersion: 1,
  revision: 0,
  updatedAt: new Date(0).toISOString(),
  settings: {
    language: "zh-CN",
    hideDone: true,
    currentTripId: "mexico-2026"
  },
  trips: [
    {
      id: "mexico-2026",
      name: {
        "zh-CN": "墨西哥出行清单",
        "en-US": "Mexico Travel Checklist"
      },
      createdAt: new Date(0).toISOString()
    }
  ],
  items: []
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Max-Age": "86400"
};

export default {
  async fetch(request, env) {
    try {
      if (request.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });

      const url = new URL(request.url);
      if (url.pathname === "/api/login" && request.method === "POST") return handleLogin(request, env);
      if (url.pathname === "/api/data" && request.method === "GET") return withAuth(request, env, () => handleGetData(env));
      if (url.pathname === "/api/data" && request.method === "PUT") return withAuth(request, env, () => handlePutData(request, env));
      if (url.pathname === "/api/health" && request.method === "GET") return json({ ok: true, version: "v1.0.0" });

      return json({ message: "Not found" }, 404);
    } catch (error) {
      return json({ message: error.message || "Server error" }, error.status || 500);
    }
  }
};

async function handleLogin(request, env) {
  assertEnv(env, ["APP_PASSWORD"]);
  const body = await safeJson(request);
  if (!body.password || body.password !== env.APP_PASSWORD) return json({ message: "Unauthorized" }, 401);
  const token = await createToken(env.APP_PASSWORD);
  return json({ token, expiresInDays: 7 });
}

async function withAuth(request, env, handler) {
  assertEnv(env, ["APP_PASSWORD"]);
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const ok = await verifyToken(token, env.APP_PASSWORD);
  if (!ok) return json({ message: "Unauthorized" }, 401);
  return handler();
}

async function handleGetData(env) {
  assertEnv(env, ["GH_TOKEN", "GH_OWNER", "GH_REPO", "GH_BRANCH", "DATA_PATH"]);
  const file = await getGitHubFile(env);
  return json({ data: file?.data || DEFAULT_DATA });
}

async function handlePutData(request, env) {
  assertEnv(env, ["GH_TOKEN", "GH_OWNER", "GH_REPO", "GH_BRANCH", "DATA_PATH"]);
  const body = await safeJson(request);
  if (!body || typeof body !== "object") return json({ message: "Invalid JSON" }, 400);
  if (!body.data || typeof body.data !== "object") return json({ message: "Missing data" }, 400);

  const current = await getGitHubFile(env);
  const currentData = current?.data || DEFAULT_DATA;
  const currentRevision = Number(currentData.revision || 0);
  const baseRevision = Number(body.baseRevision || 0);

  if (current && currentRevision !== baseRevision) {
    return json({
      message: "Revision conflict",
      currentRevision,
      baseRevision
    }, 409);
  }

  const nextData = sanitizeData(body.data);
  nextData.revision = currentRevision + 1;
  nextData.updatedAt = new Date().toISOString();
  nextData.appVersion = nextData.appVersion || "v1.0.0";
  nextData.schemaVersion = nextData.schemaVersion || 1;

  await putGitHubFile(env, nextData, current?.sha);
  return json({ data: nextData });
}

function sanitizeData(data) {
  const clean = JSON.parse(JSON.stringify(data));
  clean.settings = clean.settings || {};
  clean.trips = Array.isArray(clean.trips) ? clean.trips : [];
  clean.items = Array.isArray(clean.items) ? clean.items.map(item => ({
    id: String(item.id || crypto.randomUUID()),
    tripId: String(item.tripId || clean.settings.currentTripId || "default"),
    title: String(item.title || "").slice(0, 120),
    category: String(item.category || "other"),
    type: String(item.type || "carry"),
    status: String(item.status || "to_pack"),
    priority: String(item.priority || "optional"),
    quantity: Math.max(1, Number(item.quantity || 1)),
    note: String(item.note || "").slice(0, 1000),
    createdAt: String(item.createdAt || new Date().toISOString()),
    updatedAt: String(item.updatedAt || new Date().toISOString()),
    doneAt: item.doneAt ? String(item.doneAt) : null,
    deleted: Boolean(item.deleted)
  })) : [];
  return clean;
}

async function getGitHubFile(env) {
  const response = await fetch(githubContentsUrl(env, true), {
    method: "GET",
    headers: githubHeaders(env)
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new HttpError(`GitHub read failed: ${response.status}`, 502);

  const payload = await response.json();
  const data = JSON.parse(base64ToUtf8(payload.content || ""));
  return { data, sha: payload.sha };
}

async function putGitHubFile(env, data, sha) {
  const body = {
    message: `Update travel checklist data ${new Date().toISOString()}`,
    content: utf8ToBase64(JSON.stringify(data, null, 2)),
    branch: env.GH_BRANCH
  };
  if (sha) body.sha = sha;

  const response = await fetch(githubContentsUrl(env, false), {
    method: "PUT",
    headers: githubHeaders(env),
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new HttpError(`GitHub write failed: ${response.status} ${text}`, 502);
  }
}

function githubContentsUrl(env, includeRef) {
  const path = encodeURIComponent(env.DATA_PATH).replace(/%2F/g, "/");
  const base = `https://api.github.com/repos/${env.GH_OWNER}/${env.GH_REPO}/contents/${path}`;
  return includeRef ? `${base}?ref=${encodeURIComponent(env.GH_BRANCH)}` : base;
}

function githubHeaders(env) {
  return {
    "Authorization": `Bearer ${env.GH_TOKEN}`,
    "Accept": "application/vnd.github+json",
    "User-Agent": "travel-checklist-worker-v1.0.0",
    "Content-Type": "application/json"
  };
}

async function createToken(secret) {
  const payload = {
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
  };
  const payloadPart = base64UrlEncode(JSON.stringify(payload));
  const signature = await hmacSha256(secret, payloadPart);
  return `${payloadPart}.${signature}`;
}

async function verifyToken(token, secret) {
  if (!token || !token.includes(".")) return false;
  const [payloadPart, signature] = token.split(".");
  if (!payloadPart || !signature) return false;

  const expected = await hmacSha256(secret, payloadPart);
  if (!safeEqual(signature, expected)) return false;

  try {
    const payload = JSON.parse(base64UrlDecode(payloadPart));
    return Number(payload.exp || 0) > Math.floor(Date.now() / 1000);
  } catch (_) {
    return false;
  }
}

async function hmacSha256(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return bytesToBase64Url(new Uint8Array(signature));
}

function safeEqual(a, b) {
  const aa = new TextEncoder().encode(a);
  const bb = new TextEncoder().encode(b);
  if (aa.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < aa.length; i++) diff |= aa[i] ^ bb[i];
  return diff === 0;
}

function base64UrlEncode(str) {
  return bytesToBase64Url(new TextEncoder().encode(str));
}

function base64UrlDecode(str) {
  const normalized = str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4);
  return base64ToUtf8(normalized);
}

function bytesToBase64Url(bytes) {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function base64ToUtf8(str) {
  const binary = atob(String(str).replace(/\s/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function safeJson(request) {
  try {
    return await request.json();
  } catch (_) {
    return {};
  }
}

function assertEnv(env, names) {
  const missing = names.filter(name => !env[name]);
  if (missing.length) throw new HttpError(`Missing environment variables: ${missing.join(", ")}`, 500);
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

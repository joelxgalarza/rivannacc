/**
 * POST /api/survey
 *
 * Handled by the Worker in front of the static site (wrangler.jsonc routes
 * /api/* here first; everything else is served straight from the assets).
 * The survey page at /survey posts JSON here and
 * this handler forwards it to GoHighLevel, so the browser never talks to the
 * GHL domain directly and there is no CORS problem to work around.
 *
 * SETUP (Joel): paste the GHL Inbound Webhook URL between the quotes below.
 * In GHL it is Automation > Workflows > add an "Inbound Webhook" trigger, then
 * copy the URL it gives you (looks like
 * https://services.leadconnectorhq.com/hooks/.../webhook-trigger/...).
 *
 * Prefer not to keep it in the repo? Leave this empty and set the Worker
 * variable GHL_SURVEY_WEBHOOK_URL instead (Cloudflare dashboard >
 * Workers & Pages > rivannacc > Settings > Variables and Secrets). The environment
 * variable wins when both are set.
 */
const WEBHOOK_URL = "";

const MAX_TEXT = 2000;
const MAX_SHORT = 200;
const ALLOWED_METHODS = "POST";

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status: status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}

function clip(raw, max) {
  if (typeof raw !== "string") return "";
  return raw.trim().slice(0, max);
}

/** Collapse runs of whitespace so a name pasted from the CRM lands clean. */
function tidy(raw, max) {
  return clip(raw, max).replace(/\s+/g, " ");
}

/**
 * GHL maps First Name / Last Name separately, so split the typed name once
 * here rather than in a workflow step. Everything after the first space is
 * the last name, which is the right call for "Mary Beth Jones".
 */
function splitName(fullName) {
  const parts = fullName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first_name: "", last_name: "" };
  if (parts.length === 1) return { first_name: parts[0], last_name: "" };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}

async function handleSurvey(context) {
  let body;
  try {
    body = await context.request.json();
  } catch (e) {
    return json({ ok: false, error: "bad_json" }, 400);
  }

  if (!body || typeof body !== "object") {
    return json({ ok: false, error: "bad_json" }, 400);
  }

  // Honeypot: a real person never sees this input, so anything in it is a bot.
  // Answer 200 so the bot has nothing to learn, and forward nothing.
  if (clip(body.website, MAX_SHORT)) {
    return json({ ok: true }, 200);
  }

  const name = tidy(body.name, MAX_SHORT);
  const phone = tidy(body.phone, 40);

  if (!name || !phone) {
    return json({ ok: false, error: "missing_contact" }, 400);
  }

  const rating = typeof body.rating === "number" ? body.rating : parseInt(body.rating, 10);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return json({ ok: false, error: "bad_rating" }, 400);
  }

  const names = splitName(name);

  const forwarded = {
    name: name,
    full_name: name,
    first_name: names.first_name,
    last_name: names.last_name,
    phone: phone,
    rating: rating,
    did_well: clip(body.did_well, MAX_TEXT),
    could_improve: clip(body.could_improve, MAX_TEXT),
    cleaner: tidy(body.cleaner, MAX_SHORT),
    book_again: clip(body.book_again, MAX_SHORT),
    recurring: clip(body.recurring, MAX_SHORT),
    source: clip(body.source, MAX_SHORT) || "rivanna-survey",
    page_url: clip(body.page_url, MAX_TEXT),
    submitted_at: clip(body.submitted_at, 40) || new Date().toISOString()
  };

  const target = (context.env && context.env.GHL_SURVEY_WEBHOOK_URL) || WEBHOOK_URL;
  if (!target) {
    return json({ ok: false, error: "not_configured" }, 503);
  }

  let upstream;
  try {
    upstream = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(forwarded)
    });
  } catch (e) {
    return json({ ok: false, error: "upstream_unreachable" }, 502);
  }

  if (!upstream.ok) {
    return json({ ok: false, error: "upstream_error" }, 502);
  }

  return json({ ok: true }, 200);
}

function methodNotAllowed() {
  return new Response(JSON.stringify({ ok: false, error: "method_not_allowed" }), {
    status: 405,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Allow": ALLOWED_METHODS
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/survey" || url.pathname === "/api/survey/") {
      if (request.method !== "POST") return methodNotAllowed();
      return handleSurvey({ request: request, env: env });
    }
    if (url.pathname.startsWith("/api/")) {
      return new Response("Not found", { status: 404 });
    }
    return env.ASSETS.fetch(request);
  }
};

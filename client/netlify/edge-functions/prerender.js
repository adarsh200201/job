export default async (request, context) => {
  const userAgent = request.headers.get("user-agent") || "";
  const url = new URL(request.url);

  // Crawler/bot user agent detection regex
  const botRegex = /googlebot|bingbot|yandexbot|baiduspider|twitterbot|facebookexternalhit|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator|redditbot|Applebot|WhatsApp|flickrbot|discordbot|telegrambot/i;

  // Static asset extensions to ignore
  const excludeExtensions = [
    ".js", ".css", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico",
    ".xml", ".txt", ".json", ".webp", ".map", ".woff", ".woff2", ".ttf", ".eot"
  ];
  const hasExcludedExtension = excludeExtensions.some((ext) => url.pathname.toLowerCase().endsWith(ext));

  // Determine if it is a bot request
  const isBot = botRegex.test(userAgent) && !hasExcludedExtension;

  if (isBot) {
    // Read the token from Netlify's env variables
    const token = Deno.env.get("PRERENDER_TOKEN");
    if (!token) {
      console.warn("[Prerender Edge Function] PRERENDER_TOKEN environment variable is not defined.");
      return; // Fallback to serving standard index.html directly
    }

    // Call Prerender.io API to get pre-rendered HTML
    const prerenderUrl = `https://service.prerender.io/${url.toString()}`;
    const headers = new Headers(request.headers);
    headers.set("X-Prerender-Token", token);

    try {
      const res = await fetch(prerenderUrl, {
        method: request.method,
        headers,
        redirect: "manual"
      });

      // Clone response and override headers
      const responseHeaders = new Headers(res.headers);
      responseHeaders.set("X-Prerender-Served-By", "Netlify-Edge-Function");

      return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders
      });
    } catch (e) {
      console.error("[Prerender Edge Function] Failed to fetch from Prerender.io:", e);
      // Fallback to serving standard index.html
      return;
    }
  }

  // Returning undefined tells Netlify to continue to the next edge function or origin (default response)
  return;
};

export const config = {
  path: "/*",
  excludedPath: [
    "/sitemap.xml",
    "/robots.txt",
    "/api/*",
    "/uploads/*",
    "/assets/*",
    "/logo.png",
    "/app_mockup.png",
    "/googlebc759ed7720b94f2.html"
  ]
};

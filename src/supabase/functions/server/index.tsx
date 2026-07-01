import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

// ─── Environment Variable Helper ───
// Netlify Extension creates SUPABASE_DATABASE_URL, but we need SUPABASE_URL
function getSupabaseUrl(): string {
  return Deno.env.get('SUPABASE_URL') || Deno.env.get('SUPABASE_DATABASE_URL') || '';
}

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Platform", "X-User-Type", "X-User-Token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ─── Platform Detection Middleware ───
// Tags each request with platform info for analytics/routing
app.use('*', async (c, next) => {
  const platform = c.req.header('X-Platform') || 'unknown';
  const userType = c.req.header('X-User-Type') || 'unknown';
  c.set('platform' as any, platform);
  c.set('userType' as any, userType);
  console.log(`[Platform: ${platform}] [User: ${userType}] ${c.req.method} ${c.req.path}`);
  await next();
});

// ─── Helper: Authenticate user ───
// Polymorphic: accepts Hono context `c` OR a raw Authorization header string.
// When given context, prefers X-User-Token header (fresh token sent alongside
// anon-key gateway auth) over Authorization Bearer.
async function authUser(input: any) {
  let token: string | null = null;

  if (typeof input === 'string' || input === undefined || input === null) {
    // Legacy path: called with authHeader string, e.g. authUser(c.req.header('Authorization'))
    const authHeader = input as string | undefined;
    token = authHeader ? authHeader.split(' ')[1] : null;
  } else if (input?.req?.header) {
    // New path: called with Hono context, e.g. authUser(c)
    const userToken = input.req.header('X-User-Token');
    const authHeader = input.req.header('Authorization');
    token = userToken || (authHeader ? authHeader.split(' ')[1] : null);
  }

  if (!token) return { user: null, error: 'No auth token provided' };

  // Reject if token is the anon key (gateway passthrough, not a user token)
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  if (token === anonKey) return { user: null, error: 'Anon key received — send access_token via X-User-Token' };

  // Verify with service-role client (works even for expired JWTs that gateway might reject)
  const supabase = createClient(
    getSupabaseUrl(),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return { user: null, error: error?.message || 'Unauthorized' };
  return { user, error: null };
}

// ─── Helper: Service Role Supabase Client ───
function adminClient() {
  return createClient(
    getSupabaseUrl(),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
}

// ─── Initialize Storage Bucket for Avatars ───
const AVATAR_BUCKET = 'make-ad34c09a-avatars';

async function initStorage() {
  try {
    const supabase = adminClient();
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket: any) => bucket.name === AVATAR_BUCKET);
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(AVATAR_BUCKET, {
        public: true, // Avatars should be publicly accessible
      });
      if (error) console.log(`Bucket creation note: ${error.message}`);
      else console.log(`Storage bucket '${AVATAR_BUCKET}' created successfully`);
    } else {
      console.log(`Storage bucket '${AVATAR_BUCKET}' already exists`);
    }
  } catch (e: any) {
    console.log(`Storage init note: ${e.message}`);
  }
}
initStorage();

// ───────────────────────────────────────────────
// Health check
// ───────────────────────────────────────────────
app.get("/make-server-ad34c09a/health", (c) => {
  return c.json({ status: "ok" });
});

// ───────────────────────────────────────────────
// Sitemap XML — لمحركات البحث
// ───────────────────────────────────────────────
app.get("/make-server-ad34c09a/sitemap.xml", (c) => {
  const DOMAIN = "https://app.bietalreef.ae";

  const SEO_SLUGS = [
    "contractors-in-uae","interior-design-uae","marble-suppliers-uae",
    "electrical-contractors-uae","villa-renovation-uae","building-materials-uae",
    "maintenance-services-uae","craftsmen-uae","cleaning-services-uae",
    "equipment-rental-uae","furniture-decor-uae",
  ];

  const CITIES = [
    "dubai","abu-dhabi","sharjah","ajman",
    "ras-al-khaimah","umm-al-quwain","fujairah","al-ain",
  ];

  const SERVICES = [
    "construction-contracting","engineering-consultation","maintenance-companies",
    "craftsmen","workshops","equipment-rental","building-materials",
    "furniture-stores","cleaning-services",
  ];

  const PLATFORM_PAGES = [
    "/seo/marketplace","/seo/store","/seo/dashboards","/seo/platform","/seo/tools",
  ];

  const LEGAL_PAGES = ["/privacy","/terms","/about","/sitemap","/webp","/press"];

  const now = new Date().toISOString().split("T")[0];

  function urlEntry(loc: string, priority: string, changefreq: string) {
    return `  <url>\n    <loc>${DOMAIN}${loc}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  }

  const urls: string[] = [
    urlEntry("/", "1.0", "daily"),
    ...SEO_SLUGS.map((s) => urlEntry(`/${s}`, "0.9", "weekly")),
    ...CITIES.map((c) => urlEntry(`/map/${c}`, "0.8", "weekly")),
    ...CITIES.flatMap((c) => SERVICES.map((s) => urlEntry(`/map/${c}/${s}`, "0.7", "weekly"))),
    ...PLATFORM_PAGES.map((p) => urlEntry(p, "0.6", "monthly")),
    ...LEGAL_PAGES.map((p) => urlEntry(p, "0.5", "monthly")),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n${urls.join("\n")}\n</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
});

// ───────────────────────────────────────────────
// Robots.txt — توجيهات محركات البحث
// ───────────────────────────────────────────────
app.get("/make-server-ad34c09a/robots.txt", (c) => {
  const DOMAIN = "https://app.bietalreef.ae";
  const txt = [
    "User-agent: *",
    "Allow: /",
    "Allow: /contractors-in-uae",
    "Allow: /interior-design-uae",
    "Allow: /marble-suppliers-uae",
    "Allow: /electrical-contractors-uae",
    "Allow: /villa-renovation-uae",
    "Allow: /building-materials-uae",
    "Allow: /maintenance-services-uae",
    "Allow: /craftsmen-uae",
    "Allow: /cleaning-services-uae",
    "Allow: /equipment-rental-uae",
    "Allow: /furniture-decor-uae",
    "Allow: /map/",
    "Allow: /provider/",
    "Allow: /product/",
    "Allow: /seo/",
    "Allow: /privacy",
    "Allow: /terms",
    "Allow: /about",
    "Allow: /sitemap",
    "Allow: /webp",
    "",
    "Disallow: /home",
    "Disallow: /services",
    "Disallow: /shop",
    "Disallow: /store",
    "Disallow: /maps",
    "Disallow: /marketplace",
    "Disallow: /recommendations",
    "Disallow: /offers",
    "Disallow: /tools",
    "Disallow: /dashboard",
    "Disallow: /profile",
    "Disallow: /wallet",
    "Disallow: /messages",
    "Disallow: /notifications",
    "Disallow: /subscriptions",
    "Disallow: /projects",
    "Disallow: /rfq",
    "Disallow: /admin",
    "Disallow: /workspace",
    "Disallow: /design",
    "Disallow: /ats",
    "Disallow: /wayak-computer",
    "Disallow: /connectors",
    "Disallow: /app-profile/",
    "",
    `Sitemap: ${DOMAIN}/sitemap.xml`,
  ].join("\n");

  return new Response(txt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
});

// ───────────────────────────────────────────────
// Google Maps Config (returns API key for frontend)
// ───────────────────────────────────────────────
app.get("/make-server-ad34c09a/maps/config", (c) => {
  const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY') || Deno.env.get('VITE_GOOGLE_MAPS_API_KEY') || '';
  if (!apiKey) {
    console.log("Google Maps API key not configured");
    return c.json({ error: 'Google Maps API key not configured', apiKey: '' }, 200);
  }
  return c.json({ apiKey });
});

// ═══════════════════════════════════════════════════════════════
// ████████████  NOTIFICATIONS SYSTEM  ████████████████████████████
// ═══════════════════════════════════════════════════════════════

// ─── Helper: Create a notification for a user ───
async function createNotification(userId: string, notification: {
  category: 'platform' | 'weyaak' | 'other';
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  icon: string;
  actionTarget?: string;
}) {
  const id = `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const entry = {
    id,
    ...notification,
    read: false,
    created_at: new Date().toISOString(),
  };
  await kv.set(`notifications:${userId}:${id}`, entry);
  console.log(`Notification created for user ${userId}: ${notification.titleAr}`);
  return entry;
}

// ─── Helper: Send welcome notifications on registration ───
async function sendWelcomeNotifications(userId: string, userName: string) {
  const notifications = [
    {
      category: 'platform' as const,
      titleAr: `أهلاً ${userName || 'بك'} في بيت الريف!`,
      titleEn: `Welcome ${userName || ''} to Beit Al Reef!`,
      messageAr: 'نورتنا! حسابك جاهز. استكشف خدمات البناء والتشطيب، أو استخدم أدواتنا الذكية مجاناً.',
      messageEn: 'Your account is ready. Explore construction & finishing services, or use our smart tools for free.',
      icon: 'home',
    },
    {
      category: 'platform' as const,
      titleAr: 'محفظة الدار مفعّلة',
      titleEn: 'Wallet Activated',
      messageAr: 'تم تفعيل محفظتك الذكية. اشحن كوينز واستخدمها في الأدوات الذكية والخدمات المميزة.',
      messageEn: 'Your smart wallet is activated. Top up coins and use them on smart tools and premium services.',
      icon: 'wallet',
    },
    {
      category: 'weyaak' as const,
      titleAr: 'وياك — مساعدك الذكي جاهز',
      titleEn: 'Weyaak — Your AI Assistant is Ready',
      messageAr: 'اسألني عن تكاليف البناء، أفضل المقاولين، أو أي استفسار عن التشطيب. أنا هنا دائماً!',
      messageEn: 'Ask me about construction costs, best contractors, or any finishing query. I\'m always here!',
      icon: 'bot',
    },
  ];

  for (const notif of notifications) {
    await createNotification(userId, notif);
  }
  console.log(`Welcome notifications sent to user ${userId}`);
}

// ─── GET /notifications — Fetch user notifications ───
app.get("/make-server-ad34c09a/notifications", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error fetching notifications: ${authError}` }, 401);

    const entries = await kv.getByPrefix(`notifications:${user.id}:`);
    const sorted = (entries || []).sort((a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return c.json({ notifications: sorted });
  } catch (e: any) {
    console.log("Notifications fetch error:", e.message);
    return c.json({ error: `Notifications fetch error: ${e.message}` }, 500);
  }
});

// ─── POST /notifications/read — Mark single as read ───
app.post("/make-server-ad34c09a/notifications/read", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error: ${authError}` }, 401);

    const { id } = await c.req.json();
    if (!id) return c.json({ error: 'Missing notification id' }, 400);

    const key = `notifications:${user.id}:${id}`;
    const notif: any = await kv.get(key);
    if (notif) {
      notif.read = true;
      await kv.set(key, notif);
    }

    return c.json({ success: true });
  } catch (e: any) {
    console.log("Notification read error:", e.message);
    return c.json({ error: `Notification read error: ${e.message}` }, 500);
  }
});

// ─── POST /notifications/read-all — Mark all as read ───
app.post("/make-server-ad34c09a/notifications/read-all", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error: ${authError}` }, 401);

    const entries = await kv.getByPrefix(`notifications:${user.id}:`);
    for (const entry of (entries || [])) {
      const e = entry as any;
      if (!e.read) {
        e.read = true;
        await kv.set(`notifications:${user.id}:${e.id}`, e);
      }
    }

    return c.json({ success: true });
  } catch (e: any) {
    console.log("Notification read-all error:", e.message);
    return c.json({ error: `Notification read-all error: ${e.message}` }, 500);
  }
});

// ─── DELETE /notifications/:id — Delete one ───
app.delete("/make-server-ad34c09a/notifications/:id", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error: ${authError}` }, 401);

    const id = c.req.param('id');
    await kv.del(`notifications:${user.id}:${id}`);

    return c.json({ success: true });
  } catch (e: any) {
    console.log("Notification delete error:", e.message);
    return c.json({ error: `Notification delete error: ${e.message}` }, 500);
  }
});

// ─── DELETE /notifications — Clear all ───
app.delete("/make-server-ad34c09a/notifications", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error: ${authError}` }, 401);

    const entries = await kv.getByPrefix(`notifications:${user.id}:`);
    for (const entry of (entries || [])) {
      await kv.del(`notifications:${user.id}:${(entry as any).id}`);
    }

    return c.json({ success: true });
  } catch (e: any) {
    console.log("Notification clear-all error:", e.message);
    return c.json({ error: `Notification clear-all error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// SIGN UP (Admin)
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const supabase = adminClient();
    
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const existingUser = users.find((u: any) => u.email === email);

    if (existingUser) {
       const { data, error } = await supabase.auth.admin.updateUserById(
         existingUser.id, 
         { password: password, user_metadata: { name }, email_confirm: true }
       );
       
       if (error) {
         console.log("Update User Error:", error);
         return c.json({ error: error.message }, 400);
       }

       // Ensure wallet exists for existing user
       const wallet = await kv.get(`wallet:${existingUser.id}`);
       if (!wallet) {
         await kv.set(`wallet:${existingUser.id}`, { balance: 0, updated_at: new Date().toISOString() });
       }

       // Send welcome notifications if not already sent
       const existingNotifs = await kv.getByPrefix(`notifications:${existingUser.id}:`);
       if (!existingNotifs || existingNotifs.length === 0) {
         await sendWelcomeNotifications(existingUser.id, name || email.split('@')[0]);
       }

       return c.json({ data });
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true
    });

    if (error) {
      console.log("Signup Error:", error);
      return c.json({ error: error.message }, 400);
    }

    // Create wallet + send welcome notifications for new user
    if (data?.user?.id) {
      await kv.set(`wallet:${data.user.id}`, { balance: 0, updated_at: new Date().toISOString() });
      console.log(`Wallet created for user ${data.user.id}`);
      
      // Send welcome notifications immediately
      await sendWelcomeNotifications(data.user.id, name || email.split('@')[0]);
    }

    return c.json({ data });
  } catch (e: any) {
    console.log("Signup Exception:", e);
    return c.json({ error: e.message }, 500);
  }
});

// ───────────────────────────────────────────────
// PROFILE (Protected)
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/profile", async (c) => {
    try {
        const { user, error: authError } = await authUser(c);
        if (!user) return c.json({ error: `Auth error while saving profile: ${authError}` }, 401);

        const body = await c.req.json();
        await kv.set(`profile:${user.id}`, body);
        
        return c.json({ success: true });
    } catch (e: any) {
        console.log("Profile save error:", e.message);
        return c.json({ error: `Profile save error: ${e.message}` }, 500);
    }
});

app.get("/make-server-ad34c09a/profile", async (c) => {
    try {
        const { user, error: authError } = await authUser(c);
        if (!user) return c.json({ error: `Auth error while fetching profile: ${authError}` }, 401);

        const profile = await kv.get(`profile:${user.id}`);
        return c.json(profile || {});
    } catch (e: any) {
        console.log("Profile fetch error:", e.message);
        return c.json({ error: `Profile fetch error: ${e.message}` }, 500);
    }
});

// ───────────────────────────────────────────────
// WALLET - Get Balance
// ───────────────────────────────────────────────
app.get("/make-server-ad34c09a/wallet/balance", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error while fetching wallet balance: ${authError}` }, 401);

    let wallet = await kv.get(`wallet:${user.id}`);
    
    // Auto-create wallet if it doesn't exist
    if (!wallet) {
      wallet = { balance: 0, updated_at: new Date().toISOString() };
      await kv.set(`wallet:${user.id}`, wallet);
      console.log(`Auto-created wallet for user ${user.id}`);
    }

    return c.json({ balance: wallet.balance, updated_at: wallet.updated_at });
  } catch (e: any) {
    console.log("Wallet balance error:", e.message);
    return c.json({ error: `Wallet balance error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// WALLET - Spend Coins (Protected server-side only)
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/wallet/spend", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error while spending coins: ${authError}` }, 401);

    const { amount, reason } = await c.req.json();
    
    if (!amount || amount <= 0) {
      return c.json({ error: 'Invalid amount: must be a positive integer' }, 400);
    }

    // Get current balance
    let wallet = await kv.get(`wallet:${user.id}`);
    if (!wallet) {
      wallet = { balance: 0, updated_at: new Date().toISOString() };
    }

    // Check sufficient balance
    if (wallet.balance < amount) {
      return c.json({ 
        error: 'رصيد غير كافٍ', 
        errorCode: 'INSUFFICIENT_BALANCE',
        currentBalance: wallet.balance, 
        required: amount 
      }, 400);
    }

    // Deduct balance
    const newBalance = wallet.balance - amount;
    const now = new Date().toISOString();
    
    await kv.set(`wallet:${user.id}`, { balance: newBalance, updated_at: now });

    // Log to ledger
    const ledgerEntry = {
      type: 'spend',
      amount: -amount,
      reason: reason || 'استخدام أداة',
      created_at: now,
      user_id: user.id,
    };
    await kv.set(`wallet_ledger:${user.id}:${Date.now()}`, ledgerEntry);

    console.log(`User ${user.id} spent ${amount} coins. New balance: ${newBalance}. Reason: ${reason}`);

    return c.json({ 
      success: true, 
      balance: newBalance, 
      entry: ledgerEntry 
    });
  } catch (e: any) {
    console.log("Wallet spend error:", e.message);
    return c.json({ error: `Wallet spend error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// WALLET - Top Up / Add Coins
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/wallet/topup", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error while topping up wallet: ${authError}` }, 401);

    const { amount, reason, type } = await c.req.json();
    
    if (!amount || amount <= 0) {
      return c.json({ error: 'Invalid amount: must be a positive integer' }, 400);
    }

    // Get current balance
    let wallet = await kv.get(`wallet:${user.id}`);
    if (!wallet) {
      wallet = { balance: 0, updated_at: new Date().toISOString() };
    }

    // Add balance
    const newBalance = wallet.balance + amount;
    const now = new Date().toISOString();
    
    await kv.set(`wallet:${user.id}`, { balance: newBalance, updated_at: now });

    // Log to ledger
    const ledgerEntry = {
      type: type || 'earn',
      amount: amount,
      reason: reason || 'شحن رصيد',
      created_at: now,
      user_id: user.id,
    };
    await kv.set(`wallet_ledger:${user.id}:${Date.now()}`, ledgerEntry);

    console.log(`User ${user.id} topped up ${amount} coins. New balance: ${newBalance}. Reason: ${reason}`);

    return c.json({ 
      success: true, 
      balance: newBalance, 
      entry: ledgerEntry 
    });
  } catch (e: any) {
    console.log("Wallet topup error:", e.message);
    return c.json({ error: `Wallet topup error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// WALLET - Get Ledger (Transaction History)
// ───────────────────────────────────────────────
app.get("/make-server-ad34c09a/wallet/ledger", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error while fetching wallet ledger: ${authError}` }, 401);

    const entries = await kv.getByPrefix(`wallet_ledger:${user.id}:`);
    
    // Sort by created_at descending (newest first)
    const sorted = (entries || []).sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return c.json({ entries: sorted });
  } catch (e: any) {
    console.log("Wallet ledger error:", e.message);
    return c.json({ error: `Wallet ledger error: ${e.message}` }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════
// ████████████  PROVIDER CARDS (Google Maps Integration)  ████████
// ═══════════════════════════════════════════════════════════════

// ─── POST /provider-card — Save/update provider's map card ───
app.post("/make-server-ad34c09a/provider-card", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error saving provider card: ${authError}` }, 401);

    const body = await c.req.json();
    const cardData = {
      id: user.id,
      ...body,
      updated_at: new Date().toISOString(),
    };
    await kv.set(`provider_card:${user.id}`, cardData);
    // Also index by display_id for easy lookup
    if (body.display_id) {
      await kv.set(`provider_card_by_id:${body.display_id}`, user.id);
    }
    console.log(`Provider card saved for user ${user.id}`);
    return c.json({ success: true, card: cardData });
  } catch (e: any) {
    console.log("Provider card save error:", e.message);
    return c.json({ error: `Provider card save error: ${e.message}` }, 500);
  }
});

// ─── GET /provider-card — Fetch own provider card ───
app.get("/make-server-ad34c09a/provider-card", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error fetching provider card: ${authError}` }, 401);

    const card = await kv.get(`provider_card:${user.id}`);
    return c.json({ card: card || null });
  } catch (e: any) {
    console.log("Provider card fetch error:", e.message);
    return c.json({ error: `Provider card fetch error: ${e.message}` }, 500);
  }
});

// ─── GET /providers/search?q=... — Search providers (for YAK agent) ───
app.get("/make-server-ad34c09a/providers/search", async (c) => {
  try {
    const query = (c.req.query('q') || '').toLowerCase().trim();
    const all = await kv.getByPrefix('provider_card:');
    const providers = (all || []) as any[];

    if (!query) {
      return c.json({ providers: providers.slice(0, 10) });
    }

    const filtered = providers.filter((p: any) => {
      const searchable = [
        p.name, p.business_name, p.category,
        p.city, p.emirate,
        ...(p.specialties || []),
      ].join(' ').toLowerCase();
      return query.split(' ').some(word => searchable.includes(word));
    });

    return c.json({ providers: filtered.slice(0, 5) });
  } catch (e: any) {
    console.log("Provider search error:", e.message);
    return c.json({ error: `Provider search error: ${e.message}` }, 500);
  }
});

// ─── GET /providers/all — List all provider cards (for maps) ───
app.get("/make-server-ad34c09a/providers/all", async (c) => {
  try {
    const all = await kv.getByPrefix('provider_card:');
    return c.json({ providers: (all || []).slice(0, 50) });
  } catch (e: any) {
    console.log("Providers list error:", e.message);
    return c.json({ error: `Providers list error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// AVATAR - Upload Profile Picture
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/avatar/upload", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error while uploading avatar: ${authError}` }, 401);

    const formData = await c.req.formData();
    const file = formData.get('avatar');
    
    if (!file || !(file instanceof File)) {
      return c.json({ error: 'No file provided. Send a file with key "avatar"' }, 400);
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return c.json({ error: 'File must be an image (jpg, png, webp)' }, 400);
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return c.json({ error: 'File too large. Maximum 5MB' }, 400);
    }

    const supabase = adminClient();
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `${user.id}/avatar.${ext}`;

    // Upload to storage (upsert to replace old avatar)
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.log("Avatar upload error:", uploadError);
      return c.json({ error: `Upload error: ${uploadError.message}` }, 500);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(AVATAR_BUCKET)
      .getPublicUrl(filePath);

    const avatarUrl = urlData.publicUrl;

    // Also save in KV profile
    const existingProfile = await kv.get(`profile:${user.id}`) || {};
    await kv.set(`profile:${user.id}`, { ...existingProfile, avatar_url: avatarUrl });

    // Update auth user metadata
    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: { avatar_url: avatarUrl }
    });

    console.log(`Avatar uploaded for user ${user.id}: ${avatarUrl}`);

    return c.json({ 
      success: true, 
      avatar_url: avatarUrl 
    });
  } catch (e: any) {
    console.log("Avatar upload exception:", e.message);
    return c.json({ error: `Avatar upload exception: ${e.message}` }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════
// ████████  TikTok Content Publishing API Integration  ████████
// ═══════════════════════════════════════════════════════════════

const TIKTOK_API_BASE = 'https://open.tiktokapis.com/v2';

function getTikTokClientKey() {
  return Deno.env.get('TIKTOK_CLIENT_KEY') || '';
}
function getTikTokClientSecret() {
  return Deno.env.get('TIKTOK_CLIENT_SECRET') || '';
}

// ─── TikTok OAuth Callback (Server-side) ───
// TikTok redirects here after user authorizes.
// The server exchanges the code for an access token and stores it.
app.get("/make-server-ad34c09a/tiktok/callback", async (c) => {
  try {
    const code = c.req.query('code');
    const state = c.req.query('state'); // contains userId
    const errorParam = c.req.query('error');

    if (errorParam) {
      console.log(`TikTok OAuth error: ${errorParam} - ${c.req.query('error_description')}`);
      return c.html(`
        <html><body><script>
          window.opener && window.opener.postMessage({ type: 'tiktok_auth', success: false, error: '${errorParam}' }, '*');
          window.close();
        </script><p>خطأ في الربط. يمكنك إغلاق هذه النافذ.</p></body></html>
      `);
    }

    if (!code || !state) {
      return c.html(`
        <html><body><script>
          window.opener && window.opener.postMessage({ type: 'tiktok_auth', success: false, error: 'missing_params' }, '*');
          window.close();
        </script><p>بيانات ناقصة. يمكنك إغلاق هذه النافذة.</p></body></html>
      `);
    }

    // Parse state to get userId
    let userId = '';
    try {
      const stateData = JSON.parse(decodeURIComponent(state));
      userId = stateData.userId || '';
    } catch {
      userId = state;
    }

    // Exchange code for access token
    const redirectUri = `${getSupabaseUrl()}/functions/v1/make-server-ad34c09a/tiktok/callback`;

    const tokenRes = await fetch(`${TIKTOK_API_BASE}/oauth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: getTikTokClientKey(),
        client_secret: getTikTokClientSecret(),
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();
    console.log('TikTok token exchange response:', JSON.stringify(tokenData));

    if (tokenData.error || !tokenData.access_token) {
      const errMsg = tokenData.error_description || tokenData.error || 'token_exchange_failed';
      console.log(`TikTok token exchange failed: ${errMsg}`);
      return c.html(`
        <html><body><script>
          window.opener && window.opener.postMessage({ type: 'tiktok_auth', success: false, error: '${errMsg}' }, '*');
          window.close();
        </script><p>فشل في الحصول على الصلاحيات. يمكنك إغلاق هذه النافذة.</p></body></html>
      `);
    }

    // Store tokens in KV (keyed by userId)
    const tokenRecord = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token || '',
      open_id: tokenData.open_id || '',
      expires_in: tokenData.expires_in || 86400,
      refresh_expires_in: tokenData.refresh_expires_in || 0,
      scope: tokenData.scope || '',
      token_type: tokenData.token_type || 'Bearer',
      created_at: new Date().toISOString(),
    };

    if (userId) {
      await kv.set(`tiktok_token:${userId}`, tokenRecord);
      console.log(`TikTok token stored for user ${userId}, open_id: ${tokenRecord.open_id}`);
    }

    // Return HTML that notifies parent window and closes
    return c.html(`
      <html>
      <head><meta charset="utf-8"><title>تم الربط بنجاح</title></head>
      <body style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:Cairo,sans-serif;direction:rtl;background:#f0fdf4;">
        <div style="text-align:center;padding:2rem;">
          <div style="font-size:4rem;margin-bottom:1rem;">✅</div>
          <h2 style="color:#15803d;">تم ربط تيك توك بنجاح!</h2>
          <p style="color:#666;">سيتم إغلاق هذه النافذة تلقائياً...</p>
        </div>
        <script>
          window.opener && window.opener.postMessage({
            type: 'tiktok_auth',
            success: true,
            open_id: '${tokenRecord.open_id}',
            username: '${tokenData.open_id || ''}'
          }, '*');
          setTimeout(() => window.close(), 2000);
        </script>
      </body>
      </html>
    `);
  } catch (e: any) {
    console.log("TikTok callback exception:", e.message);
    return c.html(`
      <html><body><script>
        window.opener && window.opener.postMessage({ type: 'tiktok_auth', success: false, error: 'server_error' }, '*');
        window.close();
      </script><p>خطأ في السيرفر. يمكنك إغلاق هذه النافذة.</p></body></html>
    `);
  }
});

// ─── TikTok: Refresh Access Token ───
app.post("/make-server-ad34c09a/tiktok/auth/refresh", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error refreshing TikTok token: ${authError}` }, 401);

    const tokenRecord: any = await kv.get(`tiktok_token:${user.id}`);
    if (!tokenRecord || !tokenRecord.refresh_token) {
      return c.json({ error: 'No TikTok refresh token found. Please reconnect.' }, 400);
    }

    const res = await fetch(`${TIKTOK_API_BASE}/oauth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: getTikTokClientKey(),
        client_secret: getTikTokClientSecret(),
        grant_type: 'refresh_token',
        refresh_token: tokenRecord.refresh_token,
      }),
    });

    const data = await res.json();
    if (data.error || !data.access_token) {
      return c.json({ error: `TikTok refresh failed: ${data.error_description || data.error}` }, 400);
    }

    const updated = {
      ...tokenRecord,
      access_token: data.access_token,
      refresh_token: data.refresh_token || tokenRecord.refresh_token,
      open_id: data.open_id || tokenRecord.open_id,
      expires_in: data.expires_in || 86400,
      created_at: new Date().toISOString(),
    };
    await kv.set(`tiktok_token:${user.id}`, updated);

    return c.json({ success: true, expires_in: updated.expires_in });
  } catch (e: any) {
    console.log("TikTok refresh error:", e.message);
    return c.json({ error: `TikTok refresh error: ${e.message}` }, 500);
  }
});

// ─── TikTok: Get Connection Status ───
app.get("/make-server-ad34c09a/tiktok/status", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error checking TikTok status: ${authError}` }, 401);

    const tokenRecord: any = await kv.get(`tiktok_token:${user.id}`);
    if (!tokenRecord || !tokenRecord.access_token) {
      return c.json({ connected: false });
    }

    // Check if token is expired
    const createdAt = new Date(tokenRecord.created_at).getTime();
    const expiresIn = (tokenRecord.expires_in || 86400) * 1000;
    const isExpired = Date.now() > createdAt + expiresIn;

    return c.json({
      connected: true,
      open_id: tokenRecord.open_id,
      scope: tokenRecord.scope,
      is_expired: isExpired,
      created_at: tokenRecord.created_at,
    });
  } catch (e: any) {
    console.log("TikTok status error:", e.message);
    return c.json({ error: `TikTok status error: ${e.message}` }, 500);
  }
});

// ─── TikTok: Disconnect (Remove Token) ───
app.delete("/make-server-ad34c09a/tiktok/disconnect", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error disconnecting TikTok: ${authError}` }, 401);

    await kv.del(`tiktok_token:${user.id}`);
    console.log(`TikTok disconnected for user ${user.id}`);

    return c.json({ success: true });
  } catch (e: any) {
    console.log("TikTok disconnect error:", e.message);
    return c.json({ error: `TikTok disconnect error: ${e.message}` }, 500);
  }
});

// ─── TikTok: Query Creator Info ───
app.post("/make-server-ad34c09a/tiktok/creator-info", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error fetching TikTok creator info: ${authError}` }, 401);

    const tokenRecord: any = await kv.get(`tiktok_token:${user.id}`);
    if (!tokenRecord || !tokenRecord.access_token) {
      return c.json({ error: 'TikTok not connected. Please connect first.' }, 400);
    }

    const res = await fetch(`${TIKTOK_API_BASE}/post/publish/creator_info/query/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenRecord.access_token}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });

    const data = await res.json();
    console.log('TikTok creator info response:', JSON.stringify(data));

    if (data.error?.code !== 'ok') {
      return c.json({ error: `TikTok creator info error: ${data.error?.message || 'unknown'}`, raw: data }, 400);
    }

    return c.json({ success: true, data: data.data });
  } catch (e: any) {
    console.log("TikTok creator info error:", e.message);
    return c.json({ error: `TikTok creator info error: ${e.message}` }, 500);
  }
});

// ─── TikTok: Publish Video (Direct Post) ───
app.post("/make-server-ad34c09a/tiktok/publish/video", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error publishing TikTok video: ${authError}` }, 401);

    const tokenRecord: any = await kv.get(`tiktok_token:${user.id}`);
    if (!tokenRecord || !tokenRecord.access_token) {
      return c.json({ error: 'TikTok not connected. Please connect first.' }, 400);
    }

    const body = await c.req.json();
    const {
      title = '',
      privacy_level = 'SELF_ONLY',
      disable_duet = false,
      disable_comment = false,
      disable_stitch = false,
      video_cover_timestamp_ms = 1000,
      video_url,
    } = body;

    // Build the publish request body (PULL_FROM_URL)
    const publishBody: any = {
      post_info: {
        title,
        privacy_level,
        disable_duet,
        disable_comment,
        disable_stitch,
        video_cover_timestamp_ms,
      },
      source_info: {
        source: 'PULL_FROM_URL',
        video_url,
      },
    };

    const res = await fetch(`${TIKTOK_API_BASE}/post/publish/video/init/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenRecord.access_token}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(publishBody),
    });

    const data = await res.json();
    console.log('TikTok publish video response:', JSON.stringify(data));

    if (data.error?.code !== 'ok') {
      return c.json({ error: `TikTok publish video error: ${data.error?.message || 'unknown'}`, raw: data }, 400);
    }

    return c.json({ success: true, publish_id: data.data?.publish_id });
  } catch (e: any) {
    console.log("TikTok publish video error:", e.message);
    return c.json({ error: `TikTok publish video error: ${e.message}` }, 500);
  }
});

// ─── TikTok: Publish Photo (Direct Post) ───
app.post("/make-server-ad34c09a/tiktok/publish/photo", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error publishing TikTok photo: ${authError}` }, 401);

    const tokenRecord: any = await kv.get(`tiktok_token:${user.id}`);
    if (!tokenRecord || !tokenRecord.access_token) {
      return c.json({ error: 'TikTok not connected. Please connect first.' }, 400);
    }

    const body = await c.req.json();
    const {
      title = '',
      description = '',
      privacy_level = 'SELF_ONLY',
      disable_comment = false,
      auto_add_music = true,
      photo_cover_index = 0,
      photo_images = [],
    } = body;

    const publishBody = {
      post_info: {
        title,
        description,
        disable_comment,
        privacy_level,
        auto_add_music,
      },
      source_info: {
        source: 'PULL_FROM_URL',
        photo_cover_index,
        photo_images,
      },
      post_mode: 'DIRECT_POST',
      media_type: 'PHOTO',
    };

    const res = await fetch(`${TIKTOK_API_BASE}/post/publish/content/init/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenRecord.access_token}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(publishBody),
    });

    const data = await res.json();
    console.log('TikTok publish photo response:', JSON.stringify(data));

    if (data.error?.code !== 'ok') {
      return c.json({ error: `TikTok publish photo error: ${data.error?.message || 'unknown'}`, raw: data }, 400);
    }

    return c.json({ success: true, publish_id: data.data?.publish_id });
  } catch (e: any) {
    console.log("TikTok publish photo error:", e.message);
    return c.json({ error: `TikTok publish photo error: ${e.message}` }, 500);
  }
});

// ─── TikTok: Check Publish Status ───
app.post("/make-server-ad34c09a/tiktok/publish/status", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error checking TikTok publish status: ${authError}` }, 401);

    const tokenRecord: any = await kv.get(`tiktok_token:${user.id}`);
    if (!tokenRecord || !tokenRecord.access_token) {
      return c.json({ error: 'TikTok not connected. Please connect first.' }, 400);
    }

    const { publish_id } = await c.req.json();
    if (!publish_id) return c.json({ error: 'publish_id is required' }, 400);

    const res = await fetch(`${TIKTOK_API_BASE}/post/publish/status/fetch/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenRecord.access_token}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ publish_id }),
    });

    const data = await res.json();
    console.log('TikTok publish status response:', JSON.stringify(data));

    return c.json({ success: true, data: data.data, error_info: data.error });
  } catch (e: any) {
    console.log("TikTok publish status error:", e.message);
    return c.json({ error: `TikTok publish status error: ${e.message}` }, 500);
  }
});

// ─── TikTok: Get OAuth URL (for frontend) ───
app.get("/make-server-ad34c09a/tiktok/auth-url", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error generating TikTok auth URL: ${authError}` }, 401);

    const clientKey = getTikTokClientKey();
    if (!clientKey) {
      return c.json({ error: 'TikTok Client Key not configured. Please add TIKTOK_CLIENT_KEY.' }, 500);
    }

    const redirectUri = `${getSupabaseUrl()}/functions/v1/make-server-ad34c09a/tiktok/callback`;
    const scope = 'user.info.basic,video.publish';
    const state = encodeURIComponent(JSON.stringify({ userId: user.id, ts: Date.now() }));

    const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code&state=${state}`;

    return c.json({
      auth_url: authUrl,
      redirect_uri: redirectUri,
      note: 'Make sure this redirect_uri is registered in your TikTok Developer Portal app settings.',
    });
  } catch (e: any) {
    console.log("TikTok auth URL error:", e.message);
    return c.json({ error: `TikTok auth URL error: ${e.message}` }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════
// ████████████  ADMIN DASHBOARD API  ████████████████████████████
// ═══════════════════════════════════════════════════════════════

// ─── Helper: Check if user is admin via KV Store (primary) + user_roles (fallback) ───
async function isAdmin(userId: string): Promise<boolean> {
  try {
    // 1. Primary: Check KV Store (guaranteed to work)
    const kvKey = `admin::${userId}`;
    const kvVal = await kv.get(kvKey);
    if (kvVal === 'true' || kvVal === true) {
      return true;
    }

    // 2. Fallback: Check user_roles table (may not exist)
    try {
      const supabase = adminClient();
      const { data, error } = await supabase
        .from('user_roles')
        .select('role_id, roles!inner(key)')
        .eq('user_id', userId)
        .eq('roles.key', 'admin')
        .maybeSingle();
      
      if (!error && data) {
        // Cache in KV for next time
        await kv.set(kvKey, 'true');
        return true;
      }
      if (error) {
        console.log(`isAdmin user_roles fallback error for ${userId}: ${error.message}`);
      }
    } catch (tableErr: any) {
      console.log(`isAdmin user_roles table not available: ${tableErr.message}`);
    }

    return false;
  } catch (e: any) {
    console.log(`isAdmin exception for ${userId}:`, e.message);
    return false;
  }
}

// ─── Admin Auth Middleware Helper ───
async function requireAdmin(c: any): Promise<{ user: any; error: string | null }> {
  const { user, error: authError } = await authUser(c);
  if (!user) return { user: null, error: `Auth error in admin route: ${authError}` };
  
  const admin = await isAdmin(user.id);
  if (!admin) return { user: null, error: 'Forbidden: user is not an admin' };
  
  return { user, error: null };
}

// ───────────────────────────────────────────────
// ADMIN: Verify admin status
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/admin/verify", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error verifying admin: ${authError}` }, 401);
    
    const admin = await isAdmin(user.id);
    
    return c.json({ 
      is_admin: admin,
      user_id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email
    });
  } catch (e: any) {
    console.log("Admin verify error:", e.message);
    return c.json({ error: `Admin verify error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// ADMIN: Bootstrap — activate admin for current user (first-time setup)
// Uses KV store. Only works if no admin exists yet, OR user is already admin.
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/admin/bootstrap", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error in admin bootstrap: ${authError}` }, 401);

    // Check if any admin already exists in KV
    const existingAdmins = await kv.getByPrefix('admin::');
    const hasExistingAdmin = Array.isArray(existingAdmins) && existingAdmins.some((item: any) => {
      const val = typeof item === 'object' && item !== null ? item.value : item;
      return val === 'true' || val === true;
    });

    // If admins exist and current user is NOT one of them, deny
    if (hasExistingAdmin) {
      const currentIsAdmin = await isAdmin(user.id);
      if (!currentIsAdmin) {
        return c.json({ error: 'An admin already exists. Contact existing admin to grant access.' }, 403);
      }
      return c.json({ message: 'You are already an admin', user_id: user.id, email: user.email });
    }

    // No admin exists — promote current user
    await kv.set(`admin::${user.id}`, 'true');
    console.log(`Admin bootstrap: ${user.email} (${user.id}) promoted to admin via KV`);

    return c.json({
      success: true,
      message: 'Admin activated successfully',
      user_id: user.id,
      email: user.email,
    });
  } catch (e: any) {
    console.log("Admin bootstrap error:", e.message);
    return c.json({ error: `Admin bootstrap error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// ADMIN: Dashboard Stats (KPIs)
// ───────────────────────────────────────────────
app.get("/make-server-ad34c09a/admin/stats", async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error }, error === 'Forbidden: user is not an admin' ? 403 : 401);

    const supabase = adminClient();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      authUsersRes,
      providersRes,
      clientsRes,
      pendingProvidersRes,
      totalWalletsRes,
      totalCreditsRes,
      totalDebitsRes,
      activityTodayRes,
      recentActivityRes,
      weeklyAuthRes,
    ] = await Promise.all([
      supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'provider'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'provider').eq('is_verified', false),
      supabase.from('wallets').select('balance_coins'),
      supabase.from('wallet_ledger').select('coins').eq('direction', 'credit'),
      supabase.from('wallet_ledger').select('coins').eq('direction', 'debit'),
      supabase.from('activity_log').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
      supabase.from('activity_log').select('id, actor_user_id, action, meta, created_at').order('created_at', { ascending: false }).limit(20),
      supabase.from('profiles').select('created_at').gte('created_at', weekAgo).order('created_at', { ascending: true }),
    ]);

    const allAuthUsers = authUsersRes.data?.users || [];
    const totalUsers = allAuthUsers.length;
    const newToday = allAuthUsers.filter((u: any) => u.created_at >= todayStart).length;

    const totalWalletBalance = (totalWalletsRes.data || []).reduce((sum: number, w: any) => sum + (Number(w.balance_coins) || 0), 0);
    const totalCredits = (totalCreditsRes.data || []).reduce((sum: number, e: any) => sum + (Number(e.coins) || 0), 0);
    const totalDebits = (totalDebitsRes.data || []).reduce((sum: number, e: any) => sum + (Number(e.coins) || 0), 0);

    // Weekly signup trend (group by day)
    const weeklyTrend: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      weeklyTrend[d.toISOString().split('T')[0]] = 0;
    }
    allAuthUsers.forEach((u: any) => {
      const key = new Date(u.created_at).toISOString().split('T')[0];
      if (weeklyTrend[key] !== undefined) weeklyTrend[key]++;
    });

    // Service distribution from real profiles
    const { data: serviceProfiles } = await supabase.from('profiles').select('provider_type').eq('role', 'provider').not('provider_type', 'is', null);
    const serviceDist: Record<string, number> = {};
    (serviceProfiles || []).forEach((p: any) => {
      if (p.provider_type) serviceDist[p.provider_type] = (serviceDist[p.provider_type] || 0) + 1;
    });

    return c.json({
      total_users: totalUsers,
      new_today: newToday,
      total_providers: providersRes.count || 0,
      total_clients: clientsRes.count || 0,
      pending_providers: pendingProvidersRes.count || 0,
      total_wallet_balance: totalWalletBalance,
      total_credits: totalCredits,
      total_debits: totalDebits,
      activity_today: activityTodayRes.count || 0,
      recent_activity: recentActivityRes.data || [],
      weekly_trend: Object.entries(weeklyTrend).map(([date, count]) => ({ date, count })),
      service_distribution: Object.entries(serviceDist).map(([name, value]) => ({ name, value })),
    });
  } catch (e: any) {
    console.log("Admin stats error:", e.message);
    return c.json({ error: `Admin stats error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// ADMIN: List Users (paginated + search)
// ───────────────────────────────────────────────
app.get("/make-server-ad34c09a/admin/users", async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error }, error === 'Forbidden: user is not an admin' ? 403 : 401);
    
    const supabase = adminClient();
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const q = c.req.query('q') || '';
    const offset = (page - 1) * limit;
    
    // Get users from auth.users via admin API
    const { data: authData, error: authErr } = await supabase.auth.admin.listUsers({
      page,
      perPage: limit,
    });
    
    if (authErr) {
      console.log("Admin list users error:", authErr.message);
      return c.json({ error: `Failed to list users: ${authErr.message}` }, 500);
    }
    
    const authUsers = authData?.users || [];
    const userIds = authUsers.map((u: any) => u.id);
    
    // Fetch profiles + wallets + roles for these users
    const [profilesRes, walletsRes, rolesRes] = await Promise.all([
      supabase.from('profiles').select('*').in('user_id', userIds),
      supabase.from('wallets').select('user_id, balance_coins').in('user_id', userIds),
      supabase.from('user_roles').select('user_id, roles!inner(key)').in('user_id', userIds),
    ]);
    
    const profilesMap: Record<string, any> = {};
    (profilesRes.data || []).forEach((p: any) => { profilesMap[p.user_id] = p; });
    
    const walletsMap: Record<string, any> = {};
    (walletsRes.data || []).forEach((w: any) => { walletsMap[w.user_id] = w; });
    
    const rolesMap: Record<string, string[]> = {};
    (rolesRes.data || []).forEach((r: any) => {
      if (!rolesMap[r.user_id]) rolesMap[r.user_id] = [];
      rolesMap[r.user_id].push(r.roles?.key || 'user');
    });
    
    // Merge data
    let users = authUsers.map((u: any) => ({
      id: u.id,
      email: u.email,
      phone: u.phone,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      display_name: u.user_metadata?.name || u.email,
      avatar_url: u.user_metadata?.avatar_url || null,
      balance_coins: walletsMap[u.id]?.balance_coins || 0,
      roles: rolesMap[u.id] || ['user'],
      provider: u.app_metadata?.provider || 'email',
    }));
    
    // Client-side search filter
    if (q) {
      const ql = q.toLowerCase();
      users = users.filter((u: any) =>
        (u.display_name || '').toLowerCase().includes(ql) ||
        (u.email || '').toLowerCase().includes(ql) ||
        (u.phone || '').includes(ql)
      );
    }
    
    return c.json({
      users,
      page,
      limit,
      total: authData?.users?.length || 0,
    });
  } catch (e: any) {
    console.log("Admin list users error:", e.message);
    return c.json({ error: `Admin list users error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// ADMIN: User Detail
// ───────────────────────────────────────────────
app.get("/make-server-ad34c09a/admin/users/:id", async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error }, error === 'Forbidden: user is not an admin' ? 403 : 401);
    
    const targetId = c.req.param('id');
    const supabase = adminClient();
    
    const [authRes, profileRes, walletRes, ledgerRes, activityRes, rolesRes] = await Promise.all([
      supabase.auth.admin.getUserById(targetId),
      supabase.from('profiles').select('*').eq('user_id', targetId).maybeSingle(),
      supabase.from('wallets').select('*').eq('user_id', targetId).maybeSingle(),
      supabase.from('wallet_ledger').select('*').eq('user_id', targetId)
        .order('created_at', { ascending: false }).limit(20),
      supabase.from('activity_log').select('*').eq('actor_user_id', targetId)
        .order('created_at', { ascending: false }).limit(20),
      supabase.from('user_roles').select('roles!inner(key)').eq('user_id', targetId),
    ]);
    
    if (authRes.error) {
      return c.json({ error: `User not found: ${authRes.error.message}` }, 404);
    }
    
    const authUser = authRes.data?.user;
    
    return c.json({
      id: authUser?.id,
      email: authUser?.email,
      phone: authUser?.phone,
      created_at: authUser?.created_at,
      last_sign_in_at: authUser?.last_sign_in_at,
      provider: authUser?.app_metadata?.provider || 'email',
      profile: profileRes.data || {},
      wallet: walletRes.data || { balance_coins: 0 },
      ledger: ledgerRes.data || [],
      activity: activityRes.data || [],
      roles: (rolesRes.data || []).map((r: any) => r.roles?.key || 'user'),
    });
  } catch (e: any) {
    console.log("Admin user detail error:", e.message);
    return c.json({ error: `Admin user detail error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// ADMIN: Activity Log (paginated + filtered)
// ───────────────────────────────────────────────
app.get("/make-server-ad34c09a/admin/activity", async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error }, error === 'Forbidden: user is not an admin' ? 403 : 401);
    
    const supabase = adminClient();
    const type = c.req.query('type') || '';
    const q = c.req.query('q') || '';
    const from = c.req.query('from') || '';
    const to = c.req.query('to') || '';
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('activity_log')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (type) query = query.eq('action', type);
    if (from) query = query.gte('created_at', from);
    if (to) query = query.lte('created_at', to);
    
    const { data, error: qErr, count } = await query;
    
    if (qErr) {
      return c.json({ error: `Activity query error: ${qErr.message}` }, 500);
    }
    
    return c.json({
      activities: data || [],
      page,
      limit,
      total: count || 0,
    });
  } catch (e: any) {
    console.log("Admin activity error:", e.message);
    return c.json({ error: `Admin activity error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// ADMIN: Create Invite Code
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/admin/invite", async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error }, error === 'Forbidden: user is not an admin' ? 403 : 401);
    
    const supabase = adminClient();
    
    // Check if there's already an unused invite
    const { data: existing } = await supabase
      .from('admin_invites')
      .select('code, expires_at')
      .eq('used', false)
      .eq('created_by', user.id)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();
    
    if (existing) {
      return c.json({
        invite_code: existing.code,
        expires_at: existing.expires_at,
        message: 'Existing unused invite returned',
      });
    }
    
    // Create new invite
    const { data, error: insertErr } = await supabase
      .from('admin_invites')
      .insert({ created_by: user.id })
      .select('code, expires_at')
      .single();
    
    if (insertErr) {
      return c.json({ error: `Failed to create invite: ${insertErr.message}` }, 500);
    }
    
    // Log activity
    await supabase.from('activity_log').insert({
      actor_user_id: user.id,
      action: 'admin_invite_create',
      meta: { entity_type: 'admin_invites', entity_id: data.code },
    });
    
    return c.json({
      invite_code: data.code,
      expires_at: data.expires_at,
    });
  } catch (e: any) {
    console.log("Admin invite create error:", e.message);
    return c.json({ error: `Admin invite create error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// ADMIN: Accept Invite Code
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/admin/invite/accept", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error accepting invite: ${authError}` }, 401);
    
    const { code } = await c.req.json();
    if (!code) return c.json({ error: 'Missing invite code' }, 400);
    
    const supabase = adminClient();
    
    // Validate code
    const { data: invite, error: findErr } = await supabase
      .from('admin_invites')
      .select('*')
      .eq('code', code)
      .maybeSingle();
    
    if (findErr || !invite) {
      return c.json({ error: 'Invalid invite code' }, 400);
    }
    if (invite.used) {
      return c.json({ error: 'Invite code already used' }, 400);
    }
    if (new Date(invite.expires_at).getTime() < Date.now()) {
      return c.json({ error: 'Invite code has expired' }, 400);
    }
    
    // Already admin?
    const alreadyAdmin = await isAdmin(user.id);
    if (alreadyAdmin) {
      return c.json({ error: 'User is already an admin', is_admin: true }, 400);
    }
    
    // Get admin role ID
    const { data: adminRole } = await supabase
      .from('roles')
      .select('id')
      .eq('key', 'admin')
      .single();
    
    if (!adminRole) {
      return c.json({ error: 'Admin role not found in database' }, 500);
    }
    
    // Assign admin role
    const { error: roleErr } = await supabase
      .from('user_roles')
      .insert({ user_id: user.id, role_id: adminRole.id });
    
    if (roleErr) {
      return c.json({ error: `Failed to assign admin role: ${roleErr.message}` }, 500);
    }
    
    // Mark invite as used
    await supabase
      .from('admin_invites')
      .update({ used: true, used_by: user.id, used_at: new Date().toISOString() })
      .eq('code', code);
    
    // Log activity
    await supabase.from('activity_log').insert({
      actor_user_id: user.id,
      action: 'admin_invite_accept',
      meta: { entity_type: 'admin_invites', entity_id: code, invited_by: invite.created_by },
    });
    
    console.log(`User ${user.id} (${user.email}) accepted admin invite ${code}`);
    
    return c.json({ success: true, message: 'Admin role assigned successfully' });
  } catch (e: any) {
    console.log("Admin invite accept error:", e.message);
    return c.json({ error: `Admin invite accept error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// ADMIN: System Health
// ───────────────────────────────────────────────
app.get("/make-server-ad34c09a/admin/system-health", async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error }, error === 'Forbidden: user is not an admin' ? 403 : 401);
    
    const supabase = adminClient();
    const start = Date.now();
    
    // Test DB connection
    const { error: dbErr } = await supabase.from('roles').select('id').limit(1);
    const dbLatency = Date.now() - start;
    
    // Test storage
    const storageStart = Date.now();
    const { data: buckets } = await supabase.storage.listBuckets();
    const storageLatency = Date.now() - storageStart;
    
    // Auth stats
    const authStart = Date.now();
    const { data: authData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
    const authLatency = Date.now() - authStart;
    
    // Table row counts
    const [profilesCount, walletsCount, activityCount, ledgerCount, invitesCount] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('wallets').select('*', { count: 'exact', head: true }),
      supabase.from('activity_log').select('*', { count: 'exact', head: true }),
      supabase.from('wallet_ledger').select('*', { count: 'exact', head: true }),
      supabase.from('admin_invites').select('*', { count: 'exact', head: true }),
    ]);
    
    return c.json({
      status: dbErr ? 'degraded' : 'healthy',
      timestamp: new Date().toISOString(),
      latency: {
        database_ms: dbLatency,
        storage_ms: storageLatency,
        auth_ms: authLatency,
      },
      storage: {
        buckets: (buckets || []).map((b: any) => b.name),
      },
      tables: {
        profiles: profilesCount.count || 0,
        wallets: walletsCount.count || 0,
        activity_log: activityCount.count || 0,
        wallet_ledger: ledgerCount.count || 0,
        admin_invites: invitesCount.count || 0,
      },
      db_error: dbErr?.message || null,
    });
  } catch (e: any) {
    console.log("System health error:", e.message);
    return c.json({ error: `System health error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// ADMIN: Wallet Adjust (credit/debit by admin)
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/admin/wallet/adjust", async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error }, error === 'Forbidden: user is not an admin' ? 403 : 401);
    
    const { target_user_id, coins, direction, reason } = await c.req.json();
    
    if (!target_user_id || !coins || !direction || !reason) {
      return c.json({ error: 'Missing required fields: target_user_id, coins, direction, reason' }, 400);
    }
    if (!['credit', 'debit'].includes(direction)) {
      return c.json({ error: 'direction must be credit or debit' }, 400);
    }
    if (coins <= 0) {
      return c.json({ error: 'coins must be a positive number' }, 400);
    }
    
    // Get current wallet from KV store (same source as /wallet/balance)
    let wallet = await kv.get(`wallet:${target_user_id}`);
    if (!wallet) {
      wallet = { balance: 0, updated_at: new Date().toISOString() };
    }
    
    const currentBalance = Number(wallet.balance || 0);
    const newBalance = direction === 'credit'
      ? currentBalance + coins
      : Math.max(0, currentBalance - coins);
    
    const now = new Date().toISOString();
    
    // Update wallet in KV store
    await kv.set(`wallet:${target_user_id}`, { balance: newBalance, updated_at: now });
    
    // Log in KV ledger (same format as /wallet/spend and /wallet/topup)
    const ledgerEntry = {
      type: direction === 'credit' ? 'admin_credit' : 'admin_debit',
      direction,
      amount: direction === 'credit' ? coins : -coins,
      coins,
      reason: `${reason} (admin: ${user.email || user.id})`,
      created_at: now,
      user_id: target_user_id,
      admin_id: user.id,
    };
    await kv.set(`wallet_ledger:${target_user_id}:${Date.now()}`, ledgerEntry);
    
    console.log(`Admin ${user.id} adjusted wallet for ${target_user_id}: ${direction} ${coins} coins. Old: ${currentBalance}, New: ${newBalance}`);
    
    return c.json({ success: true, new_balance: newBalance, old_balance: currentBalance });
  } catch (e: any) {
    console.log("Admin wallet adjust error:", e.message);
    return c.json({ error: `Admin wallet adjust error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// ADMIN: Ban / Unban User
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/admin/users/:id/ban", async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error }, error === 'Forbidden: user is not an admin' ? 403 : 401);
    const targetId = c.req.param('id');
    const { action, reason, duration_hours } = await c.req.json();
    if (!action || !['ban', 'unban'].includes(action)) return c.json({ error: 'action must be ban or unban' }, 400);
    const supabase = adminClient();
    if (action === 'ban') {
      const banDuration = duration_hours ? `${duration_hours}h` : 'none';
      await supabase.auth.admin.updateUserById(targetId, { ban_duration: banDuration });
      await kv.set(`user_status:${targetId}`, { status: 'banned', reason: reason || 'محظور بواسطة الأدمن', banned_at: new Date().toISOString(), banned_by: user.id, duration_hours: duration_hours || null, expires_at: duration_hours ? new Date(Date.now() + duration_hours * 3600000).toISOString() : null });
      await kv.set(`admin_action:${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, { type: 'user_banned', admin_id: user.id, target_id: targetId, reason, duration_hours, created_at: new Date().toISOString() });
      console.log(`Admin ${user.id} banned user ${targetId}`);
    } else {
      await supabase.auth.admin.updateUserById(targetId, { ban_duration: 'none' }).catch(() => {});
      await kv.set(`user_status:${targetId}`, { status: 'active', unbanned_at: new Date().toISOString(), unbanned_by: user.id });
      console.log(`Admin ${user.id} unbanned user ${targetId}`);
    }
    return c.json({ success: true, action });
  } catch (e: any) {
    console.log("Admin ban error:", e.message);
    return c.json({ error: `Admin ban error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// ADMIN: Freeze / Unfreeze User
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/admin/users/:id/freeze", async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error }, error === 'Forbidden: user is not an admin' ? 403 : 401);
    const targetId = c.req.param('id');
    const { action, reason, freeze_until } = await c.req.json();
    if (!action || !['freeze', 'unfreeze'].includes(action)) return c.json({ error: 'action must be freeze or unfreeze' }, 400);
    if (action === 'freeze') {
      await kv.set(`user_status:${targetId}`, { status: 'frozen', reason: reason || 'تم تجميد الحساب', frozen_at: new Date().toISOString(), frozen_by: user.id, freeze_until: freeze_until || null });
      await kv.set(`admin_action:${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, { type: 'user_frozen', admin_id: user.id, target_id: targetId, reason, freeze_until, created_at: new Date().toISOString() });
    } else {
      await kv.set(`user_status:${targetId}`, { status: 'active', unfrozen_at: new Date().toISOString(), unfrozen_by: user.id });
    }
    return c.json({ success: true, action });
  } catch (e: any) {
    console.log("Admin freeze error:", e.message);
    return c.json({ error: `Admin freeze error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// ADMIN: Delete User (permanent — cannot be undone)
// ───────────────────────────────────────────────
app.delete("/make-server-ad34c09a/admin/users/:id", async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error }, error === 'Forbidden: user is not an admin' ? 403 : 401);
    const targetId = c.req.param('id');
    // Prevent self-deletion
    if (targetId === user.id) return c.json({ error: 'لا يمكنك حذف حسابك الخاص' }, 400);
    const supabase = adminClient();
    // Delete from auth (cascades to profiles/wallets via FK)
    const { error: delErr } = await supabase.auth.admin.deleteUser(targetId);
    if (delErr) return c.json({ error: delErr.message }, 500);
    // Clean up KV data
    await Promise.allSettled([
      kv.del(`user_status:${targetId}`),
      kv.del(`subscription:${targetId}`),
      kv.del(`profile:${targetId}`),
      kv.del(`wallet:${targetId}`),
      kv.del(`onboarding:${targetId}`),
    ]);
    // Log the action
    await kv.set(`admin_action:${Date.now()}_del_${targetId.slice(0,8)}`, {
      type: 'user_deleted', admin_id: user.id, target_id: targetId, created_at: new Date().toISOString()
    });
    console.log(`Admin ${user.id} permanently deleted user ${targetId}`);
    return c.json({ success: true });
  } catch (e: any) {
    console.log("Admin delete user error:", e.message);
    return c.json({ error: `Admin delete error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// ADMIN: Purge All Users Except Admin (bulk delete)
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/admin/users/purge-all", async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error }, error === 'Forbidden: user is not an admin' ? 403 : 401);
    const supabase = adminClient();

    // List all users
    const { data: allData, error: listErr } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listErr) return c.json({ error: listErr.message }, 500);

    const allUsers = allData?.users || [];
    const toDelete = allUsers.filter((u: any) => u.id !== user.id);

    let deleted = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const u of toDelete) {
      try {
        const { error: delErr } = await supabase.auth.admin.deleteUser(u.id);
        if (delErr) { failed++; errors.push(`${u.email}: ${delErr.message}`); }
        else {
          deleted++;
          // Clean KV
          await Promise.allSettled([
            kv.del(`user_status:${u.id}`),
            kv.del(`subscription:${u.id}`),
            kv.del(`profile:${u.id}`),
            kv.del(`wallet:${u.id}`),
            kv.del(`onboarding:${u.id}`),
          ]);
        }
      } catch (e: any) { failed++; errors.push(`${u.email}: ${e.message}`); }
    }

    console.log(`Admin ${user.id} purged ${deleted} users, ${failed} failed`);
    return c.json({ success: true, deleted, failed, errors: errors.slice(0, 10), kept: user.email });
  } catch (e: any) {
    console.log("Admin purge error:", e.message);
    return c.json({ error: `Admin purge error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// ADMIN: Update User Plan / Subscription
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/admin/users/:id/plan", async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error }, error === 'Forbidden: user is not an admin' ? 403 : 401);
    const targetId = c.req.param('id');
    const { plan, expires_at, reason } = await c.req.json();
    if (!plan) return c.json({ error: 'plan is required' }, 400);
    const now = new Date().toISOString();
    await kv.set(`subscription:${targetId}`, { plan, status: plan === 'free' ? 'free' : 'active', updated_at: now, updated_by: user.id, expires_at: expires_at || null, reason: reason || 'تحديث بواسطة الأدمن' });
    await kv.set(`admin_action:${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, { type: 'plan_changed', admin_id: user.id, target_id: targetId, plan, reason, created_at: now });
    return c.json({ success: true, plan });
  } catch (e: any) {
    console.log("Admin plan update error:", e.message);
    return c.json({ error: `Admin plan update error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// ADMIN: Full User Detail (status + behavior + verification)
// ───────────────────────────────────────────────
app.get("/make-server-ad34c09a/admin/users/:id/full", async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error }, error === 'Forbidden: user is not an admin' ? 403 : 401);
    const targetId = c.req.param('id');
    const supabase = adminClient();
    const { data: authData, error: authErr } = await supabase.auth.admin.getUserById(targetId);
    if (authErr || !authData?.user) return c.json({ error: `User not found` }, 404);
    const au = authData.user;
    const [statusRes, subscriptionRes, profileRes, walletRes, ledgerRes, actionsRes, onboardingRes, workspacesRes] = await Promise.all([
      kv.get(`user_status:${targetId}`), kv.get(`subscription:${targetId}`), kv.get(`profile:${targetId}`),
      kv.get(`wallet:${targetId}`), kv.getByPrefix(`wallet_ledger:${targetId}:`), kv.getByPrefix(`admin_action:`),
      kv.get(`onboarding:${targetId}`), kv.getByPrefix(`workspace:`),
    ]);
    const userWorkspaces = (workspacesRes || []).filter((w: any) => w.owner_id === targetId);
    const userActions = (actionsRes || []).filter((a: any) => a.target_id === targetId).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 20);
    const identities = au.identities || [];
    return c.json({
      id: au.id, email: au.email, phone: au.phone, created_at: au.created_at, last_sign_in_at: au.last_sign_in_at,
      provider: au.app_metadata?.provider || 'email', providers: au.app_metadata?.providers || [],
      user_metadata: au.user_metadata || {}, app_metadata: au.app_metadata || {},
      account_status: statusRes || { status: 'active' },
      subscription: subscriptionRes || { plan: 'free', status: 'free' },
      profile: profileRes || {}, wallet: walletRes || { balance: 0 },
      ledger: ((ledgerRes || []) as any[]).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 20),
      behavior: { user_agent: au.user_metadata?.user_agent || null, ip_address: au.user_metadata?.ip_address || null, last_sign_in_at: au.last_sign_in_at, created_at: au.created_at, confirmed_at: au.confirmed_at, banned_until: au.banned_until, identities: identities.map((id: any) => ({ provider: id.provider, identity_id: id.identity_id, last_sign_in_at: id.last_sign_in_at, identity_data: id.identity_data })) },
      verification: onboardingRes || {}, workspaces: userWorkspaces, admin_actions: userActions,
    });
  } catch (e: any) {
    console.log("Admin user full detail error:", e.message);
    return c.json({ error: `Admin user full detail error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// ADMIN: Manage Workspace (activate / deactivate / delete)
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/admin/workspace/:id/manage", async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error }, error === 'Forbidden: user is not an admin' ? 403 : 401);
    const wsId = c.req.param('id');
    const { action, reason } = await c.req.json();
    if (!action || !['activate', 'deactivate', 'delete'].includes(action)) return c.json({ error: 'invalid action' }, 400);
    const ws: any = await kv.get(`workspace:${wsId}`);
    if (!ws) return c.json({ error: 'Workspace not found' }, 404);
    if (action === 'delete') { await kv.del(`workspace:${wsId}`); }
    else { ws.status = action === 'activate' ? 'active' : 'inactive'; ws.updated_at = new Date().toISOString(); await kv.set(`workspace:${wsId}`, ws); }
    await kv.set(`admin_action:${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, { type: `workspace_${action}`, admin_id: user.id, target_id: wsId, reason, created_at: new Date().toISOString() });
    return c.json({ success: true, action });
  } catch (e: any) {
    console.log("Admin workspace manage error:", e.message);
    return c.json({ error: `Admin workspace manage error: ${e.message}` }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════
// ████████████  WORKSPACE DELETION REQUESTS  ████████████████████
// ═══════════════════════════════════════════════════════════════

// ─── POST /workspace/deletion-request — User submits a deletion request ───
app.post("/make-server-ad34c09a/workspace/deletion-request", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error creating deletion request: ${authError}` }, 401);

    const { workspaceId, reason } = await c.req.json();
    if (!workspaceId) return c.json({ error: 'workspaceId is required' }, 400);

    // Verify user owns the workspace
    const ws: any = await kv.get(`workspace:${workspaceId}`);
    if (!ws) return c.json({ error: 'Workspace not found' }, 404);
    if (ws.owner_id !== user.id) return c.json({ error: 'Only workspace owner can request deletion' }, 403);

    // Check if there's already a pending request
    const existingRequests = await kv.getByPrefix(`ws_deletion_req:`);
    const hasPending = (existingRequests || []).some(
      (r: any) => r.workspace_id === workspaceId && r.status === 'pending'
    );
    if (hasPending) {
      return c.json({ error: 'A pending deletion request already exists for this workspace', already_pending: true }, 409);
    }

    const id = `WDEL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const now = new Date().toISOString();

    const request = {
      id,
      user_id: user.id,
      workspace_id: workspaceId,
      workspace_name: ws.name || 'Unknown',
      user_email: user.email || '',
      reason: reason || '',
      status: 'pending',
      requested_at: now,
      reviewed_at: null,
      reviewed_by: null,
      admin_note: null,
    };

    await kv.set(`ws_deletion_req:${id}`, request);

    // Log activity
    await kv.set(`admin_action:${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, {
      type: 'workspace_deletion_requested',
      user_id: user.id,
      target_id: workspaceId,
      request_id: id,
      reason,
      created_at: now,
    });

    console.log(`Workspace deletion request created: ${id} for workspace ${workspaceId} by user ${user.id}`);
    return c.json({ success: true, request });
  } catch (e: any) {
    console.log("Workspace deletion request error:", e.message);
    return c.json({ error: `Workspace deletion request error: ${e.message}` }, 500);
  }
});

// ─── GET /workspace/deletion-request/status — User checks their request status ───
app.get("/make-server-ad34c09a/workspace/deletion-request/status", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error: ${authError}` }, 401);

    const workspaceId = c.req.query('workspaceId');
    if (!workspaceId) return c.json({ error: 'workspaceId query param required' }, 400);

    const allRequests = await kv.getByPrefix(`ws_deletion_req:`);
    const userRequest = (allRequests || []).find(
      (r: any) => r.workspace_id === workspaceId && r.user_id === user.id && r.status === 'pending'
    );

    return c.json({ request: userRequest || null });
  } catch (e: any) {
    console.log("Deletion request status error:", e.message);
    return c.json({ error: `Deletion request status error: ${e.message}` }, 500);
  }
});

// ─── GET /admin/workspace-deletion-requests — Admin lists all requests ───
app.get("/make-server-ad34c09a/admin/workspace-deletion-requests", async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error }, error === 'Forbidden: user is not an admin' ? 403 : 401);

    const statusFilter = c.req.query('status') || 'all';
    const allRequests = await kv.getByPrefix(`ws_deletion_req:`);
    let requests = allRequests || [];

    if (statusFilter !== 'all') {
      requests = requests.filter((r: any) => r.status === statusFilter);
    }

    // Sort by requested_at descending
    requests.sort((a: any, b: any) =>
      new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime()
    );

    return c.json({ requests });
  } catch (e: any) {
    console.log("Admin deletion requests list error:", e.message);
    return c.json({ error: `Admin deletion requests list error: ${e.message}` }, 500);
  }
});

// ─── POST /admin/workspace-deletion-requests/:id/action — Admin approves or rejects ───
app.post("/make-server-ad34c09a/admin/workspace-deletion-requests/:id/action", async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error }, error === 'Forbidden: user is not an admin' ? 403 : 401);

    const reqId = c.req.param('id');
    const { action, admin_note } = await c.req.json();

    if (!action || !['approve', 'reject'].includes(action)) {
      return c.json({ error: 'action must be "approve" or "reject"' }, 400);
    }

    const request: any = await kv.get(`ws_deletion_req:${reqId}`);
    if (!request) return c.json({ error: 'Deletion request not found' }, 404);
    if (request.status !== 'pending') return c.json({ error: `Request already ${request.status}` }, 409);

    const now = new Date().toISOString();
    request.status = action === 'approve' ? 'approved' : 'rejected';
    request.reviewed_at = now;
    request.reviewed_by = user.id;
    request.admin_note = admin_note || '';

    if (action === 'approve') {
      // Soft delete: mark workspace as deleted
      const ws: any = await kv.get(`workspace:${request.workspace_id}`);
      if (ws) {
        ws.status = 'deleted';
        ws.deleted_at = now;
        ws.deleted_by_admin = user.id;
        ws.updated_at = now;
        await kv.set(`workspace:${request.workspace_id}`, ws);
      }

      // Downgrade user subscription if needed
      const profileKey = `user_profile:${request.user_id}`;
      const profile: any = await kv.get(profileKey);
      if (profile && profile.subscription) {
        profile.subscription.plan = 'free';
        profile.subscription.status = 'cancelled';
        profile.subscription.cancelled_at = now;
        profile.subscription.cancel_reason = 'workspace_deleted';
        await kv.set(profileKey, profile);
      }
    }

    await kv.set(`ws_deletion_req:${reqId}`, request);

    // Log admin action
    await kv.set(`admin_action:${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, {
      type: `workspace_deletion_${action}`,
      admin_id: user.id,
      request_id: reqId,
      workspace_id: request.workspace_id,
      user_id: request.user_id,
      admin_note,
      created_at: now,
    });

    console.log(`Workspace deletion request ${reqId} ${action}ed by admin ${user.id}`);
    return c.json({ success: true, action, request });
  } catch (e: any) {
    console.log("Admin deletion request action error:", e.message);
    return c.json({ error: `Admin deletion request action error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// ADMIN: List Providers (from profiles table)
// ───────────────────────────────────────────────
app.get("/make-server-ad34c09a/admin/providers", async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error }, error === 'Forbidden: user is not an admin' ? 403 : 401);
    const supabase = adminClient();
    const status = c.req.query('status') || 'all'; // all | pending | verified
    const q = c.req.query('q') || '';
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabase.from('profiles')
      .select('id, user_id, role, provider_type, primary_emirate, primary_city, is_verified, license_status, created_at, updated_at, emirates_id_verified', { count: 'exact' })
      .eq('role', 'provider')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status === 'pending') query = query.eq('is_verified', false);
    else if (status === 'verified') query = query.eq('is_verified', true);

    const { data: providers, count, error: dbErr } = await query;
    if (dbErr) return c.json({ error: dbErr.message }, 500);

    // Enrich with auth user metadata (name, email)
    const providerIds = (providers || []).map((p: any) => p.user_id || p.id);
    const enriched = await Promise.all((providers || []).map(async (p: any) => {
      try {
        const uid = p.user_id || p.id;
        const { data: authData } = await supabase.auth.admin.getUserById(uid);
        const au = authData?.user;
        const meta = au?.user_metadata || {};
        const name = meta.full_name || meta.name || meta.display_name || au?.email || uid;
        if (q && !name.includes(q) && !(au?.email || '').includes(q)) return null;
        return {
          ...p,
          uid,
          email: au?.email || '',
          full_name: name,
          phone: meta.phone || au?.phone || '',
          avatar_url: meta.avatar_url || null,
          last_sign_in_at: au?.last_sign_in_at || null,
        };
      } catch { return p; }
    }));

    return c.json({
      providers: enriched.filter(Boolean),
      total: count || 0,
      page,
      limit,
    });
  } catch (e: any) {
    console.log("Admin providers list error:", e.message);
    return c.json({ error: `Admin providers error: ${e.message}` }, 500);
  }
});

// ───────────────────────────────────────────────
// ADMIN: Verify / Reject Provider
// ───────────────────────────────────────────────
app.post("/make-server-ad34c09a/admin/providers/:id/verify", async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error }, error === 'Forbidden: user is not an admin' ? 403 : 401);
    const providerId = c.req.param('id');
    const { action, note } = await c.req.json(); // action: 'verify' | 'reject'
    if (!action || !['verify', 'reject'].includes(action)) return c.json({ error: 'action must be verify or reject' }, 400);
    const supabase = adminClient();

    const isVerified = action === 'verify';
    const licenseStatus = isVerified ? 'approved' : 'rejected';

    // Try both id and user_id columns
    const { error: upErr } = await supabase.from('profiles')
      .update({ is_verified: isVerified, license_status: licenseStatus, updated_at: new Date().toISOString() })
      .or(`id.eq.${providerId},user_id.eq.${providerId}`);

    if (upErr) return c.json({ error: upErr.message }, 500);

    await kv.set(`admin_action:${Date.now()}_prov_${providerId.slice(0,8)}`, {
      type: `provider_${action}`,
      admin_id: user.id,
      target_id: providerId,
      note: note || '',
      created_at: new Date().toISOString(),
    });

    console.log(`Admin ${user.id} ${action}d provider ${providerId}`);
    return c.json({ success: true, action, is_verified: isVerified });
  } catch (e: any) {
    console.log("Admin verify provider error:", e.message);
    return c.json({ error: `Admin verify error: ${e.message}` }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════
// ████████████  SERVICE ORDERS SYSTEM  ████████████████████████████
// ═══════════════════════════════════════════════════════════════

// ─── GET /orders — Fetch user's orders ───
app.get("/make-server-ad34c09a/orders", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error fetching orders: ${authError}` }, 401);

    const entries = await kv.getByPrefix(`orders:${user.id}:`);
    const sorted = (entries || []).sort((a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return c.json({ orders: sorted });
  } catch (e: any) {
    console.log("Orders fetch error:", e.message);
    return c.json({ error: `Orders fetch error: ${e.message}` }, 500);
  }
});

// ─── POST /orders — Create a new order ───
app.post("/make-server-ad34c09a/orders", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error creating order: ${authError}` }, 401);

    const body = await c.req.json();
    const { title, service_type, description, price, provider_id } = body;

    if (!title) return c.json({ error: 'عنوان الطلب مطلوب' }, 400);

    const id = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const now = new Date().toISOString();

    const order = {
      id,
      user_id: user.id,
      title,
      service_type: service_type || 'general',
      description: description || '',
      price: price || null,
      provider_id: provider_id || null,
      status: 'pending',
      created_at: now,
      updated_at: now,
    };

    await kv.set(`orders:${user.id}:${id}`, order);
    console.log(`Order ${id} created for user ${user.id}: ${title}`);

    return c.json({ success: true, order });
  } catch (e: any) {
    console.log("Order create error:", e.message);
    return c.json({ error: `Order create error: ${e.message}` }, 500);
  }
});

// ─── PUT /orders/:id — Update order status ───
app.put("/make-server-ad34c09a/orders/:id", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error updating order: ${authError}` }, 401);

    const id = c.req.param('id');
    const key = `orders:${user.id}:${id}`;
    const existing: any = await kv.get(key);
    if (!existing) return c.json({ error: 'الطلب غير موجود' }, 404);

    const body = await c.req.json();
    const updated = {
      ...existing,
      ...body,
      id: existing.id,
      user_id: existing.user_id,
      updated_at: new Date().toISOString(),
    };

    await kv.set(key, updated);
    console.log(`Order ${id} updated for user ${user.id}. Status: ${updated.status}`);

    return c.json({ success: true, order: updated });
  } catch (e: any) {
    console.log("Order update error:", e.message);
    return c.json({ error: `Order update error: ${e.message}` }, 500);
  }
});

// ─── DELETE /orders/:id — Cancel/delete an order ───
app.delete("/make-server-ad34c09a/orders/:id", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error deleting order: ${authError}` }, 401);

    const id = c.req.param('id');
    await kv.del(`orders:${user.id}:${id}`);
    console.log(`Order ${id} deleted for user ${user.id}`);

    return c.json({ success: true });
  } catch (e: any) {
    console.log("Order delete error:", e.message);
    return c.json({ error: `Order delete error: ${e.message}` }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════
// ████████████  WORKSPACE CRM ENGINE  ████████████████████████████
// ═══════════════════════════════════════════════════════════════

const WS_PLANS: Record<string, { maxMembers: number; maxProjects: number; automation: boolean }> = {
  starter:    { maxMembers: 5,   maxProjects: 3,   automation: false },
  business:   { maxMembers: 20,  maxProjects: 15,  automation: true  },
  enterprise: { maxMembers: 100, maxProjects: 999, automation: true  },
};

// ─── Helper: Check workspace membership & role ───
async function wsAuth(c: any, wsId: string): Promise<{ user: any; member: any; error: string | null }> {
  const { user, error: authError } = await authUser(c);
  if (!user) return { user: null, member: null, error: `Auth error: ${authError}` };
  const ws: any = await kv.get(`ws:${wsId}`);
  if (!ws) return { user, member: null, error: 'Workspace not found' };
  if (ws.owner_id === user.id) return { user, member: { role: 'owner', id: `owner_${user.id}` }, error: null };
  const links: any = await kv.get(`ws_user_workspaces:${user.id}`) || [];
  const link = Array.isArray(links) ? links.find((l: any) => l.workspace_id === wsId) : null;
  if (!link) return { user, member: null, error: 'Not a member of this workspace' };
  const member: any = await kv.get(`ws_member:${wsId}:${link.member_id}`);
  return { user, member: member || { role: link.role, id: link.member_id }, error: null };
}

// ─── WS: Create ───
app.post("/make-server-ad34c09a/ws/create", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error creating workspace: ${authError}` }, 401);
    const { name, business_type, plan, description, phone, email, address, license_number } = await c.req.json();
    if (!name || !business_type) return c.json({ error: 'name and business_type required' }, 400);
    const planId = plan || 'starter';
    const planConfig = WS_PLANS[planId] || WS_PLANS.starter;
    const wsId = `ws_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();
    const workspace = {
      id: wsId, name, business_type, owner_id: user.id, logo_url: '',
      description: description || '', license_number: license_number || '',
      phone: phone || '', email: email || user.email || '', address: address || '',
      plan: planId, max_members: planConfig.maxMembers, max_projects: planConfig.maxProjects,
      automation_enabled: planConfig.automation, created_at: now, updated_at: now,
    };
    await kv.set(`ws:${wsId}`, workspace);
    const existingLinks: any = await kv.get(`ws_user_workspaces:${user.id}`) || [];
    const links = Array.isArray(existingLinks) ? existingLinks : [];
    links.push({ workspace_id: wsId, member_id: `owner_${user.id}`, role: 'owner', workspace_name: name, business_type });
    await kv.set(`ws_user_workspaces:${user.id}`, links);
    console.log(`Workspace '${name}' created by ${user.email} (${wsId})`);
    return c.json({ workspace });
  } catch (e: any) {
    console.log("WS create error:", e.message);
    return c.json({ error: `WS create error: ${e.message}` }, 500);
  }
});

// ─── WS: Get My Workspaces ───
app.get("/make-server-ad34c09a/ws/mine", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error: ${authError}` }, 401);
    const links: any = await kv.get(`ws_user_workspaces:${user.id}`) || [];
    const linkArr = Array.isArray(links) ? links : [];
    const owned: any[] = [];
    const memberships: any[] = [];
    for (const link of linkArr) {
      const ws: any = await kv.get(`ws:${link.workspace_id}`);
      if (ws) {
        if (link.role === 'owner') owned.push(ws);
        else memberships.push({ ...link, workspace_name: ws.name, business_type: ws.business_type });
      }
    }
    const inviteIds: any = await kv.get(`ws_invites_for:${user.id}`) || [];
    const invitations: any[] = [];
    if (Array.isArray(inviteIds)) {
      for (const iid of inviteIds) {
        const inv: any = await kv.get(`ws_invite:${iid}`);
        if (inv && inv.status === 'pending') invitations.push(inv);
      }
    }
    return c.json({ owned, memberships, invitations });
  } catch (e: any) {
    console.log("WS mine error:", e.message);
    return c.json({ error: `WS mine error: ${e.message}` }, 500);
  }
});

// ─── WS: Get Workspace Details ───
app.get("/make-server-ad34c09a/ws/:id", async (c) => {
  try {
    const wsId = c.req.param('id');
    const { user, member, error } = await wsAuth(c, wsId);
    if (!user || !member) return c.json({ error: error || 'Unauthorized' }, member ? 403 : 401);
    const ws: any = await kv.get(`ws:${wsId}`);
    if (!ws) return c.json({ error: 'Workspace not found' }, 404);
    const memberEntries = await kv.getByPrefix(`ws_member:${wsId}:`);
    const members = (memberEntries || []).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return c.json({ workspace: ws, members, my_role: member.role });
  } catch (e: any) {
    console.log("WS get error:", e.message);
    return c.json({ error: `WS get error: ${e.message}` }, 500);
  }
});

// ─── WS: Update Workspace ───
app.put("/make-server-ad34c09a/ws/:id", async (c) => {
  try {
    const wsId = c.req.param('id');
    const { user, member, error } = await wsAuth(c, wsId);
    if (!user || !member) return c.json({ error: error || 'Unauthorized' }, 401);
    if (member.role !== 'owner' && member.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);
    const ws: any = await kv.get(`ws:${wsId}`);
    if (!ws) return c.json({ error: 'Workspace not found' }, 404);
    const updates = await c.req.json();
    const updated = { ...ws, ...updates, id: ws.id, owner_id: ws.owner_id, created_at: ws.created_at, updated_at: new Date().toISOString() };
    await kv.set(`ws:${wsId}`, updated);
    return c.json({ workspace: updated });
  } catch (e: any) {
    console.log("WS update error:", e.message);
    return c.json({ error: `WS update error: ${e.message}` }, 500);
  }
});

// ─── WS: Add Member ───
app.post("/make-server-ad34c09a/ws/:id/members", async (c) => {
  try {
    const wsId = c.req.param('id');
    const { user, member, error } = await wsAuth(c, wsId);
    if (!user || !member) return c.json({ error: error || 'Unauthorized' }, 401);
    if (member.role !== 'owner' && member.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);
    const ws: any = await kv.get(`ws:${wsId}`);
    const existingMembers = await kv.getByPrefix(`ws_member:${wsId}:`);
    if ((existingMembers || []).length >= (ws?.max_members || 5)) {
      return c.json({ error: 'Member limit reached. Upgrade your plan.' }, 400);
    }
    const { full_name, role, job_title, phone, residency_number, salary, start_date, notes } = await c.req.json();
    if (!full_name || !job_title) return c.json({ error: 'full_name and job_title required' }, 400);
    const memberId = `mem_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();
    const newMember = {
      id: memberId, workspace_id: wsId, user_id: null, role: role || 'staff',
      job_title, full_name, phone: phone || '', residency_number: residency_number || '',
      salary: salary || null, start_date: start_date || '', notes: notes || '',
      status: 'pending', invited_at: null, joined_at: null, created_at: now,
    };
    await kv.set(`ws_member:${wsId}:${memberId}`, newMember);
    console.log(`Member '${full_name}' added to workspace ${wsId}`);
    return c.json({ member: newMember });
  } catch (e: any) {
    console.log("WS add member error:", e.message);
    return c.json({ error: `WS add member error: ${e.message}` }, 500);
  }
});

// ─── WS: Update Member ───
app.put("/make-server-ad34c09a/ws/:id/members/:mid", async (c) => {
  try {
    const wsId = c.req.param('id');
    const mid = c.req.param('mid');
    const { user, member, error } = await wsAuth(c, wsId);
    if (!user || !member) return c.json({ error: error || 'Unauthorized' }, 401);
    if (member.role !== 'owner' && member.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);
    const existing: any = await kv.get(`ws_member:${wsId}:${mid}`);
    if (!existing) return c.json({ error: 'Member not found' }, 404);
    const updates = await c.req.json();
    const updated = { ...existing, ...updates, id: existing.id, workspace_id: existing.workspace_id, created_at: existing.created_at };
    await kv.set(`ws_member:${wsId}:${mid}`, updated);
    return c.json({ member: updated });
  } catch (e: any) {
    console.log("WS update member error:", e.message);
    return c.json({ error: `WS update member error: ${e.message}` }, 500);
  }
});

// ─── WS: Remove Member ───
app.delete("/make-server-ad34c09a/ws/:id/members/:mid", async (c) => {
  try {
    const wsId = c.req.param('id');
    const mid = c.req.param('mid');
    const { user, member, error } = await wsAuth(c, wsId);
    if (!user || !member) return c.json({ error: error || 'Unauthorized' }, 401);
    if (member.role !== 'owner' && member.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);
    const existing: any = await kv.get(`ws_member:${wsId}:${mid}`);
    if (existing?.user_id) {
      const links: any = await kv.get(`ws_user_workspaces:${existing.user_id}`) || [];
      if (Array.isArray(links)) {
        await kv.set(`ws_user_workspaces:${existing.user_id}`, links.filter((l: any) => l.member_id !== mid));
      }
    }
    await kv.del(`ws_member:${wsId}:${mid}`);
    console.log(`Member ${mid} removed from workspace ${wsId}`);
    return c.json({ success: true });
  } catch (e: any) {
    console.log("WS remove member error:", e.message);
    return c.json({ error: `WS remove member error: ${e.message}` }, 500);
  }
});

// ─── WS: Link User ID + Send Invitation ───
app.post("/make-server-ad34c09a/ws/:id/members/:mid/link", async (c) => {
  try {
    const wsId = c.req.param('id');
    const mid = c.req.param('mid');
    const { user, member, error } = await wsAuth(c, wsId);
    if (!user || !member) return c.json({ error: error || 'Unauthorized' }, 401);
    if (member.role !== 'owner' && member.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);
    const { target_user_id } = await c.req.json();
    if (!target_user_id) return c.json({ error: 'target_user_id required' }, 400);
    const existing: any = await kv.get(`ws_member:${wsId}:${mid}`);
    if (!existing) return c.json({ error: 'Member not found' }, 404);
    existing.user_id = target_user_id;
    existing.status = 'invited';
    existing.invited_at = new Date().toISOString();
    await kv.set(`ws_member:${wsId}:${mid}`, existing);
    const ws: any = await kv.get(`ws:${wsId}`);
    const invId = `inv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const invitation = {
      id: invId, workspace_id: wsId, workspace_name: ws?.name || 'Unknown',
      member_id: mid, target_user_id, role: existing.role,
      job_title: existing.job_title, status: 'pending', created_at: new Date().toISOString(),
    };
    await kv.set(`ws_invite:${invId}`, invitation);
    const existingInvites: any = await kv.get(`ws_invites_for:${target_user_id}`) || [];
    const invites = Array.isArray(existingInvites) ? existingInvites : [];
    invites.push(invId);
    await kv.set(`ws_invites_for:${target_user_id}`, invites);
    await createNotification(target_user_id, {
      category: 'platform',
      titleAr: `دعوة انضمام — ${ws?.name}`,
      titleEn: `Invitation — ${ws?.name}`,
      messageAr: `تمت دعوتك للانضمام كـ ${existing.job_title} في ${ws?.name}`,
      messageEn: `You've been invited as ${existing.job_title} at ${ws?.name}`,
      icon: 'users', actionTarget: '/workspace',
    });
    console.log(`Invitation sent to user ${target_user_id} for workspace ${wsId}`);
    return c.json({ invitation });
  } catch (e: any) {
    console.log("WS link/invite error:", e.message);
    return c.json({ error: `WS link/invite error: ${e.message}` }, 500);
  }
});

// ─── WS: Respond to Invitation ───
app.post("/make-server-ad34c09a/ws/invitations/:iid/respond", async (c) => {
  try {
    const iid = c.req.param('iid');
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error: ${authError}` }, 401);
    const { accept } = await c.req.json();
    const inv: any = await kv.get(`ws_invite:${iid}`);
    if (!inv) return c.json({ error: 'Invitation not found' }, 404);
    if (inv.target_user_id !== user.id) return c.json({ error: 'Not your invitation' }, 403);
    if (inv.status !== 'pending') return c.json({ error: 'Already responded' }, 400);
    inv.status = accept ? 'accepted' : 'rejected';
    await kv.set(`ws_invite:${iid}`, inv);
    if (accept) {
      const memberKey = `ws_member:${inv.workspace_id}:${inv.member_id}`;
      const mem: any = await kv.get(memberKey);
      if (mem) { mem.status = 'active'; mem.joined_at = new Date().toISOString(); await kv.set(memberKey, mem); }
      const existingLinks: any = await kv.get(`ws_user_workspaces:${user.id}`) || [];
      const links = Array.isArray(existingLinks) ? existingLinks : [];
      links.push({ workspace_id: inv.workspace_id, member_id: inv.member_id, role: inv.role, workspace_name: inv.workspace_name, business_type: '' });
      await kv.set(`ws_user_workspaces:${user.id}`, links);
      console.log(`User ${user.id} accepted invitation to workspace ${inv.workspace_id}`);
    } else {
      const memberKey = `ws_member:${inv.workspace_id}:${inv.member_id}`;
      const mem: any = await kv.get(memberKey);
      if (mem) { mem.status = 'pending'; mem.user_id = null; await kv.set(memberKey, mem); }
    }
    const invList: any = await kv.get(`ws_invites_for:${user.id}`) || [];
    if (Array.isArray(invList)) {
      await kv.set(`ws_invites_for:${user.id}`, invList.filter((id: string) => id !== iid));
    }
    return c.json({ success: true });
  } catch (e: any) {
    console.log("WS invitation respond error:", e.message);
    return c.json({ error: `WS invitation respond error: ${e.message}` }, 500);
  }
});

// ─── WS: Projects CRUD ───
app.get("/make-server-ad34c09a/ws/:id/projects", async (c) => {
  try {
    const wsId = c.req.param('id');
    const { user, member, error } = await wsAuth(c, wsId);
    if (!user || !member) return c.json({ error: error || 'Unauthorized' }, 401);
    const entries = await kv.getByPrefix(`ws_project:${wsId}:`);
    const projects = (entries || []).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return c.json({ projects });
  } catch (e: any) {
    console.log("WS projects list error:", e.message);
    return c.json({ error: `WS projects list error: ${e.message}` }, 500);
  }
});

app.post("/make-server-ad34c09a/ws/:id/projects", async (c) => {
  try {
    const wsId = c.req.param('id');
    const { user, member, error } = await wsAuth(c, wsId);
    if (!user || !member) return c.json({ error: error || 'Unauthorized' }, 401);
    if (member.role !== 'owner' && member.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);
    const ws: any = await kv.get(`ws:${wsId}`);
    const existingProjects = await kv.getByPrefix(`ws_project:${wsId}:`);
    if ((existingProjects || []).length >= (ws?.max_projects || 3)) {
      return c.json({ error: 'Project limit reached. Upgrade your plan.' }, 400);
    }
    const { name, description, status, start_date, end_date, budget, location } = await c.req.json();
    if (!name) return c.json({ error: 'Project name required' }, 400);
    const pid = `proj_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();
    const project = {
      id: pid, workspace_id: wsId, name, description: description || '',
      status: status || 'planning', start_date: start_date || '', end_date: end_date || '',
      budget: budget || null, spent: 0, location: location || '',
      assigned_members: [], created_at: now, updated_at: now,
    };
    await kv.set(`ws_project:${wsId}:${pid}`, project);
    console.log(`Project '${name}' created in workspace ${wsId}`);
    return c.json({ project });
  } catch (e: any) {
    console.log("WS project create error:", e.message);
    return c.json({ error: `WS project create error: ${e.message}` }, 500);
  }
});

app.put("/make-server-ad34c09a/ws/:id/projects/:pid", async (c) => {
  try {
    const wsId = c.req.param('id');
    const pid = c.req.param('pid');
    const { user, member, error } = await wsAuth(c, wsId);
    if (!user || !member) return c.json({ error: error || 'Unauthorized' }, 401);
    if (member.role !== 'owner' && member.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);
    const existing: any = await kv.get(`ws_project:${wsId}:${pid}`);
    if (!existing) return c.json({ error: 'Project not found' }, 404);
    const updates = await c.req.json();
    const updated = { ...existing, ...updates, id: existing.id, workspace_id: existing.workspace_id, created_at: existing.created_at, updated_at: new Date().toISOString() };
    await kv.set(`ws_project:${wsId}:${pid}`, updated);
    return c.json({ project: updated });
  } catch (e: any) {
    console.log("WS project update error:", e.message);
    return c.json({ error: `WS project update error: ${e.message}` }, 500);
  }
});

app.delete("/make-server-ad34c09a/ws/:id/projects/:pid", async (c) => {
  try {
    const wsId = c.req.param('id');
    const pid = c.req.param('pid');
    const { user, member, error } = await wsAuth(c, wsId);
    if (!user || !member) return c.json({ error: error || 'Unauthorized' }, 401);
    if (member.role !== 'owner' && member.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);
    await kv.del(`ws_project:${wsId}:${pid}`);
    return c.json({ success: true });
  } catch (e: any) {
    console.log("WS project delete error:", e.message);
    return c.json({ error: `WS project delete error: ${e.message}` }, 500);
  }
});

// ─── WS: Site Diary CRUD ──���
app.get("/make-server-ad34c09a/ws/:id/diary", async (c) => {
  try {
    const wsId = c.req.param('id');
    const { user, member, error } = await wsAuth(c, wsId);
    if (!user || !member) return c.json({ error: error || 'Unauthorized' }, 401);
    const entries = await kv.getByPrefix(`ws_diary:${wsId}:`);
    const sorted = (entries || []).sort((a: any, b: any) => new Date(b.date || b.created_at).getTime() - new Date(a.date || a.created_at).getTime());
    return c.json({ entries: sorted });
  } catch (e: any) {
    console.log("WS diary list error:", e.message);
    return c.json({ error: `WS diary list error: ${e.message}` }, 500);
  }
});

app.post("/make-server-ad34c09a/ws/:id/diary", async (c) => {
  try {
    const wsId = c.req.param('id');
    const { user, member, error } = await wsAuth(c, wsId);
    if (!user || !member) return c.json({ error: error || 'Unauthorized' }, 401);
    const { project_id, project_name, date, weather, workers_count, tasks_completed, notes } = await c.req.json();
    if (!project_id || !tasks_completed) return c.json({ error: 'project_id and tasks_completed required' }, 400);
    const did = `diary_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();
    const entry = {
      id: did, workspace_id: wsId, project_id, project_name: project_name || '',
      author_id: member.id, author_name: user.user_metadata?.name || user.email || 'Unknown',
      date: date || now.split('T')[0], weather: weather || '',
      workers_count: workers_count || 0, tasks_completed, notes: notes || '', created_at: now,
    };
    await kv.set(`ws_diary:${wsId}:${did}`, entry);
    return c.json({ entry });
  } catch (e: any) {
    console.log("WS diary create error:", e.message);
    return c.json({ error: `WS diary create error: ${e.message}` }, 500);
  }
});

// ─── WS: Finance CRUD ───
app.get("/make-server-ad34c09a/ws/:id/finance", async (c) => {
  try {
    const wsId = c.req.param('id');
    const { user, member, error } = await wsAuth(c, wsId);
    if (!user || !member) return c.json({ error: error || 'Unauthorized' }, 401);
    if (member.role === 'staff') return c.json({ error: 'Staff cannot access finance' }, 403);
    const entries = await kv.getByPrefix(`ws_finance:${wsId}:`);
    const sorted = (entries || []).sort((a: any, b: any) => new Date(b.date || b.created_at).getTime() - new Date(a.date || a.created_at).getTime());
    return c.json({ entries: sorted });
  } catch (e: any) {
    console.log("WS finance list error:", e.message);
    return c.json({ error: `WS finance list error: ${e.message}` }, 500);
  }
});

app.post("/make-server-ad34c09a/ws/:id/finance", async (c) => {
  try {
    const wsId = c.req.param('id');
    const { user, member, error } = await wsAuth(c, wsId);
    if (!user || !member) return c.json({ error: error || 'Unauthorized' }, 401);
    if (member.role === 'staff') return c.json({ error: 'Staff cannot add finance entries' }, 403);
    const { type, category, amount, description, project_id, date } = await c.req.json();
    if (!type || !amount || !description) return c.json({ error: 'type, amount, description required' }, 400);
    const fid = `fin_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();
    const entry = {
      id: fid, workspace_id: wsId, type, category: category || 'other',
      amount: Number(amount), description, project_id: project_id || '',
      date: date || now.split('T')[0], created_at: now,
    };
    await kv.set(`ws_finance:${wsId}:${fid}`, entry);
    return c.json({ entry });
  } catch (e: any) {
    console.log("WS finance create error:", e.message);
    return c.json({ error: `WS finance create error: ${e.message}` }, 500);
  }
});

// ─── WS: Files CRUD ───
app.get("/make-server-ad34c09a/ws/:id/files", async (c) => {
  try {
    const wsId = c.req.param('id');
    const { user, member, error } = await wsAuth(c, wsId);
    if (!user || !member) return c.json({ error: error || 'Unauthorized' }, 401);
    const entries = await kv.getByPrefix(`ws_file:${wsId}:`);
    const sorted = (entries || []).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return c.json({ files: sorted });
  } catch (e: any) {
    console.log("WS files list error:", e.message);
    return c.json({ error: `WS files list error: ${e.message}` }, 500);
  }
});

app.post("/make-server-ad34c09a/ws/:id/files", async (c) => {
  try {
    const wsId = c.req.param('id');
    const { user, member, error } = await wsAuth(c, wsId);
    if (!user || !member) return c.json({ error: error || 'Unauthorized' }, 401);
    const { name, file_type, url, project_id } = await c.req.json();
    if (!name) return c.json({ error: 'File name required' }, 400);
    const fid = `file_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();
    const file = {
      id: fid, workspace_id: wsId, name, file_type: file_type || 'other',
      url: url || '', project_id: project_id || '', uploaded_by: user.id, created_at: now,
    };
    await kv.set(`ws_file:${wsId}:${fid}`, file);
    return c.json({ file });
  } catch (e: any) {
    console.log("WS file create error:", e.message);
    return c.json({ error: `WS file create error: ${e.message}` }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════
// ████████  SEO — Sitemap, Robots.txt, Google Verification  ████
// ═══════════════════════════════════════════════════════════════

const SEO_DOMAIN = 'https://app.bietalreef.ae';

// All indexable pages for sitemap
const SITEMAP_PAGES = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/home', priority: '1.0', changefreq: 'daily' },
  { loc: '/services', priority: '0.9', changefreq: 'weekly' },
  { loc: '/services/construction-contracting', priority: '0.8', changefreq: 'weekly' },
  { loc: '/services/engineering-consultation', priority: '0.8', changefreq: 'weekly' },
  { loc: '/services/maintenance-companies', priority: '0.8', changefreq: 'weekly' },
  { loc: '/services/craftsmen', priority: '0.8', changefreq: 'weekly' },
  { loc: '/services/workshops', priority: '0.8', changefreq: 'weekly' },
  { loc: '/services/equipment-rental', priority: '0.8', changefreq: 'weekly' },
  { loc: '/services/building-materials', priority: '0.8', changefreq: 'weekly' },
  { loc: '/services/furniture-stores', priority: '0.8', changefreq: 'weekly' },
  { loc: '/services/cleaning-services', priority: '0.8', changefreq: 'weekly' },
  { loc: '/services/plumbing', priority: '0.7', changefreq: 'weekly' },
  { loc: '/services/electricity', priority: '0.7', changefreq: 'weekly' },
  { loc: '/services/ac', priority: '0.7', changefreq: 'weekly' },
  { loc: '/services/painting', priority: '0.7', changefreq: 'weekly' },
  { loc: '/services/construction', priority: '0.7', changefreq: 'weekly' },
  { loc: '/services/carpentry', priority: '0.7', changefreq: 'weekly' },
  { loc: '/services/interior', priority: '0.7', changefreq: 'weekly' },
  { loc: '/services/exterior', priority: '0.7', changefreq: 'weekly' },
  { loc: '/services/consultation', priority: '0.7', changefreq: 'weekly' },
  { loc: '/shop', priority: '0.8', changefreq: 'daily' },
  { loc: '/tools', priority: '0.8', changefreq: 'weekly' },
  { loc: '/maps', priority: '0.7', changefreq: 'weekly' },
  { loc: '/weyaak', priority: '0.7', changefreq: 'weekly' },
  { loc: '/projects', priority: '0.6', changefreq: 'weekly' },
  { loc: '/rfq', priority: '0.7', changefreq: 'weekly' },
  { loc: '/platform', priority: '0.7', changefreq: 'monthly' },
  { loc: '/marketplace', priority: '0.7', changefreq: 'daily' },
  { loc: '/offers', priority: '0.7', changefreq: 'daily' },
  { loc: '/recommendations', priority: '0.6', changefreq: 'weekly' },
];

const SEO_CITY_SLUGS = ['dubai', 'abu-dhabi', 'al-ain', 'sharjah', 'ajman', 'ras-al-khaimah', 'umm-al-quwain', 'fujairah'];
const SEO_SERVICE_SLUGS = [
  'construction-contracting', 'engineering-consultation', 'maintenance-companies',
  'craftsmen', 'workshops', 'equipment-rental', 'building-materials',
  'furniture-stores', 'cleaning-services',
];

// ─── Google Site Verification HTML File ───
app.get("/make-server-ad34c09a/google72137e288e2b5848.html", (c) => {
  return c.html('google-site-verification: google72137e288e2b5848.html');
});

// ─── Robots.txt ───
app.get("/make-server-ad34c09a/robots.txt", (c) => {
  const robotsTxt = `User-agent: *
Allow: /
Allow: /home
Allow: /services
Allow: /services/*
Allow: /shop
Allow: /tools
Allow: /maps
Allow: /weyaak
Allow: /projects
Allow: /rfq
Allow: /platform
Allow: /marketplace
Allow: /offers
Allow: /recommendations

Disallow: /profile
Disallow: /wallet
Disallow: /admin

# Sitemaps
Sitemap: ${SEO_DOMAIN}/sitemap.xml

# Host
Host: ${SEO_DOMAIN}
`;
  return new Response(robotsTxt, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
  });
});

// ─── Sitemap.xml ───
app.get("/make-server-ad34c09a/sitemap.xml", (c) => {
  const today = new Date().toISOString().split('T')[0];

  let urls = SITEMAP_PAGES.map(p => `
  <url>
    <loc>${SEO_DOMAIN}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('');

  // Add city-specific service pages (9 services × 8 cities = 72 URLs)
  for (const svc of SEO_SERVICE_SLUGS) {
    for (const city of SEO_CITY_SLUGS) {
      urls += `
  <url>
    <loc>${SEO_DOMAIN}/services/${svc}/${city}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
});

// ═══════════════════════════════════════════════════════════════
// ████████████  ONBOARDING SYSTEM  ██████████████████████████████
// ═══════════════════════════════════════════════════════════════

function generateDisplayId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'BR-';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const VERIFICATION_BUCKET = 'make-ad34c09a-verification';
const GALLERY_BUCKET = 'make-ad34c09a-gallery';

async function initOnboardingStorage() {
  try {
    const supabase = adminClient();
    const { data: buckets } = await supabase.storage.listBuckets();
    for (const bn of [VERIFICATION_BUCKET, GALLERY_BUCKET]) {
      const exists = buckets?.some((b: any) => b.name === bn);
      if (!exists) { await supabase.storage.createBucket(bn, { public: false }); console.log(`Bucket '${bn}' created`); }
    }
  } catch (e: any) { console.log(`Onboarding storage init: ${e.message}`); }
}
initOnboardingStorage();

app.get("/make-server-ad34c09a/onboarding/status", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error: ${authError}` }, 401);
    const profile: any = await kv.get(`profile:${user.id}`);
    return c.json({
      completed: profile?.onboarding_completed === true,
      role: profile?.role || null,
      provider_type: profile?.provider_type || null,
      display_id: profile?.display_id || null,
      subscription_plan: profile?.subscription_plan || null,
    });
  } catch (e: any) { return c.json({ error: `Onboarding status error: ${e.message}` }, 500); }
});

app.post("/make-server-ad34c09a/onboarding/complete", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error: ${authError}` }, 401);
    const body = await c.req.json();
    const {
      role, provider_type, subscription_plan, city, phone,
      business_name, business_name_en, specialties, preferred_language,
      full_name, whatsapp, bio, emirate, district,
      verification_method, uae_pass_verified,
      years_experience, service_emirates, residence, sponsor_company,
      previous_works, social_links,
      num_workers, general_specialization, specific_specialization,
      has_trade_license, has_classification_cert,
      has_emirates_id_front, has_emirates_id_back,
    } = body;
    if (!role || !['client', 'provider'].includes(role)) return c.json({ error: 'Invalid role' }, 400);

    let displayId = generateDisplayId();
    let existing = await kv.get(`display_id:${displayId}`);
    let attempts = 0;
    while (existing && attempts < 10) { displayId = generateDisplayId(); existing = await kv.get(`display_id:${displayId}`); attempts++; }

    const existingProfile: any = await kv.get(`profile:${user.id}`) || {};
    const now = new Date();
    const trialExpires = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
    const plan = subscription_plan || 'free_trial';

    // Determine verification status
    let verificationStatus = 'none';
    if (verification_method === 'uae_pass' && uae_pass_verified) {
      verificationStatus = 'approved';
    } else if (verification_method === 'id_upload' && (has_emirates_id_front || has_emirates_id_back)) {
      verificationStatus = 'pending';
    }

    const updatedProfile: any = {
      ...existingProfile, role, display_id: displayId, onboarding_completed: true,
      full_name: full_name || existingProfile.full_name || '',
      phone: phone || '', whatsapp: whatsapp || phone || '', bio: bio || '',
      emirate: emirate || '', city: city || '', district: district || '',
      verification_method: verification_method || 'none',
      verification_status: verificationStatus,
      uae_pass_verified: uae_pass_verified || false,
      verification_submitted_at: verification_method !== 'none' ? now.toISOString() : null,
      preferred_language: preferred_language || 'ar',
      subscription_plan: plan, subscription_started: now.toISOString(),
      subscription_expires: plan === 'free_trial' ? trialExpires.toISOString() : null,
      is_trial: plan === 'free_trial',
      followers_count: existingProfile.followers_count || 0,
      following_count: existingProfile.following_count || 0,
      updated_at: now.toISOString(),
    };

    if (role === 'provider') {
      updatedProfile.provider_type = provider_type || 'craftsman';
      updatedProfile.business_name = business_name || '';
      updatedProfile.business_name_en = business_name_en || '';
      updatedProfile.specialties = specialties || [];
      updatedProfile.years_experience = years_experience || 0;
      updatedProfile.service_emirates = service_emirates || [];
      updatedProfile.residence = residence || '';
      updatedProfile.sponsor_company = sponsor_company || '';
      updatedProfile.previous_works = previous_works || [];
      updatedProfile.social_links = social_links || {};
      updatedProfile.projects_count = 0;
      updatedProfile.completion_rate = 0;
      updatedProfile.gallery_images = [];
      if (provider_type === 'company') {
        updatedProfile.num_workers = num_workers || 0;
        updatedProfile.general_specialization = general_specialization || '';
        updatedProfile.specific_specialization = specific_specialization || '';
      }
      if (sponsor_company) updatedProfile.noc_status = 'pending';
    }

    await kv.set(`profile:${user.id}`, updatedProfile);
    await kv.set(`display_id:${displayId}`, user.id);

    const supabase = adminClient();
    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: { role, display_id: displayId, onboarding_completed: true, full_name: updatedProfile.full_name, verification_status: verificationStatus }
    });

    // Notifications based on verification status
    if (verificationStatus === 'pending') {
      await createNotification(user.id, {
        category: 'platform', titleAr: 'تم إرسال بياناتك للمراجعة', titleEn: 'Data submitted for review',
        messageAr: `معرفك: ${displayId}. سيتم مراجعة بياناتك خلال 24 إلى 48 ساعة.`,
        messageEn: `ID: ${displayId}. Your data will be reviewed within 24-48 hours.`, icon: 'clock',
      });
    } else if (verificationStatus === 'approved') {
      await createNotification(user.id, {
        category: 'platform', titleAr: 'تم توثيق حسابك!', titleEn: 'Account verified!',
        messageAr: `معرفك: ${displayId}. تم توثيق هويتك عبر UAE Pass.`,
        messageEn: `ID: ${displayId}. Verified via UAE Pass.`, icon: 'shield-check',
      });
    } else {
      await createNotification(user.id, {
        category: 'platform', titleAr: 'تم إعداد حسابك بنجاح!', titleEn: 'Account setup complete!',
        messageAr: `معرفك: ${displayId}. يمكنك توثيق هويتك لاحقاً من الإعدادات.`,
        messageEn: `ID: ${displayId}. Verify your identity later from Settings.`, icon: 'check-circle',
      });
    }

    await sendWelcomeNotifications(user.id, updatedProfile.full_name);

    if (role === 'provider' && sponsor_company) {
      await createNotification(user.id, {
        category: 'platform', titleAr: 'شهادة عدم الممانعة (NOC)', titleEn: 'No Objection Certificate (NOC)',
        messageAr: `تم إنشاء شهادة عدم ممانعة باسم "${sponsor_company}". حمّلها، وقّعها واختمها، ثم ارفعها.`,
        messageEn: `NOC generated for "${sponsor_company}". Download, sign, stamp, and re-upload.`,
        icon: 'file-text', actionTarget: '/profile',
      });
    }

    console.log(`Onboarding done: user=${user.id}, role=${role}, id=${displayId}, verification=${verificationStatus}`);
    return c.json({ success: true, display_id: displayId, user_id: user.id, profile: updatedProfile });
  } catch (e: any) { return c.json({ error: `Onboarding error: ${e.message}` }, 500); }
});

// ═══════════════════════════════════════════════════════════════
// ████████████  VERIFICATION FILE UPLOAD  ████████████████████████
// ═══════════════════════════════════════════════════════════════

// VERIFICATION_BUCKET already declared above with initOnboardingStorage()

app.post("/make-server-ad34c09a/verification/upload", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth: ${authError}` }, 401);

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('type') as string;

    if (!file || !fileType) return c.json({ error: 'File and type are required' }, 400);

    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `${user.id}/${fileType}.${ext}`;

    const sb = adminClient();
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadErr } = await sb.storage
      .from(VERIFICATION_BUCKET)
      .upload(filePath, arrayBuffer, { contentType: file.type, upsert: true });

    if (uploadErr) {
      console.log(`Upload error for ${fileType}:`, uploadErr.message);
      return c.json({ error: `Upload failed: ${uploadErr.message}` }, 500);
    }

    // Update profile with file URL
    const profile: any = await kv.get(`profile:${user.id}`) || {};
    const urlKey = `${fileType}_url`;
    profile[urlKey] = filePath;
    await kv.set(`profile:${user.id}`, profile);

    console.log(`File uploaded: ${filePath} for user ${user.id}`);
    return c.json({ success: true, path: filePath });
  } catch (e: any) {
    console.log(`Verification upload error: ${e.message}`);
    return c.json({ error: `Upload error: ${e.message}` }, 500);
  }
});

app.get("/make-server-ad34c09a/verification/status", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth: ${authError}` }, 401);

    const profile: any = await kv.get(`profile:${user.id}`) || {};
    return c.json({
      verification_status: profile.verification_status || 'none',
      verification_method: profile.verification_method || 'none',
      noc_status: profile.noc_status || null,
      submitted_at: profile.verification_submitted_at || null,
    });
  } catch (e: any) { return c.json({ error: `Status error: ${e.message}` }, 500); }
});

// n8n webhook callback — approve/reject verification
app.post("/make-server-ad34c09a/verification/webhook", async (c) => {
  try {
    const body = await c.req.json();
    const { user_id, action, reason } = body;
    if (!user_id || !action) return c.json({ error: 'user_id and action required' }, 400);

    const profile: any = await kv.get(`profile:${user_id}`);
    if (!profile) return c.json({ error: 'Profile not found' }, 404);

    if (action === 'approve') {
      profile.verification_status = 'approved';
      profile.is_verified = true;
      await kv.set(`profile:${user_id}`, profile);
      const sb = adminClient();
      await sb.auth.admin.updateUserById(user_id, {
        user_metadata: { is_verified: true, verification_status: 'approved' }
      });
      await createNotification(user_id, {
        category: 'platform', titleAr: 'تم توثيق حسابك!', titleEn: 'Account Verified!',
        messageAr: 'مبارك! تم توثيق حسابك بنجاح. يمكنك الآن الاستفادة من جميع المميزات.',
        messageEn: 'Congratulations! Your account is now verified. Enjoy all features.',
        icon: 'shield-check',
      });
    } else if (action === 'reject') {
      profile.verification_status = 'rejected';
      await kv.set(`profile:${user_id}`, profile);
      await createNotification(user_id, {
        category: 'platform', titleAr: 'طلب التوثيق مرفوض', titleEn: 'Verification Rejected',
        messageAr: `نعتذر، تم رفض طلب التوثيق. السبب: ${reason || 'يرجى مراجعة بياناتك'}`,
        messageEn: `Sorry, verification rejected. Reason: ${reason || 'Please review your data'}`,
        icon: 'alert-circle',
      });
    }

    console.log(`Verification ${action} for user ${user_id}`);
    return c.json({ success: true });
  } catch (e: any) { return c.json({ error: `Webhook error: ${e.message}` }, 500); }
});

// ─── Public Profile ───
app.get("/make-server-ad34c09a/public-profile/:id", async (c) => {
  try {
    const id = c.req.param('id');
    let userId = id;
    if (id.startsWith('BR-')) {
      const resolved = await kv.get(`display_id:${id}`);
      if (!resolved) return c.json({ error: 'User not found' }, 404);
      userId = resolved as string;
    }
    const profile: any = await kv.get(`profile:${userId}`);
    if (!profile) return c.json({ error: 'Profile not found' }, 404);

    const pub: any = {
      id: userId, display_id: profile.display_id, role: profile.role,
      full_name: profile.full_name, avatar_url: profile.avatar_url, city: profile.city,
      is_verified: profile.is_verified || profile.verification_status === 'approved',
      followers_count: profile.followers_count || 0, following_count: profile.following_count || 0,
    };
    if (profile.role === 'provider') {
      Object.assign(pub, {
        provider_type: profile.provider_type, business_name: profile.business_name,
        specialties: profile.specialties || [], service_area: profile.service_area,
        about: profile.about, projects_count: profile.projects_count,
        completion_rate: profile.completion_rate, gallery_images: profile.gallery_images || [],
        social_links: profile.social_links || {},
      });
    }
    return c.json(pub);
  } catch (e: any) { return c.json({ error: `Public profile error: ${e.message}` }, 500); }
});

// ─── Follow System ───
app.post("/make-server-ad34c09a/follow", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth: ${authError}` }, 401);
    const { target_id } = await c.req.json();
    if (!target_id || target_id === user.id) return c.json({ error: 'Invalid target' }, 400);
    const fk = `follow:${user.id}:${target_id}`;
    if (await kv.get(fk)) return c.json({ success: true });
    await kv.set(fk, { created_at: new Date().toISOString() });
    const mp: any = await kv.get(`profile:${user.id}`) || {};
    const tp: any = await kv.get(`profile:${target_id}`) || {};
    mp.following_count = (mp.following_count || 0) + 1;
    tp.followers_count = (tp.followers_count || 0) + 1;
    await kv.set(`profile:${user.id}`, mp);
    await kv.set(`profile:${target_id}`, tp);
    await createNotification(target_id, { category: 'platform', titleAr: 'متابع جديد', titleEn: 'New Follower', messageAr: `${mp.full_name || 'مستخدم'} بدأ بمتابعتك`, messageEn: `${mp.full_name || 'User'} followed you`, icon: 'user-plus' });
    return c.json({ success: true });
  } catch (e: any) { return c.json({ error: `Follow error: ${e.message}` }, 500); }
});

app.delete("/make-server-ad34c09a/follow", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth: ${authError}` }, 401);
    const { target_id } = await c.req.json();
    if (!target_id) return c.json({ error: 'target_id required' }, 400);
    await kv.del(`follow:${user.id}:${target_id}`);
    const mp: any = await kv.get(`profile:${user.id}`) || {};
    const tp: any = await kv.get(`profile:${target_id}`) || {};
    mp.following_count = Math.max((mp.following_count || 1) - 1, 0);
    tp.followers_count = Math.max((tp.followers_count || 1) - 1, 0);
    await kv.set(`profile:${user.id}`, mp);
    await kv.set(`profile:${target_id}`, tp);
    return c.json({ success: true });
  } catch (e: any) { return c.json({ error: `Unfollow error: ${e.message}` }, 500); }
});

app.get("/make-server-ad34c09a/follow/check/:targetId", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth: ${authError}` }, 401);
    return c.json({ is_following: !!(await kv.get(`follow:${user.id}:${c.req.param('targetId')}`)) });
  } catch (e: any) { return c.json({ error: e.message }, 500); }
});

// ─── Messaging ───
app.post("/make-server-ad34c09a/conversations", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth: ${authError}` }, 401);
    const { other_user_id, initial_message } = await c.req.json();
    if (!other_user_id) return c.json({ error: 'other_user_id required' }, 400);
    const ids = [user.id, other_user_id].sort();
    const convoId = `conv_${ids[0].slice(0,8)}_${ids[1].slice(0,8)}`;
    const now = new Date().toISOString();
    let convo: any = await kv.get(`conversation:${convoId}`);
    if (!convo) {
      convo = { id: convoId, participants: ids, created_at: now, updated_at: now, last_message: '', last_sender_id: '' };
      await kv.set(`conversation:${convoId}`, convo);
      await kv.set(`user_convos:${user.id}:${convoId}`, { other_user_id, unread: 0 });
      await kv.set(`user_convos:${other_user_id}:${convoId}`, { other_user_id: user.id, unread: 0 });
    }
    if (initial_message) {
      const msgId = `msg_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
      await kv.set(`msg:${convoId}:${msgId}`, { id: msgId, sender_id: user.id, text: initial_message, translated_text: null, read: false, created_at: now });
      convo.last_message = initial_message; convo.last_sender_id = user.id; convo.updated_at = now;
      await kv.set(`conversation:${convoId}`, convo);
      const oi: any = await kv.get(`user_convos:${other_user_id}:${convoId}`) || {};
      oi.unread = (oi.unread || 0) + 1; oi.other_user_id = user.id;
      await kv.set(`user_convos:${other_user_id}:${convoId}`, oi);
    }
    return c.json({ success: true, conversation_id: convoId });
  } catch (e: any) { return c.json({ error: `Conv error: ${e.message}` }, 500); }
});

app.get("/make-server-ad34c09a/conversations", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth: ${authError}` }, 401);
    const indexes = await kv.getByPrefix(`user_convos:${user.id}:`);
    const convos: any[] = [];
    for (const idx of (indexes || [])) {
      const d = idx as any;
      if (!d.other_user_id) continue;
      const op: any = await kv.get(`profile:${d.other_user_id}`);
      const ids = [user.id, d.other_user_id].sort();
      const cid = `conv_${ids[0].slice(0,8)}_${ids[1].slice(0,8)}`;
      const cv: any = await kv.get(`conversation:${cid}`);
      convos.push({ conversation_id: cid, other_user: { id: d.other_user_id, full_name: op?.full_name || 'مستخدم', avatar_url: op?.avatar_url || '', display_id: op?.display_id || '', role: op?.role || 'client' }, last_message: cv?.last_message || '', updated_at: cv?.updated_at || '', unread: d.unread || 0 });
    }
    convos.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    return c.json({ conversations: convos });
  } catch (e: any) { return c.json({ error: `List convos error: ${e.message}` }, 500); }
});

app.get("/make-server-ad34c09a/messages/:convoId", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth: ${authError}` }, 401);
    const convoId = c.req.param('convoId');
    const msgs = await kv.getByPrefix(`msg:${convoId}:`);
    const sorted = (msgs || []).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    const mi: any = await kv.get(`user_convos:${user.id}:${convoId}`);
    if (mi) { mi.unread = 0; await kv.set(`user_convos:${user.id}:${convoId}`, mi); }
    return c.json({ messages: sorted });
  } catch (e: any) { return c.json({ error: `Messages error: ${e.message}` }, 500); }
});

app.post("/make-server-ad34c09a/messages/:convoId", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth: ${authError}` }, 401);
    const convoId = c.req.param('convoId');
    const { text } = await c.req.json();
    if (!text) return c.json({ error: 'text required' }, 400);
    const now = new Date().toISOString();
    const msgId = `msg_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
    const msg = { id: msgId, sender_id: user.id, text, translated_text: null, read: false, created_at: now };
    await kv.set(`msg:${convoId}:${msgId}`, msg);
    const cv: any = await kv.get(`conversation:${convoId}`);
    if (cv) {
      cv.last_message = text; cv.last_sender_id = user.id; cv.updated_at = now;
      await kv.set(`conversation:${convoId}`, cv);
      const oid = cv.participants.find((p: string) => p !== user.id);
      if (oid) { const oi: any = await kv.get(`user_convos:${oid}:${convoId}`) || {}; oi.unread = (oi.unread||0)+1; oi.other_user_id = user.id; await kv.set(`user_convos:${oid}:${convoId}`, oi); }
    }
    return c.json({ success: true, message: msg });
  } catch (e: any) { return c.json({ error: `Send msg error: ${e.message}` }, 500); }
});

// ─── Subscription ───
app.post("/make-server-ad34c09a/subscription/activate", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth: ${authError}` }, 401);
    const { plan } = await c.req.json();
    if (!plan || !['free_trial','basic','pro','enterprise'].includes(plan)) return c.json({ error: 'Invalid plan' }, 400);
    const now = new Date();
    const p: any = await kv.get(`profile:${user.id}`) || {};
    p.subscription_plan = plan;
    p.subscription_started = now.toISOString();
    p.is_trial = plan === 'free_trial';
    p.subscription_expires = plan === 'free_trial' ? new Date(now.getTime()+15*24*60*60*1000).toISOString() : null;
    await kv.set(`profile:${user.id}`, p);
    await kv.set(`plan_history:${user.id}:${Date.now()}`, { plan, action: 'activated', created_at: now.toISOString() });
    return c.json({ success: true, subscription: { plan, expires: p.subscription_expires } });
  } catch (e: any) { return c.json({ error: `Sub error: ${e.message}` }, 500); }
});

// ─── Providers listing ───
app.get("/make-server-ad34c09a/providers", async (c) => {
  try {
    const specialty = c.req.query('specialty');
    const city = c.req.query('city');
    const all = await kv.getByPrefix('profile:');
    const providers = (all || []).filter((p: any) => {
      if (p.role !== 'provider' || !p.onboarding_completed) return false;
      if (specialty && p.specialties && !p.specialties.some((s: string) => s.includes(specialty))) return false;
      if (city && p.city && !p.city.includes(city)) return false;
      return true;
    }).map((p: any) => ({
      id: p.id || '', display_id: p.display_id, full_name: p.full_name, business_name: p.business_name,
      avatar_url: p.avatar_url, city: p.city, provider_type: p.provider_type,
      specialties: p.specialties || [], is_verified: p.is_verified || p.verification_status === 'approved',
      projects_count: p.projects_count || 0, followers_count: p.followers_count || 0,
    }));
    return c.json({ providers });
  } catch (e: any) { return c.json({ error: `Providers error: ${e.message}` }, 500); }
});

// ═══════════════════════════════════════════════════════════════
// ████████████  STRIPE PAYMENTS & SUBSCRIPTIONS  ████████████████
// ═══════════════════════════════════════════════════════════════

function getStripe() {
  const key = Deno.env.get('STRIPE_SECRET_KEY') || '';
  if (!key) return null;
  return { key, headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' }, api: 'https://api.stripe.com/v1' };
}

const PLAN_PRICES: Record<string, { monthly: number; yearly: number; name_ar: string; name_en: string }> = {
  pro: { monthly: 299, yearly: 2990, name_ar: 'باقة احترافية', name_en: 'Pro Plan' },
  enterprise: { monthly: 999, yearly: 9990, name_ar: 'باقة مؤسسات', name_en: 'Enterprise Plan' },
};

app.post("/make-server-ad34c09a/stripe/create-checkout", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error: ${authError}` }, 401);
    const stripe = getStripe();
    if (!stripe) return c.json({ error: 'Stripe not configured. Add STRIPE_SECRET_KEY.' }, 500);
    const { plan, period, success_url, cancel_url } = await c.req.json();
    if (!plan || !PLAN_PRICES[plan]) return c.json({ error: `Invalid plan: ${plan}` }, 400);
    const planInfo = PLAN_PRICES[plan];
    const amount = period === 'yearly' ? planInfo.yearly : planInfo.monthly;
    const params = new URLSearchParams({
      'mode': 'payment', 'payment_method_types[0]': 'card',
      'line_items[0][price_data][currency]': 'aed',
      'line_items[0][price_data][unit_amount]': String(amount * 100),
      'line_items[0][price_data][product_data][name]': `${planInfo.name_en} — ${planInfo.name_ar}`,
      'line_items[0][price_data][product_data][description]': `Beit Al Reef ${plan} ${period || 'monthly'}`,
      'line_items[0][quantity]': '1', 'customer_email': user.email || '',
      'client_reference_id': user.id, 'metadata[user_id]': user.id,
      'metadata[plan]': plan, 'metadata[period]': period || 'monthly',
      'success_url': success_url || 'https://app.bietalreef.ae/subscriptions?success=true',
      'cancel_url': cancel_url || 'https://app.bietalreef.ae/subscriptions?cancelled=true',
    });
    const res = await fetch(`${stripe.api}/checkout/sessions`, { method: 'POST', headers: stripe.headers, body: params.toString() });
    const session = await res.json();
    if (session.error) return c.json({ error: `Stripe: ${session.error.message}` }, 400);
    console.log(`Stripe checkout: user ${user.id}, plan ${plan}, session ${session.id}`);
    return c.json({ checkout_url: session.url, session_id: session.id });
  } catch (e: any) { console.log("Stripe checkout error:", e.message); return c.json({ error: e.message }, 500); }
});

app.post("/make-server-ad34c09a/stripe/verify-payment", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth: ${authError}` }, 401);
    const stripe = getStripe();
    if (!stripe) return c.json({ error: 'Stripe not configured.' }, 500);
    const { session_id } = await c.req.json();
    if (!session_id) return c.json({ error: 'Missing session_id' }, 400);
    const res = await fetch(`${stripe.api}/checkout/sessions/${session_id}`, { headers: stripe.headers });
    const session = await res.json();
    if (session.error) return c.json({ error: session.error.message }, 400);
    if (session.payment_status !== 'paid') return c.json({ error: 'Payment not completed', status: session.payment_status }, 400);
    if (session.client_reference_id !== user.id && session.metadata?.user_id !== user.id) return c.json({ error: 'Unauthorized' }, 403);
    const plan = session.metadata?.plan || 'pro';
    const period = session.metadata?.period || 'monthly';
    const now = new Date(); const expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + (period === 'yearly' ? 12 : 1));
    const subscription = { plan, period, status: 'active', stripe_session_id: session_id, stripe_payment_intent: session.payment_intent, amount_paid: session.amount_total, currency: session.currency, started_at: now.toISOString(), expires_at: expiresAt.toISOString() };
    await kv.set(`subscription:${user.id}`, subscription);
    const supabase = adminClient();
    await supabase.auth.admin.updateUserById(user.id, { user_metadata: { tier: plan, subscription_plan: plan, subscription_expires: expiresAt.toISOString() } });
    await createNotification(user.id, { category: 'platform', titleAr: `تم تفعيل ${PLAN_PRICES[plan]?.name_ar}!`, titleEn: `${PLAN_PRICES[plan]?.name_en} activated!`, messageAr: 'مبروك! اشتراكك فعّال.', messageEn: 'Your subscription is now active.', icon: 'crown' });
    console.log(`Subscription: user ${user.id}, plan ${plan}, expires ${expiresAt.toISOString()}`);
    return c.json({ success: true, subscription });
  } catch (e: any) { console.log("Stripe verify error:", e.message); return c.json({ error: e.message }, 500); }
});

app.get("/make-server-ad34c09a/subscription/status", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth: ${authError}` }, 401);
    const sub: any = await kv.get(`subscription:${user.id}`);
    if (!sub) return c.json({ plan: 'free', status: 'trial', is_trial: true, trial_days_left: 15 });
    const now = new Date(); const expiresAt = new Date(sub.expires_at);
    const isExpired = now > expiresAt;
    if (isExpired && sub.status === 'active') { sub.status = 'expired'; await kv.set(`subscription:${user.id}`, sub); }
    return c.json({ plan: sub.plan, status: sub.status, period: sub.period, started_at: sub.started_at, expires_at: sub.expires_at, is_expired: isExpired, days_left: isExpired ? 0 : Math.ceil((expiresAt.getTime() - now.getTime()) / (1000*60*60*24)) });
  } catch (e: any) { return c.json({ error: e.message }, 500); }
});

// ─── Onboarding Status ───
app.get("/make-server-ad34c09a/onboarding/status", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ completed: true });
    const profile: any = await kv.get(`profile:${user.id}`);
    const metadata = user.user_metadata || {};
    return c.json({ completed: metadata.onboarding_completed === true || profile?.onboarding_completed === true, role: metadata.role || profile?.role || null, tier: metadata.tier || profile?.tier || 'free' });
  } catch (e: any) { return c.json({ completed: true }); }
});

// ─── Smart UI Context ───
app.get("/make-server-ad34c09a/user/context", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ isGuest: true, tier: 'guest', features: { canBrowse: true, canSearch: true, canViewProviders: true, canContactProviders: false, canCreateProject: false, canUseTools: false, canAccessWorkspace: false, maxDocuments: 0, aiCredits: 0 } });
    const metadata = user.user_metadata || {};
    const profile: any = await kv.get(`profile:${user.id}`) || {};
    const sub: any = await kv.get(`subscription:${user.id}`);
    const tier = sub?.plan || metadata.tier || profile.tier || profile.subscription_plan || 'free';
    const role = profile.role || metadata.role || 'client';
    const isVerified = profile.is_verified || profile.verification_status === 'approved' || metadata.is_verified || false;
    const onboardingDone = profile.onboarding_completed || metadata.onboarding_completed || false;
    return c.json({
      isGuest: false, userId: user.id, email: user.email,
      name: profile.full_name || metadata.full_name || metadata.name || '',
      avatar: profile.avatar_url || metadata.avatar_url || '',
      role, tier, isVerified, onboardingCompleted: onboardingDone,
      displayId: profile.display_id || metadata.display_id || '',
      phone: profile.phone || '', emirate: profile.emirate || '', city: profile.city || '',
      subscription: sub
        ? { plan: sub.plan, status: sub.status, expiresAt: sub.expires_at }
        : (profile.subscription_plan
          ? { plan: profile.subscription_plan, status: profile.is_trial ? 'trial' : 'active', expiresAt: profile.subscription_expires || null }
          : { plan: 'free', status: 'free' }),
      features: {
        canBrowse: true, canSearch: true, canViewProviders: true,
        canContactProviders: tier !== 'guest',
        canCreateProject: isVerified || ['pro','enterprise'].includes(tier),
        canUseTools: true,
        canAccessWorkspace: onboardingDone && ['client','provider','admin'].includes(role),
        canListBusiness: role === 'provider',
        maxDocuments: ['pro','enterprise'].includes(tier) ? -1 : 5,
        aiCredits: tier === 'enterprise' ? 5000 : tier === 'pro' ? 500 : 50,
        canExport: ['pro','enterprise'].includes(tier),
        canCustomBrand: tier === 'enterprise',
        canAdvancedAnalytics: ['pro','enterprise'].includes(tier),
      },
    });
  } catch (e: any) { return c.json({ isGuest: true, tier: 'guest', features: { canBrowse: true } }, 500); }
});

// ═══════════════════════════════════════════════════════════════
//  PHASE 1–3: Identity Separation + Presence
// ═══════════════════════════════════════════════════════════════

const IDENTITY_PAGE_SIZE = 20;

// ── Helper: seed marketplace_profile from legacy profile ──
// STRICT SEED-ONCE RULE:
//   1. If marketplace_profile:{userId} already exists → return it, NEVER overwrite.
//   2. Only seeds when key is completely missing.
//   3. Sets seeded_from_legacy=true as immutable flag.
async function seedMarketplaceProfile(userId: string): Promise<any> {
  const existing = await kv.get(`marketplace_profile:${userId}`);
  if (existing) return existing; // EXISTS → return as-is, never re-seed
  // ── First-time seed from legacy profile:{userId} ──
  const legacy: any = await kv.get(`profile:${userId}`) || {};
  let meta: any = {};
  try {
    const sb = adminClient();
    const { data } = await sb.auth.admin.getUserById(userId);
    meta = data?.user?.user_metadata || {};
  } catch (e: any) {
    console.log(`seedMarketplaceProfile: getUserById failed for ${userId}: ${e.message}`);
  }
  const now = new Date().toISOString();
  const mp = {
    user_id: userId,
    seeded_from_legacy: true, // immutable flag — this profile was auto-seeded once
    full_name: legacy.full_name || meta.full_name || meta.name || '',
    avatar_url: legacy.avatar_url || meta.avatar_url || '',
    bio: legacy.bio || legacy.about || '',
    role: legacy.role || meta.role || 'client',
    is_verified: legacy.is_verified || meta.is_verified || false,
    city: legacy.city || legacy.emirate || '',
    region: legacy.district || '',
    provider_type: legacy.provider_type || null,
    business_name: legacy.business_name || '',
    specialties: legacy.specialties || [],
    public_settings: {},
    created_at: legacy.created_at || now,
    updated_at: now,
  };
  await kv.set(`marketplace_profile:${userId}`, mp);
  const fc = await kv.get(`followers_count:${userId}`);
  if (fc === null || fc === undefined) await kv.set(`followers_count:${userId}`, 0);
  const fgc = await kv.get(`following_count:${userId}`);
  if (fgc === null || fgc === undefined) await kv.set(`following_count:${userId}`, 0);
  console.log(`[SEED-ONCE] marketplace_profile created for ${userId} (seeded_from_legacy=true)`);
  return mp;
}

// ── 1. Marketplace Profile: GET (public) ──
app.get("/make-server-ad34c09a/marketplace-profile/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    if (!userId) return c.json({ error: 'userId required' }, 400);
    const mp = await seedMarketplaceProfile(userId);
    const followersCount = (await kv.get(`followers_count:${userId}`)) || 0;
    const followingCount = (await kv.get(`following_count:${userId}`)) || 0;
    let relationship = null;
    const { user } = await authUser(c);
    if (user && user.id !== userId) {
      const rel: any = await kv.get(`rel:${user.id}:${userId}`);
      relationship = rel || null;
    }
    return c.json({
      profile: mp,
      counts: { followers: followersCount, following: followingCount },
      relationship,
      is_self: user?.id === userId,
    });
  } catch (e: any) {
    console.log(`marketplace-profile GET error: ${e.message}`);
    return c.json({ error: e.message }, 500);
  }
});

// ── 2. Marketplace Profile: PUT (owner only) ──
app.put("/make-server-ad34c09a/marketplace-profile", async (c) => {
  try {
    const { user, error: authErr } = await authUser(c);
    if (!user) return c.json({ error: authErr || 'Unauthorized' }, 401);
    const updates = await c.req.json();
    let mp: any = await kv.get(`marketplace_profile:${user.id}`);
    if (!mp) mp = await seedMarketplaceProfile(user.id);
    const allowed = ['full_name', 'avatar_url', 'bio', 'city', 'region', 'business_name', 'specialties', 'public_settings'];
    for (const key of allowed) {
      if (updates[key] !== undefined) mp[key] = updates[key];
    }
    mp.updated_at = new Date().toISOString();
    await kv.set(`marketplace_profile:${user.id}`, mp);
    return c.json({ profile: mp });
  } catch (e: any) {
    console.log(`marketplace-profile PUT error: ${e.message}`);
    return c.json({ error: e.message }, 500);
  }
});

// ── 3. Workspace Identity: GET my identity ──
app.get("/make-server-ad34c09a/ws-identity/:wsId/me", async (c) => {
  try {
    const wsId = c.req.param('wsId');
    const { user, member, error } = await wsAuth(c, wsId);
    if (!user || !member) return c.json({ error: error || 'Unauthorized' }, 401);
    const identity = {
      ...member,
      workspace_display_name: member.workspace_display_name || member.full_name || '',
      workspace_avatar_url: member.workspace_avatar_url || '',
      last_active_at: member.last_active_at || null,
    };
    return c.json({ identity });
  } catch (e: any) {
    console.log(`ws-identity GET me error: ${e.message}`);
    return c.json({ error: e.message }, 500);
  }
});

// ── 4. Workspace Identity: PUT my identity ──
app.put("/make-server-ad34c09a/ws-identity/:wsId/me", async (c) => {
  try {
    const wsId = c.req.param('wsId');
    const { user, member, error } = await wsAuth(c, wsId);
    if (!user || !member) return c.json({ error: error || 'Unauthorized' }, 401);
    const updates = await c.req.json();
    const allowed = ['workspace_display_name', 'workspace_avatar_url'];
    const memberKey = `ws_member:${wsId}:${member.id}`;
    const current: any = await kv.get(memberKey);
    if (!current) return c.json({ error: 'Member record not found' }, 404);
    for (const key of allowed) {
      if (updates[key] !== undefined) current[key] = updates[key];
    }
    current.last_active_at = new Date().toISOString();
    await kv.set(memberKey, current);
    return c.json({ identity: current });
  } catch (e: any) {
    console.log(`ws-identity PUT me error: ${e.message}`);
    return c.json({ error: e.message }, 500);
  }
});

// ── 5. Workspace Identity: GET member by userId ──
app.get("/make-server-ad34c09a/ws-identity/:wsId/user/:targetUserId", async (c) => {
  try {
    const wsId = c.req.param('wsId');
    const targetUserId = c.req.param('targetUserId');
    const { user, member, error } = await wsAuth(c, wsId);
    if (!user || !member) return c.json({ error: error || 'Unauthorized' }, 401);
    const allMembers = await kv.getByPrefix(`ws_member:${wsId}:`) || [];
    const targetMember = allMembers.find((m: any) => m.user_id === targetUserId);
    if (!targetMember) return c.json({ error: 'User not found in this workspace' }, 404);
    return c.json({
      identity: {
        ...targetMember,
        workspace_display_name: targetMember.workspace_display_name || targetMember.full_name || '',
        workspace_avatar_url: targetMember.workspace_avatar_url || '',
        last_active_at: targetMember.last_active_at || null,
      }
    });
  } catch (e: any) {
    console.log(`ws-identity GET user error: ${e.message}`);
    return c.json({ error: e.message }, 500);
  }
});

// ── 6. Workspace Members: Paginated list with presence ──
app.get("/make-server-ad34c09a/ws-identity/:wsId/members", async (c) => {
  try {
    const wsId = c.req.param('wsId');
    const page = parseInt(c.req.query('page') || '0');
    const { user, member, error } = await wsAuth(c, wsId);
    if (!user || !member) return c.json({ error: error || 'Unauthorized' }, 401);
    const allMembers = await kv.getByPrefix(`ws_member:${wsId}:`) || [];
    const sorted = allMembers.sort((a: any, b: any) =>
      new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
    );
    const start = page * IDENTITY_PAGE_SIZE;
    const pageMembers = sorted.slice(start, start + IDENTITY_PAGE_SIZE);
    const userIds = pageMembers.filter((m: any) => m.user_id).map((m: any) => m.user_id);
    const presenceKeys = userIds.map((uid: string) => `presence:${uid}`);
    const presenceValues = presenceKeys.length > 0 ? await kv.mget(presenceKeys) : [];
    const presenceMap: Record<string, any> = {};
    userIds.forEach((uid: string, i: number) => {
      presenceMap[uid] = presenceValues[i] || { status: 'offline', last_seen_at: null };
    });
    const enriched = pageMembers.map((m: any) => ({
      ...m,
      workspace_display_name: m.workspace_display_name || m.full_name || '',
      workspace_avatar_url: m.workspace_avatar_url || '',
      presence: m.user_id ? (presenceMap[m.user_id] || { status: 'offline' }) : { status: 'offline' },
    }));
    return c.json({
      members: enriched,
      total: sorted.length,
      page,
      hasMore: start + IDENTITY_PAGE_SIZE < sorted.length,
    });
  } catch (e: any) {
    console.log(`ws-identity members list error: ${e.message}`);
    return c.json({ error: e.message }, 500);
  }
});

// ── 7. Presence: Update own ──
app.post("/make-server-ad34c09a/presence/update", async (c) => {
  try {
    const { user, error: authErr } = await authUser(c);
    if (!user) return c.json({ error: authErr || 'Unauthorized' }, 401);
    const body = await c.req.json();
    const status = body.status || 'online';
    const now = new Date().toISOString();
    const existing: any = await kv.get(`presence:${user.id}`) || {};
    const merged = {
      user_id: user.id,
      status: ['online', 'away', 'offline'].includes(status) ? status : 'online',
      last_active_at: now,
      last_seen_at: status === 'offline' ? now : (existing.last_seen_at || null),
      last_workspace_id: body.last_workspace_id || existing.last_workspace_id || null,
    };
    await kv.set(`presence:${user.id}`, merged);
    return c.json({ ok: true, presence: merged });
  } catch (e: any) {
    console.log(`presence update error: ${e.message}`);
    return c.json({ error: e.message }, 500);
  }
});

// ── 8. Presence: Batch Read ──
app.post("/make-server-ad34c09a/presence/batch", async (c) => {
  try {
    const { user, error: authErr } = await authUser(c);
    if (!user) return c.json({ error: authErr || 'Unauthorized' }, 401);
    const { userIds } = await c.req.json();
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return c.json({ presences: {} });
    }
    const capped = userIds.slice(0, 50);
    const keys = capped.map((uid: string) => `presence:${uid}`);
    const values = await kv.mget(keys);
    const presences: Record<string, any> = {};
    capped.forEach((uid: string, i: number) => {
      presences[uid] = values[i] || { user_id: uid, status: 'offline', last_seen_at: null, last_active_at: null };
    });
    return c.json({ presences });
  } catch (e: any) {
    console.log(`presence batch error: ${e.message}`);
    return c.json({ error: e.message }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════
// ████████████  CONNECTORS / MCP SYSTEM  ████████████████████████
// ═══════════════════════════════════════════════════════════════

// ─── GET /connectors — List all connector statuses for user ───
app.get("/make-server-ad34c09a/connectors", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error fetching connectors: ${authError}` }, 401);

    const entries = await kv.getByPrefix(`connector:${user.id}:`);
    const connectors: Record<string, any> = {};
    for (const entry of (entries || [])) {
      const e = entry as any;
      if (e.connector_id) {
        connectors[e.connector_id] = {
          connected: true,
          config: e.config || {},
          connected_at: e.connected_at,
        };
      }
    }

    return c.json({ connectors });
  } catch (e: any) {
    console.log("Connectors fetch error:", e.message);
    return c.json({ error: `Connectors fetch error: ${e.message}` }, 500);
  }
});

// ─── POST /connectors/:id — Save/update connector config ───
app.post("/make-server-ad34c09a/connectors/:id", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error saving connector: ${authError}` }, 401);

    const connectorId = c.req.param('id');
    const { config } = await c.req.json();

    if (!config || typeof config !== 'object') {
      return c.json({ error: 'Config object required' }, 400);
    }

    const entry = {
      connector_id: connectorId,
      config,
      connected_at: new Date().toISOString(),
      user_id: user.id,
    };

    await kv.set(`connector:${user.id}:${connectorId}`, entry);
    console.log(`Connector ${connectorId} saved for user ${user.id}`);

    return c.json({ success: true });
  } catch (e: any) {
    console.log("Connector save error:", e.message);
    return c.json({ error: `Connector save error: ${e.message}` }, 500);
  }
});

// ─── DELETE /connectors/:id — Disconnect connector ───
app.delete("/make-server-ad34c09a/connectors/:id", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error disconnecting connector: ${authError}` }, 401);

    const connectorId = c.req.param('id');
    await kv.del(`connector:${user.id}:${connectorId}`);
    console.log(`Connector ${connectorId} disconnected for user ${user.id}`);

    return c.json({ success: true });
  } catch (e: any) {
    console.log("Connector disconnect error:", e.message);
    return c.json({ error: `Connector disconnect error: ${e.message}` }, 500);
  }
});

// ─── POST /connectors/:id/execute — Execute a connector skill ───
app.post("/make-server-ad34c09a/connectors/:id/execute", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error executing connector: ${authError}` }, 401);

    const connectorId = c.req.param('id');
    const { skill, params } = await c.req.json();

    const entry: any = await kv.get(`connector:${user.id}:${connectorId}`);
    if (!entry || !entry.config) {
      return c.json({ error: `Connector ${connectorId} not connected` }, 400);
    }

    console.log(`Executing skill "${skill}" on connector "${connectorId}" for user ${user.id}`);

    const executionId = `exec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const executionLog = {
      id: executionId,
      connector_id: connectorId,
      skill,
      params: params || {},
      status: 'completed',
      created_at: new Date().toISOString(),
      user_id: user.id,
    };
    await kv.set(`connector_exec:${user.id}:${executionId}`, executionLog);

    return c.json({
      success: true,
      execution_id: executionId,
      result: { message: `Skill "${skill}" executed on ${connectorId}` },
    });
  } catch (e: any) {
    console.log("Connector execute error:", e.message);
    return c.json({ error: `Connector execute error: ${e.message}` }, 500);
  }
});

// ─── GET /agent/skills — List all available skills from connected connectors ───
app.get("/make-server-ad34c09a/agent/skills", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error: ${authError}` }, 401);

    const entries = await kv.getByPrefix(`connector:${user.id}:`);
    const connectedIds = (entries || []).map((e: any) => e.connector_id).filter(Boolean);

    return c.json({ connected_connectors: connectedIds, total_connected: connectedIds.length });
  } catch (e: any) {
    console.log("Agent skills error:", e.message);
    return c.json({ error: `Agent skills error: ${e.message}` }, 500);
  }
});

// ─── POST /agent/chat — Agent execution chat session ───
app.post("/make-server-ad34c09a/agent/chat", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error in agent chat: ${authError}` }, 401);

    const { message, session_id } = await c.req.json();
    if (!message) return c.json({ error: 'Message is required' }, 400);

    const sessionId = session_id || `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const msgId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await kv.set(`agent_chat:${user.id}:${sessionId}:${msgId}`, {
      id: msgId, session_id: sessionId, role: 'user',
      content: message, created_at: new Date().toISOString(),
    });

    const entries = await kv.getByPrefix(`connector:${user.id}:`);
    const connectedIds = (entries || []).map((e: any) => e.connector_id).filter(Boolean);

    const msg = message.toLowerCase();
    let responseText = `فهمت طلبك. الموصلات النشطة: ${connectedIds.length > 0 ? connectedIds.join(', ') : 'لا يوجد'}. يمكنك ربط المزيد من الخدمات.`;

    if (msg.includes('تكلفة') || msg.includes('cost') || msg.includes('تقدير'))
      responseText = 'ساقوم بتقدير التكلفة. يرجى تزويدي بتفاصيل المشروع: نوع العقار، المساحة، ومستوى التشطيب.';
    else if (msg.includes('مقاول') || msg.includes('contractor'))
      responseText = 'سابحث لك عن افضل المقاولين. هل تريد مقاول بناء عام او متخصص؟';
    else if (msg.includes('عقد') || msg.includes('contract'))
      responseText = 'ساقوم بانشاء عقد احترافي. احتاج: اسم المقاول، نوع العمل، القيمة، والمدة.';
    else if (msg.includes('بريد') || msg.includes('email')) {
      responseText = connectedIds.includes('gmail')
        ? 'تم الاتصال بـ Gmail. ماذا تريد ان افعل؟'
        : 'يرجى ربط Gmail اولا من صفحة الموصلات.';
    } else if (msg.includes('دفع') || msg.includes('فاتورة')) {
      responseText = connectedIds.includes('stripe')
        ? 'تم الاتصال بـ Stripe. ما هي تفاصيل الفاتورة؟'
        : 'يرجى ربط Stripe اولا من صفحة الموصلات.';
    }

    const agentMsgId = `msg_${Date.now() + 1}_${Math.random().toString(36).slice(2, 8)}`;
    const agentResponse = {
      id: agentMsgId, session_id: sessionId, role: 'agent',
      content: responseText, created_at: new Date().toISOString(),
    };
    await kv.set(`agent_chat:${user.id}:${sessionId}:${agentMsgId}`, agentResponse);

    return c.json({ session_id: sessionId, response: agentResponse, connected_tools: connectedIds });
  } catch (e: any) {
    console.log("Agent chat error:", e.message);
    return c.json({ error: `Agent chat error: ${e.message}` }, 500);
  }
});

// ─── GET /agent/sessions — List user chat sessions ───
app.get("/make-server-ad34c09a/agent/sessions", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error: ${authError}` }, 401);

    const entries = await kv.getByPrefix(`agent_chat:${user.id}:`);
    const sessions: Record<string, any[]> = {};
    for (const e of (entries || [])) {
      const msg = e as any;
      if (!sessions[msg.session_id]) sessions[msg.session_id] = [];
      sessions[msg.session_id].push(msg);
    }

    const sessionList = Object.entries(sessions).map(([id, msgs]) => ({
      session_id: id,
      message_count: msgs.length,
      last_message: msgs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0],
      created_at: msgs[msgs.length - 1]?.created_at,
    }));

    return c.json({ sessions: sessionList });
  } catch (e: any) {
    console.log("Agent sessions error:", e.message);
    return c.json({ error: `Agent sessions error: ${e.message}` }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════
// ████████████  TASK SYSTEM (وكلاء وياك)  ████████████████████████
// ═══════════════════════════════════════════════════════════════

// Task cost table (coins per task type)
const TASK_COSTS: Record<string, number> = {
  'setup_business_profile':   0,
  'create_profile_page':      5,
  'create_service_page':      5,
  'seo_report':               10,
  'geo_report':               15,
  'social_post_generate':     3,
  'social_post_schedule':     2,
  'reply_comments':           1,
  'client_followup':          2,
  'whatsapp_template':        2,
  'content_plan_30days':      20,
  'general':                  0,
};

// ─── POST /tasks — Create a new task ───
app.post("/make-server-ad34c09a/tasks", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error creating task: ${authError}` }, 401);

    const { type, title, description, agent, metadata, auto_execute } = await c.req.json();
    if (!type || !title) return c.json({ error: 'type and title are required' }, 400);

    const cost = TASK_COSTS[type] ?? 5;
    const id = `TASK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const now = new Date().toISOString();

    const task: any = {
      id, user_id: user.id, type, title,
      description: description || '',
      agent: agent || 'general',
      status: 'pending',
      cost_coins: cost, coins_deducted: false,
      metadata: metadata || {}, result: null,
      created_at: now, updated_at: now,
      started_at: null, completed_at: null,
    };

    await kv.set(`tasks:${user.id}:${id}`, task);
    console.log(`Task ${id} created for user ${user.id}: ${title} [agent: ${agent}] [cost: ${cost}]`);

    if (auto_execute && cost === 0) {
      task.status = 'running';
      task.started_at = now;
      await kv.set(`tasks:${user.id}:${id}`, task);
    }

    return c.json({ success: true, task });
  } catch (e: any) {
    console.log("Task create error:", e.message);
    return c.json({ error: `Task create error: ${e.message}` }, 500);
  }
});

// ─── GET /tasks — Fetch user tasks ───
app.get("/make-server-ad34c09a/tasks", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error fetching tasks: ${authError}` }, 401);

    const agentFilter = c.req.query('agent') || '';
    const statusFilter = c.req.query('status') || '';

    let entries: any[] = (await kv.getByPrefix(`tasks:${user.id}:`) || []) as any[];
    if (agentFilter) entries = entries.filter((t: any) => t.agent === agentFilter);
    if (statusFilter) entries = entries.filter((t: any) => t.status === statusFilter);

    const sorted = entries.sort((a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return c.json({ tasks: sorted });
  } catch (e: any) {
    console.log("Tasks fetch error:", e.message);
    return c.json({ error: `Tasks fetch error: ${e.message}` }, 500);
  }
});

// ─── GET /tasks/stats — Task stats summary (MUST be before :id) ───
app.get("/make-server-ad34c09a/tasks/stats", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error: ${authError}` }, 401);

    const entries: any[] = (await kv.getByPrefix(`tasks:${user.id}:`) || []) as any[];
    const stats = {
      total: entries.length,
      pending: entries.filter(t => t.status === 'pending').length,
      running: entries.filter(t => t.status === 'running').length,
      done: entries.filter(t => t.status === 'done').length,
      failed: entries.filter(t => t.status === 'failed').length,
      total_coins_spent: entries.filter(t => t.coins_deducted).reduce((s, t) => s + (t.cost_coins || 0), 0),
      by_agent: {} as Record<string, number>,
    };
    entries.forEach(t => {
      stats.by_agent[t.agent] = (stats.by_agent[t.agent] || 0) + 1;
    });
    return c.json({ stats });
  } catch (e: any) {
    console.log("Task stats error:", e.message);
    return c.json({ error: `Task stats error: ${e.message}` }, 500);
  }
});

// ─── GET /tasks/:id — Get single task ───
app.get("/make-server-ad34c09a/tasks/:id", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error: ${authError}` }, 401);
    const id = c.req.param('id');
    const task = await kv.get(`tasks:${user.id}:${id}`);
    if (!task) return c.json({ error: 'Task not found' }, 404);
    return c.json({ task });
  } catch (e: any) {
    console.log("Task fetch error:", e.message);
    return c.json({ error: `Task fetch error: ${e.message}` }, 500);
  }
});

// ─── POST /tasks/:id/execute — Execute a task (deduct coins + change status) ───
app.post("/make-server-ad34c09a/tasks/:id/execute", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error executing task: ${authError}` }, 401);

    const id = c.req.param('id');
    const key = `tasks:${user.id}:${id}`;
    const task: any = await kv.get(key);
    if (!task) return c.json({ error: 'Task not found' }, 404);
    if (task.status === 'done') return c.json({ error: 'Task already completed' }, 409);
    if (task.status === 'running') return c.json({ error: 'Task already running' }, 409);

    const cost = task.cost_coins || 0;

    if (cost > 0 && !task.coins_deducted) {
      let wallet: any = await kv.get(`wallet:${user.id}`);
      if (!wallet) wallet = { balance: 0, updated_at: new Date().toISOString() };
      if (wallet.balance < cost) {
        return c.json({
          error: 'رصيد كوينز غير كافي لتنفيذ هذه المهمة',
          errorCode: 'INSUFFICIENT_BALANCE',
          required: cost, currentBalance: wallet.balance,
        }, 400);
      }
      const newBalance = wallet.balance - cost;
      const now2 = new Date().toISOString();
      await kv.set(`wallet:${user.id}`, { balance: newBalance, updated_at: now2 });
      await kv.set(`wallet_ledger:${user.id}:${Date.now()}`, {
        type: 'task_spend', amount: -cost,
        reason: `تنفيذ مهمة: ${task.title}`,
        task_id: id, created_at: now2, user_id: user.id,
      });
      task.coins_deducted = true;
      console.log(`Deducted ${cost} coins from user ${user.id} for task ${id}. New balance: ${newBalance}`);
    }

    const now = new Date().toISOString();
    task.status = 'running';
    task.started_at = now;
    task.updated_at = now;
    await kv.set(key, task);
    return c.json({ success: true, task });
  } catch (e: any) {
    console.log("Task execute error:", e.message);
    return c.json({ error: `Task execute error: ${e.message}` }, 500);
  }
});

// ─── PUT /tasks/:id — Update task ───
app.put("/make-server-ad34c09a/tasks/:id", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error updating task: ${authError}` }, 401);

    const id = c.req.param('id');
    const key = `tasks:${user.id}:${id}`;
    const task: any = await kv.get(key);
    if (!task) return c.json({ error: 'Task not found' }, 404);

    const body = await c.req.json();
    const now = new Date().toISOString();
    if (body.status) task.status = body.status;
    if (body.result !== undefined) task.result = body.result;
    if (body.metadata) task.metadata = { ...task.metadata, ...body.metadata };
    if (body.status === 'done') task.completed_at = now;
    task.updated_at = now;

    await kv.set(key, task);
    console.log(`Task ${id} updated. Status: ${task.status}`);
    return c.json({ success: true, task });
  } catch (e: any) {
    console.log("Task update error:", e.message);
    return c.json({ error: `Task update error: ${e.message}` }, 500);
  }
});

// ─── DELETE /tasks/:id — Delete a task ───
app.delete("/make-server-ad34c09a/tasks/:id", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error deleting task: ${authError}` }, 401);
    const id = c.req.param('id');
    await kv.del(`tasks:${user.id}:${id}`);
    console.log(`Task ${id} deleted for user ${user.id}`);
    return c.json({ success: true });
  } catch (e: any) {
    console.log("Task delete error:", e.message);
    return c.json({ error: `Task delete error: ${e.message}` }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════
// ████████████  BUSINESS PROFILE (وكيل الحسابات)  ██████████████
// ═══════════════════════════════════════════════════════════════

// ─── POST /business-profile — Save/update business profile ───
app.post("/make-server-ad34c09a/business-profile", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error saving business profile: ${authError}` }, 401);

    const body = await c.req.json();
    const now = new Date().toISOString();
    const existing: any = await kv.get(`business_profile:${user.id}`) || {};
    const profile = {
      ...existing, ...body,
      user_id: user.id,
      updated_at: now,
      created_at: existing.created_at || now,
    };

    await kv.set(`business_profile:${user.id}`, profile);
    console.log(`Business profile saved for user ${user.id}: ${profile.business_name || 'unnamed'}`);

    // Auto-create onboarding task if first time
    if (!existing.created_at) {
      const taskId = `TASK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      await kv.set(`tasks:${user.id}:${taskId}`, {
        id: taskId, user_id: user.id,
        type: 'setup_business_profile',
        title: 'اعداد الملف التجاري',
        description: 'تم جمع بيانات النشاط وانشاء الملف التجاري الموحد',
        agent: 'account_manager', status: 'done',
        cost_coins: 0, coins_deducted: false,
        metadata: { auto_created: true },
        result: { profile_id: user.id, profile_complete: true },
        created_at: now, updated_at: now,
        started_at: now, completed_at: now,
      });
    }

    return c.json({ success: true, profile });
  } catch (e: any) {
    console.log("Business profile save error:", e.message);
    return c.json({ error: `Business profile save error: ${e.message}` }, 500);
  }
});

// ─── GET /business-profile — Get business profile ───
app.get("/make-server-ad34c09a/business-profile", async (c) => {
  try {
    const { user, error: authError } = await authUser(c);
    if (!user) return c.json({ error: `Auth error fetching business profile: ${authError}` }, 401);

    const profile = await kv.get(`business_profile:${user.id}`);
    return c.json({ profile: profile || null });
  } catch (e: any) {
    console.log("Business profile fetch error:", e.message);
    return c.json({ error: `Business profile fetch error: ${e.message}` }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════
// ████████████  CLOUD DESKTOP (WEYAK COMPUTER)  ████████████████
// ═══════════════════════════════════════════════════════════════

// GET /cloud-desktop/setup
app.get('/make-server-ad34c09a/cloud-desktop/setup', async (c) => {
  try {
    const { user, error } = await authUser(c);
    if (!user) return c.json({ error: `Unauthorized: ${error}` }, 401);
    const config = await kv.get(`cloud_desktop:${user.id}`);
    return c.json({ config: config || null });
  } catch (e: any) {
    console.log('Cloud desktop setup GET error:', e.message);
    return c.json({ error: `Cloud desktop GET error: ${e.message}` }, 500);
  }
});

// POST /cloud-desktop/setup
app.post('/make-server-ad34c09a/cloud-desktop/setup', async (c) => {
  try {
    const { user, error } = await authUser(c);
    if (!user) return c.json({ error: `Unauthorized: ${error}` }, 401);
    const body = await c.req.json();
    const { projectId, apiKey, serviceAccountJson, provider } = body;
    if (!projectId || !apiKey) return c.json({ error: 'projectId and apiKey are required' }, 400);
    const config = {
      userId: user.id,
      provider: provider || 'google-cloud',
      projectId,
      apiKey,
      serviceAccountJson: serviceAccountJson || null,
      completedAt: new Date().toISOString(),
      status: 'active',
    };
    await kv.set(`cloud_desktop:${user.id}`, config);
    console.log(`Cloud desktop configured for user ${user.id}, project: ${projectId}`);
    return c.json({ success: true, config });
  } catch (e: any) {
    console.log('Cloud desktop setup POST error:', e.message);
    return c.json({ error: `Cloud desktop POST error: ${e.message}` }, 500);
  }
});

// DELETE /cloud-desktop/setup
app.delete('/make-server-ad34c09a/cloud-desktop/setup', async (c) => {
  try {
    const { user, error } = await authUser(c);
    if (!user) return c.json({ error: `Unauthorized: ${error}` }, 401);
    await kv.del(`cloud_desktop:${user.id}`);
    return c.json({ success: true });
  } catch (e: any) {
    console.log('Cloud desktop setup DELETE error:', e.message);
    return c.json({ error: `Cloud desktop DELETE error: ${e.message}` }, 500);
  }
});

Deno.serve(app.fetch);
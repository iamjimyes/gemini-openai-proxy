// node_modules/.deno/itty-router@5.0.9/node_modules/itty-router/index.mjs
var t = ({ base: e = "", routes: t2 = [], ...r2 } = {}) => ({ __proto__: new Proxy({}, { get: (r3, o2, a2, s2) => (r4, ...c) => t2.push([o2.toUpperCase?.(), RegExp(`^${(s2 = (e + r4).replace(/\/+(\/|$)/g, "$1")).replace(/(\/?\.?):(\w+)\+/g, "($1(?<$2>*))").replace(/(\/?\.?):(\w+)/g, "($1(?<$2>[^$1/]+?))").replace(/\./g, "\\.").replace(/(\/?)\*/g, "($1.*)?")}/*$`), c, s2]) && a2 }), routes: t2, ...r2, async fetch(e2, ...o2) {
  let a2, s2, c = new URL(e2.url), n = e2.query = { __proto__: null };
  for (let [e3, t3] of c.searchParams)
    n[e3] = n[e3] ? [].concat(n[e3], t3) : t3;
  e:
    try {
      for (let t3 of r2.before || [])
        if (null != (a2 = await t3(e2.proxy ?? e2, ...o2)))
          break e;
      t:
        for (let [r3, n2, l, i] of t2)
          if ((r3 == e2.method || "ALL" == r3) && (s2 = c.pathname.match(n2))) {
            e2.params = s2.groups || {}, e2.route = i;
            for (let t3 of l)
              if (null != (a2 = await t3(e2.proxy ?? e2, ...o2)))
                break t;
          }
    } catch (t3) {
      if (!r2.catch)
        throw t3;
      a2 = await r2.catch(t3, e2.proxy ?? e2, ...o2);
    }
  try {
    for (let t3 of r2.finally || [])
      a2 = await t3(a2, e2.proxy ?? e2, ...o2) ?? a2;
  } catch (t3) {
    if (!r2.catch)
      throw t3;
    a2 = await r2.catch(t3, e2.proxy ?? e2, ...o2);
  }
  return a2;
} });
var r = (e = "text/plain; charset=utf-8", t2) => (r2, { ...o2 } = {}) => {
  if (void 0 === r2 || r2 instanceof Response)
    return r2;
  const a2 = new Response(t2?.(r2) ?? r2, o2);
  return a2.headers.set("content-type", e), a2;
};
var o = r("application/json; charset=utf-8", JSON.stringify);
var a = (e) => ({ 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 500: "Internal Server Error" })[e] || "Unknown Error";
var s = (e = 500, t2) => {
  if (e instanceof Error) {
    const { message: r2, ...o2 } = e;
    e = e.status || 500, t2 = { error: r2 || a(e), ...o2 };
  }
  return t2 = { status: e, ..."object" == typeof t2 ? t2 : { error: t2 || a(e) } }, o(t2, { status: e });
};
var p = r("text/plain; charset=utf-8", String);
var f = r("text/html");
var u = r("image/jpeg");
var h = r("image/png");
var g = r("image/webp");
var y = (e = {}) => {
  const { origin: t2 = "*", credentials: r2 = false, allowMethods: o2 = "*", allowHeaders: a2, exposeHeaders: s2, maxAge: c } = e, n = (e2) => {
    const o3 = e2?.headers.get("origin");
    return true === t2 ? o3 : t2 instanceof RegExp ? t2.test(o3) ? o3 : void 0 : Array.isArray(t2) ? t2.includes(o3) ? o3 : void 0 : t2 instanceof Function ? t2(o3) : "*" == t2 && r2 ? o3 : t2;
  }, l = (e2, t3) => {
    for (const [r3, o3] of Object.entries(t3))
      o3 && e2.headers.append(r3, o3);
    return e2;
  };
  return { corsify: (e2, t3) => e2?.headers?.get("access-control-allow-origin") || 101 == e2.status ? e2 : l(e2, { "access-control-allow-origin": n(t3), "access-control-allow-credentials": r2 }), preflight: (e2) => {
    if ("OPTIONS" == e2.method) {
      const t3 = new Response(null, { status: 204 });
      return l(t3, { "access-control-allow-origin": n(e2), "access-control-allow-methods": o2?.join?.(",") ?? o2, "access-control-expose-headers": s2?.join?.(",") ?? s2, "access-control-allow-headers": a2?.join?.(",") ?? a2 ?? e2.headers.get("access-control-request-headers"), "access-control-max-age": c, "access-control-allow-credentials": r2 });
    }
  } };
};

// src/gemini-proxy.ts
async function geminiProxy(rawReq) {
  const url = new URL(rawReq.url);
  url.host = "generativelanguage.googleapis.com";
  url.port = "";
  url.protocol = "https:";
  const req = new Request(url, rawReq);
  const resp = await fetch(req);
  return new Response(resp.body, resp);
}

// src/log.ts
var LEVEL = ["debug", "info", "warn", "error"];
var Logger = class {
  config;
  debug;
  info;
  warn;
  error;
  constructor(config) {
    const level = LEVEL.find((it) => it === config?.level) ?? "warn";
    this.config = {
      prefix: config?.prefix ?? "",
      level
    };
    for (const m of LEVEL) {
      this[m] = (...data) => this.#write(m, ...data);
    }
  }
  #write(level, ...data) {
    const { level: configLevel, prefix } = this.config;
    if (LEVEL.indexOf(level) < LEVEL.indexOf(configLevel)) {
      return;
    }
    console[level](`${(/* @__PURE__ */ new Date()).toISOString()} ${level.toUpperCase()}${prefix ? ` ${prefix}` : ""}`, ...data);
  }
};

// src/utils.ts
function getToken(headers) {
  for (const [k, v] of headers.entries()) {
    if (k.toLowerCase() !== "authorization")
      continue;
    const rawApikey = v.substring(v.indexOf(" ") + 1);
    if (!rawApikey.includes("#")) {
      return {
        apikey: rawApikey,
        useBeta: false
      };
    }
    const apikey = rawApikey.substring(0, rawApikey.indexOf("#"));
    const params = new URLSearchParams(rawApikey.substring(rawApikey.indexOf("#") + 1));
    return {
      apikey,
      useBeta: params.has("useBeta")
    };
  }
  return null;
}
function parseBase64(base64) {
  if (!base64.startsWith("data:")) {
    return { text: "" };
  }
  const [m, data, ..._arr] = base64.split(",");
  const mimeType = m.match(/:(?<mime>.*?);/)?.groups?.mime ?? "img/png";
  return {
    inlineData: {
      mimeType,
      data
    }
  };
}
function openAiMessageToGeminiMessage(messages) {
  const result = messages.flatMap(({ role, content }) => {
    if (role === "system") {
      return [
        { role: "user", parts: [{ text: content }] },
        { role: "model", parts: [{ text: "" }] }
      ];
    }
    const parts = content == null || typeof content === "string" ? [{ text: content?.toString() ?? "" }] : content.map((item) => item.type === "text" ? { text: item.text } : parseBase64(item.image_url.url));
    return [{ role: "user" === role ? "user" : "model", parts }];
  }).flatMap((item, idx, arr) => {
    if (item.role === arr.at(idx + 1)?.role && item.role === "user") {
      return [item, { role: "model", parts: [{ text: "" }] }];
    }
    return [item];
  });
  return result;
}
function hasImageMessage(messages) {
  return messages.some((msg) => {
    const content = msg.content;
    if (content == null) {
      return false;
    }
    if (typeof content === "string") {
      return false;
    }
    return content.some((it) => it.type === "image_url");
  });
}
function genModel(req) {
  const model = hasImageMessage(req.messages) ? "gemini-pro" : "gemini-pro-vision";
  let functions = req.tools?.filter((it) => it.type === "function")?.map((it) => it.function) ?? [];
  functions = functions.concat(req.functions ?? []);
  const generateContentRequest = {
    contents: openAiMessageToGeminiMessage(req.messages),
    generationConfig: {
      maxOutputTokens: req.max_tokens ?? void 0,
      temperature: req.temperature ?? void 0,
      topP: req.top_p ?? void 0
    },
    tools: [
      {
        functionDeclarations: functions
      }
    ],
    safetySettings: [
      "HARM_CATEGORY_HATE_SPEECH",
      "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      "HARM_CATEGORY_DANGEROUS_CONTENT",
      "HARM_CATEGORY_HARASSMENT"
    ].map((category) => ({
      category,
      threshold: "BLOCK_NONE"
    }))
  };
  return [model, generateContentRequest];
}
function getRuntimeKey() {
  const global = globalThis;
  if (global?.Deno !== void 0) {
    return "deno";
  }
  if (global?.Bun !== void 0) {
    return "bun";
  }
  if (typeof global?.WebSocketPair === "function") {
    return "workerd";
  }
  if (typeof global?.EdgeRuntime === "string") {
    return "edge-light";
  }
  if (global?.fastly !== void 0) {
    return "fastly";
  }
  if (global?.process?.release?.name === "node") {
    return "node";
  }
  return "other";
}

// src/gemini-api-client/errors.ts
var GoogleGenerativeAIError = class extends Error {
  constructor(message) {
    super(`[GoogleGenerativeAI Error]: ${message}`);
  }
};
var GoogleGenerativeAIResponseError = class extends GoogleGenerativeAIError {
  constructor(message, response) {
    super(message);
    this.response = response;
  }
};

// src/gemini-api-client/response-helper.ts
function addHelpers(response) {
  ;
  response.result = () => {
    if (response.candidates && response.candidates.length > 0) {
      if (response.candidates.length > 1) {
        console.warn(
          `This response had ${response.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`
        );
      }
      if (hadBadFinishReason(response.candidates[0])) {
        throw new GoogleGenerativeAIResponseError(
          `${formatBlockErrorMessage(response)}`,
          response
        );
      }
      return getText(response);
    }
    if (response.promptFeedback) {
      throw new GoogleGenerativeAIResponseError(
        `Text not available. ${formatBlockErrorMessage(response)}`,
        response
      );
    }
    return "";
  };
  return response;
}
function getText(response) {
  if (response.candidates?.[0].content?.parts?.[0]?.text) {
    return response.candidates[0].content.parts[0].text;
  }
  if (response.candidates?.[0].content?.parts?.[0]?.functionCall) {
    return response.candidates[0].content.parts[0].functionCall;
  }
  return "";
}
var badFinishReasons = ["RECITATION", "SAFETY"];
function hadBadFinishReason(candidate) {
  return !!candidate.finishReason && badFinishReasons.includes(candidate.finishReason);
}
function formatBlockErrorMessage(response) {
  let message = "";
  if ((!response.candidates || response.candidates.length === 0) && response.promptFeedback) {
    message += "Response was blocked";
    if (response.promptFeedback?.blockReason) {
      message += ` due to ${response.promptFeedback.blockReason}`;
    }
    if (response.promptFeedback?.blockReasonMessage) {
      message += `: ${response.promptFeedback.blockReasonMessage}`;
    }
  } else if (response.candidates?.[0]) {
    const firstCandidate = response.candidates[0];
    if (hadBadFinishReason(firstCandidate)) {
      message += `Candidate was blocked due to ${firstCandidate.finishReason}`;
      if (firstCandidate.finishMessage) {
        message += `: ${firstCandidate.finishMessage}`;
      }
    }
  }
  return message;
}

// src/gemini-api-client/gemini-api-client.ts
async function generateContent(apiParam, model, params, requestOptions) {
  const url = new RequestUrl(model, "generateContent" /* GENERATE_CONTENT */, false, apiParam);
  const response = await makeRequest(url, JSON.stringify(params), requestOptions);
  const responseJson = await response.json();
  const enhancedResponse = addHelpers(responseJson);
  return {
    response: enhancedResponse
  };
}
async function makeRequest(url, body, requestOptions) {
  let response;
  try {
    response = await fetch(url.toURL(), {
      ...buildFetchOptions(requestOptions),
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body
    });
    if (!response.ok) {
      let message = "";
      try {
        const json = await response.json();
        message = json.error.message;
        if (json.error.details) {
          message += ` ${JSON.stringify(json.error.details)}`;
        }
      } catch (_e) {
      }
      throw new Error(`[${response.status} ${response.statusText}] ${message}`);
    }
  } catch (e) {
    const err = new GoogleGenerativeAIError(`Error fetching from ${url.toURL()} -> ${e.message}`);
    err.stack = e.stack;
    throw err;
  }
  return response;
}
var RequestUrl = class {
  constructor(model, task, stream, apiParam) {
    this.model = model;
    this.task = task;
    this.stream = stream;
    this.apiParam = apiParam;
  }
  toURL() {
    const api_version = this.apiParam.useBeta ? "v1beta" /* v1beta */ : "v1" /* v1 */;
    const url = new URL(`${BASE_URL}/${api_version}/models/${this.model}:${this.task}`);
    url.searchParams.append("key", this.apiParam.apikey);
    if (this.stream) {
      url.searchParams.append("alt", "sse");
    }
    return url;
  }
};
var BASE_URL = "https://generativelanguage.googleapis.com";
function buildFetchOptions(requestOptions) {
  const fetchOptions = {};
  if (requestOptions?.timeout) {
    const abortController = new AbortController();
    const signal = abortController.signal;
    setTimeout(() => abortController.abort(), requestOptions.timeout);
    fetchOptions.signal = signal;
  }
  return fetchOptions;
}

// src/openai/chat/completions/NonStreamingChatProxyHandler.ts
async function nonStreamingChatProxyHandler(req, apiParam, log) {
  const [model, geminiReq] = genModel(req);
  const geminiResp = await generateContent(apiParam, model, geminiReq).then((it) => it.response.result()).catch((err) => {
    log?.error(req);
    log?.error(err?.message ?? err.toString());
    return err?.message ?? err.toString();
  });
  log?.debug(req);
  log?.debug(geminiResp);
  const resp = {
    id: "chatcmpl-abc123",
    object: "chat.completion",
    created: Date.now(),
    model: req.model,
    choices: [
      {
        message: {
          role: "assistant",
          content: typeof geminiResp === "string" ? geminiResp : null,
          ...typeof geminiResp === "string" ? void 0 : {
            function_call: {
              name: geminiResp.name ?? "",
              arguments: JSON.stringify(geminiResp.args)
            }
          }
        },
        logprobs: null,
        finish_reason: "stop",
        index: 0
      }
    ]
  };
  return resp;
}

// src/openai/chat/completions/StreamingChatProxyHandler.ts
async function* streamingChatProxyHandler(req, apiParam) {
  const [model, geminiReq] = genModel(req);
  const geminiResp = await generateContent(apiParam, model, geminiReq).then((it) => it.response.result()).catch((e) => e.message ?? e?.toString());
  function genOpenAiResp(content, stop) {
    return {
      id: "chatcmpl-abc123",
      object: "chat.completion.chunk",
      created: Date.now(),
      model: req.model,
      choices: [
        {
          delta: { role: "assistant", content },
          finish_reason: stop ? "stop" : null,
          index: 0
        }
      ]
    };
  }
  yield genOpenAiResp(geminiResp, false);
  yield genOpenAiResp("", true);
}

// src/openai/chat/completions/ChatProxyHandler.ts
async function chatProxyHandler(rawReq) {
  const req = await rawReq.json();
  const headers = rawReq.headers;
  const apiParam = getToken(headers);
  if (apiParam == null) {
    return new Response("Unauthorized", { status: 401 });
  }
  rawReq.logger?.debug(req);
  if (req.stream !== true) {
    const resp = await nonStreamingChatProxyHandler(req, apiParam, rawReq.logger);
    rawReq.logger?.debug(resp);
    return Response.json(resp);
  }
  const respArr = streamingChatProxyHandler(req, apiParam);
  return sseResponse(
    async function* () {
      for await (const data of respArr) {
        rawReq.logger?.debug(data);
        yield JSON.stringify(data);
      }
      yield "[DONE]";
    }()
  );
}
function sseResponse(dataStream) {
  const { readable, writable } = new TransformStream();
  const response = new Response(readable, {
    status: 200,
    headers: new Headers({
      "Content-Type": "text/event-stream"
    })
  });
  const encoder = new TextEncoder();
  async function writer(data) {
    const w = writable.getWriter();
    await w.write(encoder.encode(data));
    w.releaseLock();
  }
  ;
  (async () => {
    for await (const data of dataStream) {
      await writer(toSseMsg({ data }));
    }
    await writable.close();
  })();
  return response;
}
function toSseMsg(sseEvent) {
  const { event, data, id } = sseEvent;
  let result = `data: ${data}
`;
  if (event) {
    result += `event: ${event ?? ""}
`;
  }
  if (id) {
    result += `id: ${id ?? ""}
`;
  }
  return `${result}
`;
}

// src/openai/models.ts
var modelData = [
  {
    created: 1677610602,
    object: "model",
    owned_by: "openai",
    id: "gpt-3.5-turbo"
  },
  {
    created: 1677649963,
    object: "model",
    owned_by: "openai",
    id: "gpt-3.5-turbo-0301"
  },
  {
    created: 1686587434,
    object: "model",
    owned_by: "openai",
    id: "gpt-3.5-turbo-0613"
  },
  {
    created: 1683758102,
    object: "model",
    owned_by: "openai-internal",
    id: "gpt-3.5-turbo-16k"
  },
  {
    created: 1685474247,
    object: "model",
    owned_by: "openai",
    id: "gpt-3.5-turbo-16k-0613"
  },
  {
    created: 1687882411,
    object: "model",
    owned_by: "openai",
    id: "gpt-4"
  },
  {
    created: 1687882410,
    object: "model",
    owned_by: "openai",
    id: "gpt-4-0314"
  },
  {
    created: 1686588896,
    object: "model",
    owned_by: "openai",
    id: "gpt-4-0613"
  }
];
var models = () => {
  return {
    object: "list",
    data: modelData
  };
};
var modelDetail = (model) => {
  return modelData.find((it) => it.id === model);
};

// src/routes.ts
function hello(req) {
  const origin = new URL(req.url).origin;
  return new Response(`
    Hello Gemini-OpenAI-Proxy from ${getRuntimeKey()}! 
    
    You can try it with:
    
    curl ${origin}/v1/chat/completions \\
    -H "Authorization: Bearer $YOUR_GEMINI_API_KEY" \\
    -H "Content-Type: application/json" \\
    -d '{
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": "Hello"}],
        "temperature": 0.7
    }'
    `);
}

// src/app.ts
var { preflight, corsify } = y({ allowHeaders: "*" });
var app = t({
  before: [
    preflight,
    (req) => {
      req.logger = new Logger({ prefix: crypto.randomUUID().toString() });
      req.logger.warn(`--> ${req.method} ${req.url}`);
    }
  ],
  catch: s,
  finally: [
    corsify,
    (_, req) => {
      req.logger?.warn(`<-- ${req.method} ${req.url}`);
    },
    o
  ]
});
app.get("/", (c) => hello(c));
app.post("/v1/chat/completions", chatProxyHandler);
app.get("/v1/models", () => Response.json(models()));
app.get("/v1/models/:model", (c) => Response.json(modelDetail(c.params.model)));
app.post(":model_version/models/:model_and_action", geminiProxy);
app.all("*", () => new Response("Page Not Found", { status: 404 }));

// main_cloudflare-workers.ts
var main_cloudflare_workers_default = {
  fetch: app.fetch
};
export {
  main_cloudflare_workers_default as default
};

function safeText(value){
  if(value===undefined) return "未取得";
  if(value===null) return "null";
  if(value==="") return "(空文字)";
  if(typeof value==="boolean") return value ? "true" : "false";
  if(typeof value==="number" && Number.isNaN(value)) return "NaN";
  if(Array.isArray(value)) return value.join(", ");
  if(typeof value==="object"){
    try{return JSON.stringify(value);}catch(error){return String(value);}
  }
  return String(value);
}

function setStatus(message){
  document.getElementById("statusMessage").textContent = message;
}

function createApiItem(item){
  const wrapper = document.createElement("div");
  wrapper.className = "api-item";

  const top = document.createElement("div");
  top.className = "api-item-top";

  const name = document.createElement("div");
  name.className = "api-name";
  name.textContent = item.name;

  const sourceTag = document.createElement("span");
  sourceTag.className = "tag source";
  sourceTag.textContent = item.sourceLabel;

  top.appendChild(name);
  top.appendChild(sourceTag);

  const desc = document.createElement("div");
  desc.className = "api-desc";
  desc.textContent = item.description;

  const infoGrid = document.createElement("div");
  infoGrid.className = "info-grid";

  const rows = [
    { label: "値", value: safeText(item.value), kind: "value" },
    { label: "由来", value: item.originText || item.sourceLabel, kind: "text" },
    { label: "コード例", value: item.code, kind: "code" }
  ];

  rows.forEach((row) => {
    const infoRow = document.createElement("div");
    infoRow.className = "info-row";

    const label = document.createElement("div");
    label.className = "info-label";
    label.textContent = row.label;

    const value = document.createElement("div");
    value.className = "info-value";

    if(row.kind === "value"){
      const tag = document.createElement("span");
      tag.className = "tag value";
      tag.textContent = row.value;
      value.appendChild(tag);
    }else if(row.kind === "code"){
      const pre = document.createElement("pre");
      pre.className = "code-block";
      pre.textContent = row.value;
      value.appendChild(pre);
    }else{
      value.textContent = row.value;
    }

    infoRow.appendChild(label);
    infoRow.appendChild(value);
    infoGrid.appendChild(infoRow);
  });

  wrapper.appendChild(top);
  wrapper.appendChild(desc);
  wrapper.appendChild(infoGrid);
  return wrapper;
}

function renderSection(containerId, items){
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  items.forEach((item) => container.appendChild(createApiItem(item)));
}

function getNavigationMetrics(){
  const nav = performance.getEntriesByType("navigation")[0];
  if(!nav){
    return {dns:"未取得", tcp:"未取得", request:"未取得", response:"未取得", duration:"未取得"};
  }
  return {
    dns: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
    tcp: Math.round(nav.connectEnd - nav.connectStart),
    request: Math.round(nav.responseStart - nav.requestStart),
    response: Math.round(nav.responseEnd - nav.responseStart),
    duration: Math.round(nav.duration)
  };
}

function collectLearningData(){
  const metrics = getNavigationMetrics();

  return {
    locationItems: [
      {name:"location.href", sourceLabel:"location", description:"現在ページの完全なURLです。", value:location.href, originText:"ブラウザが現在開いているURL", code:"location.href"},
      {name:"location.hostname", sourceLabel:"location", description:"URLのホスト名部分です。", value:location.hostname, originText:"現在のURLのホスト名", code:"location.hostname"},
      {name:"location.pathname", sourceLabel:"location", description:"URLのパス部分です。", value:location.pathname, originText:"現在のURLのパス", code:"location.pathname"},
      {name:"location.protocol", sourceLabel:"location", description:"http: や https: を表します。", value:location.protocol, originText:"現在アクセス中のスキーム", code:"location.protocol"}
    ],
    documentItems: [
      {name:"document.title", sourceLabel:"document", description:"現在ドキュメントのタイトルです。", value:document.title, originText:"HTML の title 要素", code:"document.title"},
      {name:"document.referrer", sourceLabel:"document", description:"このページへ遷移してくる前の参照元URLです。", value:document.referrer || "なし", originText:"ブラウザが保持する参照元", code:"document.referrer"},
      {name:"document.lastModified", sourceLabel:"document", description:"文書の最終更新日時として扱われる値です。", value:document.lastModified, originText:"ブラウザが認識した文書の更新日時", code:"document.lastModified"},
      {name:"document.characterSet", sourceLabel:"document", description:"現在文書の文字コードです。", value:document.characterSet, originText:"HTML 文書の文字コード", code:"document.characterSet"}
    ],
    navigatorItems: [
      {name:"navigator.userAgent", sourceLabel:"navigator", description:"ブラウザやOSを表す代表的な文字列です。", value:navigator.userAgent, originText:"ブラウザ自身の申告値", code:"navigator.userAgent"},
      {name:"navigator.language", sourceLabel:"navigator", description:"ブラウザの優先言語です。", value:navigator.language, originText:"ブラウザの言語設定", code:"navigator.language"},
      {name:"navigator.languages", sourceLabel:"navigator", description:"優先順位つきの言語一覧です。", value:navigator.languages || [], originText:"ブラウザの言語設定一覧", code:"navigator.languages"},
      {name:"navigator.cookieEnabled", sourceLabel:"navigator", description:"Cookie が有効かどうかです。", value:navigator.cookieEnabled, originText:"ブラウザ設定", code:"navigator.cookieEnabled"},
      {name:"navigator.onLine", sourceLabel:"navigator", description:"オンライン状態の簡易判定です。", value:navigator.onLine, originText:"ブラウザのネットワーク状態判定", code:"navigator.onLine"},
      {name:"navigator.hardwareConcurrency", sourceLabel:"navigator", description:"利用可能CPUコア数の概算です。", value:navigator.hardwareConcurrency, originText:"ブラウザが見ている端末情報", code:"navigator.hardwareConcurrency"}
    ],
    screenItems: [
      {name:"screen.width / screen.height", sourceLabel:"screen", description:"物理画面サイズに近い情報です。", value:screen.width + " x " + screen.height, originText:"OS / ディスプレイ情報", code:"screen.width\nscreen.height"},
      {name:"window.innerWidth / window.innerHeight", sourceLabel:"window", description:"現在のブラウザ表示領域サイズです。", value:window.innerWidth + " x " + window.innerHeight, originText:"現在のブラウザウィンドウ表示領域", code:"window.innerWidth\nwindow.innerHeight"},
      {name:"window.devicePixelRatio", sourceLabel:"window", description:"CSSピクセルと物理ピクセルの比率です。", value:window.devicePixelRatio, originText:"端末や表示スケーリング設定", code:"window.devicePixelRatio"},
      {name:"screen.colorDepth", sourceLabel:"screen", description:"画面の色深度です。", value:screen.colorDepth, originText:"ディスプレイ設定", code:"screen.colorDepth"}
    ],
    intlItems: [
      {name:"Intl.DateTimeFormat().resolvedOptions().timeZone", sourceLabel:"Intl", description:"タイムゾーン名です。", value:Intl.DateTimeFormat().resolvedOptions().timeZone, originText:"OS / ブラウザのロケール設定", code:"Intl.DateTimeFormat().resolvedOptions().timeZone"},
      {name:"new Date().toString()", sourceLabel:"Date", description:"クライアント側の現在日時文字列です。", value:new Date().toString(), originText:"ブラウザを実行している端末の時刻", code:"new Date().toString()"},
      {name:"new Date().toISOString()", sourceLabel:"Date", description:"UTC基準の日時文字列です。", value:new Date().toISOString(), originText:"現在時刻の UTC 表現", code:"new Date().toISOString()"}
    ],
    performanceItems: [
      {name:"performance navigation DNS", sourceLabel:"performance", description:"名前解決にかかった時間の概算です。", value:metrics.dns + " ms", originText:"performance navigation entry", code:"const nav = performance.getEntriesByType(\"navigation\")[0];\nMath.round(nav.domainLookupEnd - nav.domainLookupStart)"},
      {name:"performance navigation TCP", sourceLabel:"performance", description:"接続確立にかかった時間の概算です。", value:metrics.tcp + " ms", originText:"performance navigation entry", code:"const nav = performance.getEntriesByType(\"navigation\")[0];\nMath.round(nav.connectEnd - nav.connectStart)"},
      {name:"performance navigation request", sourceLabel:"performance", description:"リクエスト送信から最初の応答までの概算です。", value:metrics.request + " ms", originText:"performance navigation entry", code:"const nav = performance.getEntriesByType(\"navigation\")[0];\nMath.round(nav.responseStart - nav.requestStart)"},
      {name:"performance navigation response", sourceLabel:"performance", description:"レスポンス受信にかかった概算です。", value:metrics.response + " ms", originText:"performance navigation entry", code:"const nav = performance.getEntriesByType(\"navigation\")[0];\nMath.round(nav.responseEnd - nav.responseStart)"},
      {name:"performance navigation duration", sourceLabel:"performance", description:"ページ全体の読込所要時間の概算です。", value:metrics.duration + " ms", originText:"performance navigation entry", code:"const nav = performance.getEntriesByType(\"navigation\")[0];\nMath.round(nav.duration)"}
    ],
    featureItems: [
      {name:"window.localStorage", sourceLabel:"feature check", description:"localStorage が利用可能かを確認します。", value:!!window.localStorage, originText:"Window オブジェクトの機能有無", code:"!!window.localStorage"},
      {name:"window.sessionStorage", sourceLabel:"feature check", description:"sessionStorage が利用可能かを確認します。", value:!!window.sessionStorage, originText:"Window オブジェクトの機能有無", code:"!!window.sessionStorage"},
      {name:"window.indexedDB", sourceLabel:"feature check", description:"indexedDB が利用可能かを確認します。", value:!!window.indexedDB, originText:"Window オブジェクトの機能有無", code:"!!window.indexedDB"},
      {name:"matchMedia(prefers-color-scheme)", sourceLabel:"feature check", description:"ダークモード設定を確認する例です。", value:window.matchMedia('(prefers-color-scheme: dark)').matches, originText:"ブラウザ / OS の表示設定", code:"window.matchMedia('(prefers-color-scheme: dark)').matches"}
    ]
  };
}

function renderAll(){
  setStatus("情報を取得しています...");
  const data = collectLearningData();
  renderSection("locationInfo", data.locationItems);
  renderSection("documentInfo", data.documentItems);
  renderSection("navigatorInfo", data.navigatorItems);
  renderSection("screenInfo", data.screenItems);
  renderSection("intlInfo", data.intlItems);
  renderSection("performanceInfo", data.performanceItems);
  renderSection("featureInfo", data.featureItems);
  document.getElementById("jsonOutput").textContent = JSON.stringify(data, null, 2);
  window.latestLearningData = data;
  setStatus("取得完了");
}

async function copyJson(){
  const text = document.getElementById("jsonOutput").textContent;
  try{
    await navigator.clipboard.writeText(text);
    setStatus("JSONをコピーしました。");
  }catch(error){
    setStatus("コピーに失敗しました。");
  }
}

function toggleRawCode(){
  document.body.classList.toggle("hide-code");
  const hidden = document.body.classList.contains("hide-code");
  setStatus(hidden ? "コード例を非表示にしました。" : "コード例を表示しました。");
}

window.addEventListener("load", () => {
  renderAll();
  document.getElementById("reloadButton").addEventListener("click", renderAll);
  document.getElementById("copyJsonButton").addEventListener("click", copyJson);
  document.getElementById("toggleRawButton").addEventListener("click", toggleRawCode);
});

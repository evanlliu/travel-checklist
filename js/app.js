/* v1.6.4 */
(function () {
  const CONFIG = window.CHECKLIST_CONFIG || {};
  const TOKEN_KEY = "travelChecklist.authToken.v1";
  const LOCAL_DATA_KEY = "travelChecklist.localData.v1";
  const CONNECTION_KEY = "travelChecklist.connection.v1";
  const APP_VERSION = CONFIG.APP_VERSION || "v1.6.4";

  let API_BASE = sanitizeApiBase(CONFIG.API_BASE || "");
  let APP_PASSWORD_VALUE = CONFIG.APP_PASSWORD || "";

  const I18N = {
    "zh-CN": {
      loginTitle: "旅行清单",
      loginSubtitle: "设置 Cloudflare Worker 地址和访问密码后，会直接同步 data.json。",
      workerUrl: "Cloudflare Worker 地址",
      workerUrlPlaceholder: "https://你的worker地址.workers.dev",
      password: "访问密码",
      login: "保存并同步",
      loginTip: "第一次使用需要手动填写；同步成功后会写入 data.json，其他设备可自动读取。请使用专用密码，不要使用重要账号密码。",
      appEyebrow: "Checklist",
      sync: "同步",
      settings: "设置",
      menu: "菜单",
      queryConditions: "查询条件",
      currentChecklist: "当前清单",
      manageChecklists: "管理清单",
      needBuy: "待购买",
      toPack: "待打包",
      mustOpen: "必须未完成",
      done: "已完成",
      addItem: "新增",
      active: "未完成",
      must: "必须",
      optional: "可选",
      all: "全部",
      searchPlaceholder: "搜索物品 / 备注",
      emptyTitle: "没有找到物品",
      emptySubtitle: "换一个筛选条件，或者新增一个清单物品。",
      itemName: "物品名称",
      itemType: "类型",
      category: "分类",
      priority: "重要性",
      quantity: "数量",
      note: "备注",
      cancel: "取消",
      save: "保存",
      language: "语言",
      hideDone: "默认隐藏已完成",
      showCategoryOnMain: "主页面显示分类",
      showCategoryInEditor: "编辑页面显示填写分类",
      pageZoom: "页面缩放",
      connectionSettings: "Cloudflare 同步配置",
      saveConnection: "保存配置并重新同步",
      edit: "编辑",
      delete: "删除",
      restore: "恢复",
      resetStatus: "恢复初始",
      clearFilters: "清空",
      boughtAction: "已购买",
      packedAction: "已打包",
      completeAction: "完成",
      pin: "置顶",
      unpin: "取消置顶",
      pinned: "置顶",
      pinOnForm: "置顶显示",
      dragSort: "拖动排序",
      actionReordered: "调整了排序",
      actionResetStatus: "恢复了 {name}",
      confirmDelete: "确定删除这个物品吗？",
      actionAdded: "新增了",
      actionUpdated: "修改了",
      actionDeleted: "删除了",
      actionRestored: "恢复了",
      actionBought: "已购买",
      actionPacked: "已打包",
      actionPinned: "置顶了",
      actionUnpinned: "取消置顶",
      saving: "正在保存...",
      saved: "已同步",
      localSaved: "已保存到本地，配置 Cloudflare 后可同步到 data.json。",
      loading: "正在同步 data.json...",
      autoSyncing: "正在读取配置并自动同步 data.json...",
      configMissingHint: "未配置 Cloudflare，同步前请到设置里填写 Worker 地址和访问密码。",
      connectionSaved: "配置已保存并同步",
      conflict: "数据已被其他设备修改，是否重新加载最新数据？",
      loginFailed: "同步失败，请检查 Worker 地址和访问密码。",
      apiMissing: "请填写 Cloudflare Worker 地址。",
      passwordMissing: "请填写访问密码。",
      networkError: "网络或接口错误，请检查 Worker 地址、访问密码和 Cloudflare 配置。",
      checklistManagerTitle: "清单管理",
      createChecklist: "新建清单",
      checklistName: "清单名称",
      checklistNamePlaceholder: "例如：土耳其出行",
      checklistType: "清单类型",
      createMode: "创建方式",
      blankChecklist: "空白清单",
      copyCurrentChecklist: "复制当前清单",
      activeChecklists: "使用中",
      archivedChecklists: "已归档",
      enter: "进入",
      copy: "复制",
      rename: "重命名",
      archive: "归档",
      restoreChecklist: "恢复",
      checklistItems: "个物品",
      checklistOpenItems: "个未完成",
      noArchived: "暂无归档清单",
      noActive: "暂无使用中的清单",
      checklistRequired: "请输入清单名称。",
      checklistCreated: "清单已创建",
      checklistCopied: "清单已复制",
      checklistRenamed: "清单已重命名",
      checklistArchived: "清单已归档",
      checklistRestored: "清单已恢复",
      checklistDeleted: "清单已删除",
      needOneActive: "至少需要保留一个使用中的清单。",
      confirmArchiveChecklist: "确定归档这个清单吗？归档后默认不会出现在顶部选择器。",
      confirmDeleteChecklist: "确定删除这个清单吗？相关物品也会一起隐藏。",
      promptChecklistName: "请输入新的清单名称",
      copyNameSuffix: "副本",
      type_carry: "直接携带",
      type_buy: "只需购买",
      type_buy_and_carry: "购买后携带",
      status_need_buy: "待购买",
      status_bought: "已购买，待打包",
      status_to_pack: "待打包",
      status_packed: "已打包完成",
      status_done: "已完成",
      cat_all: "全部分类",
      cat_documents: "证件 / 资料",
      cat_money: "钱 / 银行卡",
      cat_electronics: "电子设备",
      cat_clothes: "衣服",
      cat_toiletries: "洗漱用品",
      cat_medicine: "药品",
      cat_work: "工作用品",
      cat_food: "食品 / 零食",
      cat_gifts: "礼物",
      cat_other: "其他",
      checklistType_travel: "旅行",
      checklistType_business: "出差",
      checklistType_shopping: "购物",
      checklistType_other: "其他"
    },
    "en-US": {
      loginTitle: "Travel Checklist",
      loginSubtitle: "Set your Cloudflare Worker URL and access password, then sync data.json directly.",
      workerUrl: "Cloudflare Worker URL",
      workerUrlPlaceholder: "https://your-worker.workers.dev",
      password: "Access password",
      login: "Save and Sync",
      loginTip: "Fill this in manually the first time. After a successful sync, it will be saved to data.json for other devices. Use a dedicated password, not an important account password.",
      appEyebrow: "Checklist",
      sync: "Sync",
      settings: "Settings",
      menu: "Menu",
      queryConditions: "Filters",
      currentChecklist: "Current List",
      manageChecklists: "Manage Lists",
      needBuy: "To Buy",
      toPack: "To Pack",
      mustOpen: "Must Open",
      done: "Done",
      addItem: "Add",
      active: "Open",
      must: "Must",
      optional: "Optional",
      all: "All",
      searchPlaceholder: "Search items / notes",
      emptyTitle: "No items found",
      emptySubtitle: "Try another filter or add a new checklist item.",
      itemName: "Item name",
      itemType: "Type",
      category: "Category",
      priority: "Priority",
      quantity: "Quantity",
      note: "Note",
      cancel: "Cancel",
      save: "Save",
      language: "Language",
      hideDone: "Hide completed by default",
      showCategoryOnMain: "Show category on main page",
      showCategoryInEditor: "Show category field in editor",
      pageZoom: "Page zoom",
      connectionSettings: "Cloudflare Sync Settings",
      saveConnection: "Save Settings and Resync",
      edit: "Edit",
      delete: "Delete",
      restore: "Restore",
      resetStatus: "Reset",
      clearFilters: "Clear",
      boughtAction: "Bought",
      packedAction: "Packed",
      completeAction: "Complete",
      pin: "Pin",
      unpin: "Unpin",
      pinned: "Pinned",
      pinOnForm: "Pin to top",
      dragSort: "Drag to reorder",
      actionReordered: "Reordered items",
      actionResetStatus: "Reset {name}",
      confirmDelete: "Delete this item?",
      actionAdded: "Added",
      actionUpdated: "Updated",
      actionDeleted: "Deleted",
      actionRestored: "Restored",
      actionBought: "Bought",
      actionPacked: "Packed",
      actionPinned: "Pinned",
      actionUnpinned: "Unpinned",
      saving: "Saving...",
      saved: "Synced",
      localSaved: "Saved locally. Configure Cloudflare to sync to data.json.",
      loading: "Syncing data.json...",
      autoSyncing: "Reading settings and syncing data.json...",
      configMissingHint: "Cloudflare is not configured. Open Settings and enter the Worker URL and password before syncing.",
      connectionSaved: "Settings saved and synced",
      conflict: "Data was changed on another device. Reload the latest data?",
      loginFailed: "Sync failed. Please check the Worker URL and access password.",
      apiMissing: "Please enter your Cloudflare Worker URL.",
      passwordMissing: "Please enter the access password.",
      networkError: "Network or API error. Please check the Worker URL, password, and Cloudflare settings.",
      checklistManagerTitle: "List Manager",
      createChecklist: "Create List",
      checklistName: "List name",
      checklistNamePlaceholder: "Example: Turkey Trip",
      checklistType: "List type",
      createMode: "Create mode",
      blankChecklist: "Blank list",
      copyCurrentChecklist: "Copy current list",
      activeChecklists: "Active",
      archivedChecklists: "Archived",
      enter: "Enter",
      copy: "Copy",
      rename: "Rename",
      archive: "Archive",
      restoreChecklist: "Restore",
      checklistItems: "items",
      checklistOpenItems: "open",
      noArchived: "No archived lists",
      noActive: "No active lists",
      checklistRequired: "Please enter a list name.",
      checklistCreated: "List created",
      checklistCopied: "List copied",
      checklistRenamed: "List renamed",
      checklistArchived: "List archived",
      checklistRestored: "List restored",
      checklistDeleted: "List deleted",
      needOneActive: "Keep at least one active list.",
      confirmArchiveChecklist: "Archive this list? Archived lists are hidden from the top selector by default.",
      confirmDeleteChecklist: "Delete this list? Its items will be hidden too.",
      promptChecklistName: "Enter the new list name",
      copyNameSuffix: "copy",
      type_carry: "Carry only",
      type_buy: "Buy only",
      type_buy_and_carry: "Buy and carry",
      status_need_buy: "To buy",
      status_bought: "Bought, to pack",
      status_to_pack: "To pack",
      status_packed: "Packed",
      status_done: "Done",
      cat_all: "All categories",
      cat_documents: "Documents",
      cat_money: "Money / Cards",
      cat_electronics: "Electronics",
      cat_clothes: "Clothes",
      cat_toiletries: "Toiletries",
      cat_medicine: "Medicine",
      cat_work: "Work items",
      cat_food: "Food / Snacks",
      cat_gifts: "Gifts",
      cat_other: "Other",
      checklistType_travel: "Travel",
      checklistType_business: "Business",
      checklistType_shopping: "Shopping",
      checklistType_other: "Other"
    }
  };

  const CATEGORIES = [
    "documents", "money", "electronics", "clothes", "toiletries",
    "medicine", "work", "food", "gifts", "other"
  ];
  const TYPES = ["carry", "buy", "buy_and_carry"];
  const PRIORITIES = ["must", "optional"];
  const CHECKLIST_TYPES = ["travel", "business", "shopping", "other"];
  const COMPLETED_STATUSES = ["packed", "done"];

  let appData = null;
  let currentFilter = "active";
  let currentCategory = "all";
  let currentSearch = "";
  let saveTimer = null;
  let isSaving = false;
  let pendingSaveMessage = "";

  function t(key) {
    const lang = getLang();
    return (I18N[lang] && I18N[lang][key]) || I18N["zh-CN"][key] || key;
  }

  function getLang() {
    return appData?.settings?.language || localStorage.getItem("travelChecklist.lang") || "zh-CN";
  }

  function clampPageScale(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return 100;
    return Math.min(130, Math.max(70, Math.round(parsed / 5) * 5));
  }

  function applyPageScale(value) {
    const scale = clampPageScale(value);
    document.documentElement.style.setProperty("--page-scale", String(scale / 100));
    document.body.style.zoom = String(scale / 100);
    $("#pageZoomRange").val(scale);
    $("#pageZoomValue").val(scale);
    $("#pageZoomDisplay").text(`${scale}%`);
  }

  function sanitizeApiBase(value) {
    return String(value || "").trim().replace(/\/+$/, "");
  }

  function readStoredConnection() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CONNECTION_KEY) || "{}");
      return normalizeConnection(parsed);
    } catch (_) {
      return normalizeConnection({});
    }
  }

  function normalizeConnection(value) {
    return {
      apiBase: sanitizeApiBase(value?.apiBase || value?.workerUrl || ""),
      appPassword: String(value?.appPassword || value?.password || "")
    };
  }

  function getDataConnection(data) {
    const settings = data?.settings || {};
    return normalizeConnection(settings.cloudflare || settings.connection || {});
  }

  function getCurrentConnection() {
    return normalizeConnection({ apiBase: API_BASE, appPassword: APP_PASSWORD_VALUE });
  }

  function setConnection(connection, persist) {
    const clean = normalizeConnection(connection);
    API_BASE = clean.apiBase;
    APP_PASSWORD_VALUE = clean.appPassword;
    if (persist) localStorage.setItem(CONNECTION_KEY, JSON.stringify(clean));
    applyConnectionToForms();
    return clean;
  }

  function applyConnectionToForms() {
    const conn = getCurrentConnection();
    $("#workerUrlInput, #settingsWorkerUrl").val(conn.apiBase);
    $("#passwordInput, #settingsPassword").val(conn.appPassword);
  }

  function persistConnectionToData() {
    if (!appData) return false;
    const conn = getCurrentConnection();
    if (!conn.apiBase || !conn.appPassword) return false;
    appData.settings = appData.settings || {};
    const old = getDataConnection(appData);
    if (old.apiBase === conn.apiBase && old.appPassword === conn.appPassword) return false;
    appData.settings.cloudflare = conn;
    appData.updatedAt = nowIso();
    return true;
  }

  function getToken() { return localStorage.getItem(TOKEN_KEY); }
  function setToken(token) { localStorage.setItem(TOKEN_KEY, token); }
  function clearToken() { localStorage.removeItem(TOKEN_KEY); }

  function uid(prefix = "item") {
    return prefix + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  }

  function nowIso() { return new Date().toISOString(); }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function localizedName(entity, fallback) {
    const value = entity?.name;
    if (!value) return fallback || "";
    if (typeof value === "string") return value;
    return value[getLang()] || value["zh-CN"] || value["en-US"] || Object.values(value)[0] || fallback || "";
  }

  function nameObject(name) {
    const text = String(name || "").trim();
    return { "zh-CN": text, "en-US": text };
  }

  function normalizeChecklist(raw, fallbackId) {
    const id = String(raw?.id || fallbackId || uid("checklist"));
    return {
      id,
      name: raw?.name || nameObject(id),
      type: CHECKLIST_TYPES.includes(raw?.type) ? raw.type : "travel",
      status: raw?.status === "archived" ? "archived" : "active",
      createdAt: String(raw?.createdAt || nowIso()),
      updatedAt: String(raw?.updatedAt || raw?.createdAt || nowIso()),
      deleted: Boolean(raw?.deleted)
    };
  }

  function fallbackData() {
    const ts = nowIso();
    return {
      appVersion: APP_VERSION,
      schemaVersion: 2,
      revision: 0,
      updatedAt: ts,
      settings: {
        language: "zh-CN",
        hideDone: true,
        showCategoryOnMain: true,
        showCategoryInEditor: true,
        pageScale: 100,
        currentChecklistId: "mexico-2026",
        currentTripId: "mexico-2026",
        cloudflare: { apiBase: "", appPassword: "" }
      },
      checklists: [{
        id: "mexico-2026",
        name: { "zh-CN": "墨西哥出行清单", "en-US": "Mexico Travel Checklist" },
        type: "travel",
        status: "active",
        createdAt: ts,
        updatedAt: ts,
        deleted: false
      }],
      trips: [{ id: "mexico-2026", name: { "zh-CN": "墨西哥出行清单", "en-US": "Mexico Travel Checklist" }, createdAt: ts }],
      items: []
    };
  }

  function normalizeData(data) {
    const fallback = fallbackData();
    const result = Object.assign({}, fallback, data || {});
    result.settings = Object.assign({}, fallback.settings, result.settings || {});
    result.settings.cloudflare = normalizeConnection(result.settings.cloudflare || result.settings.connection || fallback.settings.cloudflare);
    result.settings.showCategoryOnMain = result.settings.showCategoryOnMain !== false;
    result.settings.showCategoryInEditor = result.settings.showCategoryInEditor !== false;

    let checklistSource = Array.isArray(result.checklists) && result.checklists.length
      ? result.checklists
      : (Array.isArray(result.trips) && result.trips.length ? result.trips.map(trip => ({
        id: trip.id,
        name: trip.name,
        type: trip.type || "travel",
        status: trip.status || "active",
        createdAt: trip.createdAt,
        updatedAt: trip.updatedAt,
        deleted: trip.deleted
      })) : fallback.checklists);

    result.checklists = checklistSource.map((entry, index) => normalizeChecklist(entry, index === 0 ? "mexico-2026" : undefined));
    if (!result.checklists.some(list => !list.deleted)) result.checklists = fallback.checklists;

    const firstActive = result.checklists.find(list => !list.deleted && list.status !== "archived") || result.checklists.find(list => !list.deleted);
    const requestedId = result.settings.currentChecklistId || result.settings.currentTripId || firstActive?.id || "mexico-2026";
    const currentExists = result.checklists.find(list => !list.deleted && list.id === requestedId);
    result.settings.currentChecklistId = currentExists ? requestedId : firstActive?.id;
    result.settings.currentTripId = result.settings.currentChecklistId;

    result.trips = result.checklists.filter(list => !list.deleted).map(list => ({
      id: list.id,
      name: list.name,
      createdAt: list.createdAt
    }));

    result.items = Array.isArray(result.items) ? result.items : [];
    result.items = result.items.map(item => {
      const checklistId = String(item.checklistId || item.tripId || result.settings.currentChecklistId || firstActive?.id || "mexico-2026");
      return Object.assign({
        id: uid(),
        checklistId,
        tripId: checklistId,
        title: "",
        category: "other",
        type: "carry",
        status: "to_pack",
        priority: "optional",
        quantity: 1,
        note: "",
        createdAt: nowIso(),
        updatedAt: nowIso(),
        doneAt: null,
        pinned: false,
        pinnedAt: null,
        sortOrder: null,
        deleted: false
      }, item, { checklistId, tripId: checklistId });
    });

    result.items.forEach(item => {
      const order = Number(item.sortOrder);
      item.sortOrder = Number.isFinite(order) ? order : null;
    });

    result.schemaVersion = 2;
    result.appVersion = result.appVersion || APP_VERSION;
    return result;
  }

  async function apiFetch(path, options = {}) {
    if (!API_BASE) throw new Error("API_BASE_MISSING");
    const headers = Object.assign({ "Content-Type": "application/json" }, options.headers || {});
    const token = getToken();
    if (token) headers.Authorization = "Bearer " + token;
    const response = await fetch(API_BASE + path, Object.assign({}, options, { headers, cache: "no-store" }));
    let payload = null;
    const text = await response.text();
    if (text) {
      try { payload = JSON.parse(text); } catch (_) { payload = { message: text }; }
    }
    if (!response.ok) {
      const err = new Error(payload?.message || response.statusText);
      err.status = response.status;
      err.payload = payload;
      throw err;
    }
    return payload;
  }

  async function login(password) {
    const pass = String(password || APP_PASSWORD_VALUE || "");
    if (!API_BASE) throw new Error("API_BASE_MISSING");
    if (!pass) throw new Error("PASSWORD_MISSING");
    const payload = await apiFetch("/api/login", { method: "POST", body: JSON.stringify({ password: pass }) });
    APP_PASSWORD_VALUE = pass;
    setToken(payload.token);
    setConnection(getCurrentConnection(), true);
  }

  async function fetchData(options = {}) {
    setSaveStatus(t("loading"), "warning");
    const payload = await apiFetch("/api/data", { method: "GET" });
    const beforeConn = getCurrentConnection();
    appData = normalizeData(payload.data);

    const remoteConn = getDataConnection(appData);
    const mode = options.connectionMode || "adopt-remote";
    if (mode === "save-local") {
      setConnection(beforeConn, true);
    } else if (remoteConn.apiBase || remoteConn.appPassword) {
      setConnection({
        apiBase: remoteConn.apiBase || beforeConn.apiBase,
        appPassword: remoteConn.appPassword || beforeConn.appPassword
      }, true);
    } else {
      setConnection(beforeConn, true);
    }

    currentFilter = appData.settings.hideDone === false ? "all" : "active";
    localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(appData));
    localStorage.setItem("travelChecklist.lang", appData.settings.language);
    setSaveStatus(formatSaveStatus(t("saved")), "success");
    showApp();
    renderAll();

    const shouldWriteConnection = mode === "save-local" || !remoteConn.apiBase || !remoteConn.appPassword;
    if (shouldWriteConnection && persistConnectionToData()) {
      await saveData({ silent: true });
      setSaveStatus(formatSaveStatus(t("connectionSaved")), "success");
    }
  }

  async function fetchDataWithRelogin(options = {}) {
    try {
      await fetchData(options);
    } catch (err) {
      if (err.status === 401 && APP_PASSWORD_VALUE) {
        clearToken();
        await login(APP_PASSWORD_VALUE);
        await fetchData(options);
        return;
      }
      throw err;
    }
  }

  async function saveData(options = {}) {
    if (!appData) return;
    if (isSaving) {
      if (options.actionMessage) pendingSaveMessage = options.actionMessage;
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => saveData({ actionMessage: pendingSaveMessage }), 500);
      return;
    }
    const actionMessage = options.actionMessage || pendingSaveMessage || "";
    pendingSaveMessage = "";
    appData.settings = appData.settings || {};
    appData.settings.currentTripId = appData.settings.currentChecklistId;
    appData.trips = (appData.checklists || []).filter(list => !list.deleted).map(list => ({ id: list.id, name: list.name, createdAt: list.createdAt }));
    appData.updatedAt = nowIso();
    appData.appVersion = APP_VERSION;
    appData.schemaVersion = 2;
    localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(appData));

    const conn = getCurrentConnection();
    if (!conn.apiBase || !conn.appPassword) {
      if (!options.silent) setSaveStatus(formatSaveStatus(t("localSaved"), actionMessage), "success");
      return;
    }

    isSaving = true;
    if (!options.silent) setSaveStatus(formatSaveStatus(t("saving"), actionMessage), "warning");
    try {
      const payload = await apiFetch("/api/data", {
        method: "PUT",
        body: JSON.stringify({ baseRevision: appData.revision || 0, data: appData })
      });
      appData = normalizeData(payload.data);
      const remoteConn = getDataConnection(appData);
      if (remoteConn.apiBase && remoteConn.appPassword) setConnection(remoteConn, true);
      localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(appData));
      if (!options.silent) setSaveStatus(formatSaveStatus(t("saved"), actionMessage), "success");
      renderAll();
    } catch (err) {
      if (err.status === 409) {
        const reload = window.confirm(t("conflict"));
        if (reload) await fetchData();
      } else {
        setSaveStatus(t("networkError"), "error");
        console.error(err);
      }
    } finally {
      isSaving = false;
    }
  }

  function scheduleSave(actionMessage = "") {
    if (actionMessage) pendingSaveMessage = actionMessage;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveData({ actionMessage: pendingSaveMessage }), 250);
  }

  function setSaveStatus(text, tone = "") {
    const $el = $("#saveStatus");
    const cleanText = text || "";
    $el.text(cleanText);
    if (cleanText) {
      $el.attr("data-tone", tone || "success");
    } else {
      $el.removeAttr("data-tone");
    }
  }

  function formatActionMessage(actionKey, title) {
    const cleanTitle = String(title || "").trim();
    if (!cleanTitle) return "";
    return getLang() === "zh-CN" ? `${t(actionKey)}${cleanTitle}` : `${t(actionKey)}: ${cleanTitle}`;
  }

  function formatSyncTime(date = new Date()) {
    const pad = value => String(value).padStart(2, "0");
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  function formatSaveStatus(baseText, actionMessage) {
    const text = String(baseText || "").trim();
    if (!text) return "";
    const baseWithTime = `${text} · ${formatSyncTime()}`;
    return actionMessage ? `${baseWithTime}：${actionMessage}` : baseWithTime;
  }
  function setLoginStatus(text, isError) { $("#loginStatus").prop("hidden", !text).toggleClass("error-text", Boolean(isError)).text(text || ""); }
  function setSettingsStatus(text, isError) { $("#settingsStatus").prop("hidden", !text).toggleClass("error-text", Boolean(isError)).text(text || ""); }
  function setChecklistStatus(text, isError) { $("#checklistStatus").prop("hidden", !text).toggleClass("error-text", Boolean(isError)).text(text || ""); }

  function showLogin() {
    $("#loginScreen").prop("hidden", false);
    $("#appShell").prop("hidden", true);
    applyI18n();
    applyConnectionToForms();
  }

  function showApp() {
    $("#loginScreen").prop("hidden", true);
    $("#appShell").prop("hidden", false);
  }

  function applyI18n() {
    const lang = getLang();
    document.documentElement.lang = lang;
    $("[data-i18n]").each(function () { $(this).text(t($(this).data("i18n"))); });
    $("[data-i18n-placeholder]").each(function () { $(this).attr("placeholder", t($(this).data("i18n-placeholder"))); });
    $("#syncBtn").attr({ "aria-label": t("sync"), "title": t("sync") });
    $("#langToggleBtn").attr({ "aria-label": t("language"), "title": t("language") });
    $("#filterToggleBtn").attr({ "aria-label": t("queryConditions"), "title": t("queryConditions") });
    $("#actionsMenuBtn").attr({ "aria-label": t("menu"), "title": t("menu") });
    $("#appVersionBadge").text(APP_VERSION);
    $("#floatingAddBtn").attr({ "aria-label": t("addItem"), "title": t("addItem") });
    populateSelects();
    applyCategoryVisibility();
    applyConnectionToForms();
  }

  function populateSelects() {
    const categoryOptions = [`<option value="all">${escapeHtml(t("cat_all"))}</option>`]
      .concat(CATEGORIES.map(c => `<option value="${c}">${escapeHtml(t("cat_" + c))}</option>`));
    $("#categoryFilter").html(categoryOptions.join("")).val(currentCategory);
    $("#itemCategory").html(CATEGORIES.map(c => `<option value="${c}">${escapeHtml(t("cat_" + c))}</option>`).join(""));
    $("#itemType").html(TYPES.map(type => `<option value="${type}">${escapeHtml(t("type_" + type))}</option>`).join(""));
    $("#itemPriority").html(PRIORITIES.map(p => `<option value="${p}">${escapeHtml(t(p))}</option>`).join(""));
    $("#checklistType").html(CHECKLIST_TYPES.map(type => `<option value="${type}">${escapeHtml(t("checklistType_" + type))}</option>`).join(""));
    $("#createMode").html(`<option value="blank">${escapeHtml(t("blankChecklist"))}</option><option value="copy">${escapeHtml(t("copyCurrentChecklist"))}</option>`);
  }

  function getActiveChecklists() {
    return (appData?.checklists || []).filter(list => !list.deleted && list.status !== "archived");
  }

  function getArchivedChecklists() {
    return (appData?.checklists || []).filter(list => !list.deleted && list.status === "archived");
  }

  function getCurrentChecklist() {
    const id = appData?.settings?.currentChecklistId || appData?.settings?.currentTripId;
    return (appData?.checklists || []).find(list => !list.deleted && list.id === id)
      || getActiveChecklists()[0]
      || (appData?.checklists || []).find(list => !list.deleted);
  }

  function setCurrentChecklist(id) {
    if (!appData) return;
    const found = (appData.checklists || []).find(list => !list.deleted && list.id === id);
    if (!found) return;
    appData.settings.currentChecklistId = found.id;
    appData.settings.currentTripId = found.id;
    currentFilter = appData.settings.hideDone === false ? "all" : "active";
    currentCategory = "all";
    currentSearch = "";
    $("#searchInput").val("");
  }

  function getChecklistItems(includeDeleted = false, checklistId) {
    const id = checklistId || getCurrentChecklist()?.id;
    return (appData?.items || []).filter(item => (item.checklistId || item.tripId) === id && (includeDeleted || !item.deleted));
  }

  function isDone(item) { return COMPLETED_STATUSES.includes(item.status); }
  function isPinned(item) { return Boolean(item && (item.pinned || item.pinnedAt)); }

  function getSortOrder(item) {
    const order = Number(item?.sortOrder);
    return Number.isFinite(order) ? order : null;
  }

  function compareItemsForDisplay(a, b) {
    const priorityRank = { must: 0, optional: 1 };
    const statusRank = { need_buy: 0, bought: 1, to_pack: 1, packed: 2, done: 2 };
    const pinnedDiff = (isPinned(b) ? 1 : 0) - (isPinned(a) ? 1 : 0);
    if (pinnedDiff) return pinnedDiff;

    // Only pinned rows can use manual drag order.
    // Normal rows always follow: must -> optional, need_buy -> to_pack -> done, then title.
    if (isPinned(a) && isPinned(b)) {
      const orderA = getSortOrder(a);
      const orderB = getSortOrder(b);
      if (orderA !== null || orderB !== null) {
        const orderDiff = (orderA ?? Number.MAX_SAFE_INTEGER) - (orderB ?? Number.MAX_SAFE_INTEGER);
        if (orderDiff) return orderDiff;
      }
    }

    return ((priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9))
      || ((statusRank[a.status] ?? 9) - (statusRank[b.status] ?? 9))
      || String(a.title || "").localeCompare(String(b.title || ""), getLang() === "zh-CN" ? "zh-Hans-CN" : "en-US");
  }

  function getNextSortOrder(checklistId) {
    const orders = getChecklistItems(true, checklistId).map(getSortOrder).filter(order => order !== null);
    return orders.length ? Math.max(...orders) + 1000 : 1000;
  }

  function getStats(items) {
    return {
      all: items.length,
      needBuy: items.filter(item => item.status === "need_buy").length,
      toPack: items.filter(item => item.status === "to_pack" || item.status === "bought").length,
      open: items.filter(item => !isDone(item)).length,
      mustOpen: items.filter(item => item.priority === "must" && !isDone(item)).length,
      done: items.filter(isDone).length
    };
  }

  function filterItems(items) {
    return items.filter(item => {
      if (currentCategory !== "all" && item.category !== currentCategory) return false;
      const q = currentSearch.trim().toLowerCase();
      if (q) {
        const haystack = `${item.title} ${item.note}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (currentFilter === "active") return !isDone(item);
      if (currentFilter === "need_buy") return item.status === "need_buy";
      if (currentFilter === "to_pack") return item.status === "to_pack" || item.status === "bought";
      if (currentFilter === "must") return item.priority === "must" && !isDone(item);
      if (currentFilter === "done") return isDone(item);
      return true;
    });
  }

  function shouldShowCategoryOnMain() {
    return appData?.settings?.showCategoryOnMain !== false;
  }

  function shouldShowCategoryInEditor() {
    return appData?.settings?.showCategoryInEditor !== false;
  }

  function applyCategoryVisibility() {
    const showMain = shouldShowCategoryOnMain();
    const showEditor = shouldShowCategoryInEditor();
    if (!showMain && currentCategory !== "all") {
      currentCategory = "all";
    }
    $("#categoryFilter").prop("hidden", !showMain);
    $("#filterPanel .toolbar").toggleClass("hide-category-filter", !showMain);
    $("#itemForm").toggleClass("hide-category-editor", !showEditor);
    $(".item-category-field").prop("hidden", !showEditor);
    $("#showCategoryOnMainSwitch").prop("checked", showMain);
    $("#showCategoryInEditorSwitch").prop("checked", showEditor);
  }

  function renderAll() {
    if (!appData) return;
    applyPageScale(appData?.settings?.pageScale);
    applyI18n();
    renderChecklistSelector();
    $("#hideDoneSwitch").prop("checked", Boolean(appData.settings.hideDone));
    applyCategoryVisibility();
    renderStats();
    renderTabs();
    renderFilterSummary();
    renderItems();
    renderChecklistManager();
  }

  function renderChecklistSelector() {
    const active = getActiveChecklists();
    const current = getCurrentChecklist();
    const options = active.slice();
    if (current && !options.some(list => list.id === current.id)) options.unshift(current);
    $("#checklistSelect").html(options.map(list => `<option value="${escapeHtml(list.id)}">${escapeHtml(localizedName(list, list.id))}</option>`).join(""));
    if (current) $("#checklistSelect").val(current.id);
  }

  function renderStats() {
    const stats = getStats(getChecklistItems());
    $("#statAll").text(stats.all);
    $("#statNeedBuy").text(stats.needBuy);
    $("#statToPack").text(stats.toPack);
    $("#statOpen").text(stats.open);
    $("#statDone").text(stats.done);
    $(".stat-card").removeClass("active");
    $(`.stat-card[data-stat-filter="${currentFilter}"]`).addClass("active");
  }

  function renderTabs() {
    $("#filterTabs .tab").removeClass("active");
    $(`#filterTabs .tab[data-filter="${currentFilter}"]`).addClass("active");
  }

  function renderFilterSummary() {
    const filterMap = { active: "active", need_buy: "needBuy", to_pack: "toPack", must: "must", done: "done", all: "all" };
    const parts = [t(filterMap[currentFilter] || "active")];
    if (currentCategory && currentCategory !== "all") parts.push(t("cat_" + currentCategory));
    if (currentSearch) parts.push(currentSearch);
    $("#filterSummary").text(parts.join(" / "));
  }

  function toggleActionMenu(forceOpen) {
    const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : $("#actionsMenu").prop("hidden");
    $("#actionsMenu").prop("hidden", !shouldOpen);
    $("#actionsMenuBtn").attr("aria-expanded", String(shouldOpen));
  }

  function closeActionMenu() { toggleActionMenu(false); }

  function updateSwipedRowState() {
    $("body").toggleClass("has-swiped-row", $("#itemList .item-card.swiped").length > 0);
  }

  function closeSwipedRows() {
    $("#itemList .item-card.swiped").removeClass("swiped");
    updateSwipedRowState();
  }

  function closeTransientPanels() {
    closeActionMenu();
    toggleFilterPanel(false);
    closeSwipedRows();
  }

  function setModalOpenState(isOpen) {
    if (isOpen) {
      $("body").addClass("modal-open");
      return;
    }
    const hasOpenModal = $("#itemModal, #settingsModal, #checklistModal").filter(function () { return !this.hidden; }).length > 0;
    if (!hasOpenModal) $("body").removeClass("modal-open");
  }

  function openModal($modal) {
    closeTransientPanels();
    $modal.prop("hidden", false);
    setModalOpenState(true);
  }

  function closeModal($modal) {
    $modal.prop("hidden", true);
    setModalOpenState(false);
  }

  function toggleFilterPanel(forceOpen) {
    const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : $("#filterPanel").prop("hidden");
    $("#filterPanel").prop("hidden", !shouldOpen);
    $("#filterToggleBtn").attr("aria-expanded", String(shouldOpen));
  }

  function renderItems() {
    const items = filterItems(getChecklistItems()).sort(compareItemsForDisplay);
    $("#itemList").empty();
    $("#emptyState").prop("hidden", items.length > 0);
    items.forEach(item => $("#itemList").append(renderItemCard(item)));
    updateSwipedRowState();
  }

  function renderItemCard(item) {
    const doneClass = isDone(item) ? " done-card" : "";
    const pinnedClass = isPinned(item) ? " is-pinned" : "";
    const noteHtml = item.note ? `<p class="item-note compact-note">${escapeHtml(item.note)}</p>` : "";
    const next = nextAction(item);
    const primaryAction = next ? `<button class="primary-btn item-next" type="button" data-id="${escapeHtml(item.id)}">${escapeHtml(next.label)}</button>` : "";
    const restoreAction = canResetStatus(item) ? `<button class="small-ghost item-restore" type="button" data-id="${escapeHtml(item.id)}" title="${escapeHtml(t("resetStatus"))}">${escapeHtml(t("resetStatus"))}</button>` : "";
    const pinAction = `<button class="small-ghost item-pin${isPinned(item) ? " active" : ""}" type="button" data-id="${escapeHtml(item.id)}">${escapeHtml(t(isPinned(item) ? "unpin" : "pin"))}</button>`;
    const priorityClass = item.priority === "must" ? " must" : "";
    const pinnedPill = isPinned(item) ? `<span class="pin-pill">${escapeHtml(t("pinned"))}</span>` : "";
    const noteToggleHint = item.note ? " has-note" : "";
    const dragHandle = isPinned(item)
      ? `<button class="drag-handle" type="button" draggable="false" aria-label="${escapeHtml(t("dragSort"))}" title="${escapeHtml(t("dragSort"))}"><span class="drag-dot-grid" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span></span></button>`
      : `<span class="drag-handle-placeholder" aria-hidden="true"></span>`;
    return `
      <article class="item-card compact-item status-${escapeHtml(item.status)} priority-${escapeHtml(item.priority)}${doneClass}${pinnedClass}${noteToggleHint}" data-id="${escapeHtml(item.id)}">
        <div class="item-swipe-content">
          <div class="row-main">
            <span class="status-bar" aria-hidden="true"></span>
            ${dragHandle}
            <div class="item-primary">
              <div class="title-line">
                <h2 class="item-title">${escapeHtml(item.title)}</h2>
                ${pinnedPill}
                <span class="priority-pill${priorityClass}">${escapeHtml(t(item.priority))}</span>
                <span class="mobile-status-pill">${escapeHtml(t("status_" + item.status))}</span>
              </div>
              <div class="item-meta">
                ${shouldShowCategoryOnMain() ? `<span>${escapeHtml(t("cat_" + item.category))}</span>` : ""}
                <span>${escapeHtml(t("status_" + item.status))}</span>
                <span class="desktop-only">${escapeHtml(t("type_" + item.type))}</span>
              </div>
              ${noteHtml}
            </div>
            <div class="item-side">
              <span class="item-qty">×${Number(item.quantity || 1)}</span>
              <span class="status-chip status-${escapeHtml(item.status)}">${escapeHtml(t("status_" + item.status))}</span>
            </div>
          </div>
        </div>
        <div class="item-actions">
          ${primaryAction}
          ${restoreAction}
          ${pinAction}
          <button class="small-ghost item-edit" type="button" data-id="${escapeHtml(item.id)}">${escapeHtml(t("edit"))}</button>
          <button class="small-danger item-delete" type="button" data-id="${escapeHtml(item.id)}">${escapeHtml(t("delete"))}</button>
        </div>
      </article>`;
  }

  function nextAction(item) {
    if (item.status === "need_buy") return { label: t("boughtAction"), status: item.type === "buy" ? "done" : "bought" };
    if (item.status === "bought") return { label: t("packedAction"), status: "packed" };
    if (item.status === "to_pack") return { label: t("packedAction"), status: "packed" };
    return null;
  }

  function findItem(id) { return (appData.items || []).find(item => item.id === id); }

  function mutateItem(id, updater, actionMessage = "") {
    const item = findItem(id);
    if (!item) return;
    updater(item);
    item.updatedAt = nowIso();
    item.checklistId = item.checklistId || item.tripId || getCurrentChecklist()?.id;
    item.tripId = item.checklistId;
    scheduleSave(actionMessage || formatActionMessage("actionUpdated", item.title));
    renderAll();
  }

  function openItemModal(item) {
    populateSelects();
    applyCategoryVisibility();
    if (item) {
      $("#modalTitle").text(t("edit"));
      $("#editingItemId").val(item.id);
      $("#itemTitle").val(item.title);
      $("#itemType").val(item.type);
      $("#itemCategory").val(item.category);
      $("#itemPriority").val(item.priority);
      $("#itemQuantity").val(item.quantity || 1);
      $("#itemNote").val(item.note || "");
      $("#itemPinned").prop("checked", isPinned(item));
    } else {
      $("#modalTitle").text(t("addItem"));
      $("#editingItemId").val("");
      $("#itemTitle").val("");
      $("#itemType").val("carry");
      $("#itemCategory").val("other");
      $("#itemPriority").val("must");
      $("#itemQuantity").val(1);
      $("#itemNote").val("");
      $("#itemPinned").prop("checked", false);
    }
    openModal($("#itemModal"));
    setTimeout(() => $("#itemTitle").trigger("focus"), 60);
  }

  function closeItemModal() { closeModal($("#itemModal")); }

  function openSettings() {
    $("#hideDoneSwitch").prop("checked", Boolean(appData?.settings?.hideDone));
    $("#showCategoryOnMainSwitch").prop("checked", shouldShowCategoryOnMain());
    $("#showCategoryInEditorSwitch").prop("checked", shouldShowCategoryInEditor());
    applyPageScale(appData?.settings?.pageScale);
    applyCategoryVisibility();
    applyConnectionToForms();
    setSettingsStatus("", false);
    openModal($("#settingsModal"));
  }

  function closeSettings() { closeModal($("#settingsModal")); }
  function openChecklistModal() { renderChecklistManager(); setChecklistStatus("", false); openModal($("#checklistModal")); }
  function closeChecklistModal() { closeModal($("#checklistModal")); }

  function initialStatus(type) { return type === "carry" ? "to_pack" : "need_buy"; }

  function canResetStatus(item) {
    return Boolean(item && item.status && item.status !== initialStatus(item.type));
  }

  function saveItemFromForm() {
    const id = $("#editingItemId").val();
    const type = $("#itemType").val();
    const formData = {
      title: $("#itemTitle").val().trim(),
      type,
      category: $("#itemCategory").val() || "other",
      priority: $("#itemPriority").val(),
      quantity: Math.max(1, parseInt($("#itemQuantity").val(), 10) || 1),
      note: $("#itemNote").val().trim(),
      formPinned: $("#itemPinned").prop("checked"),
      updatedAt: nowIso()
    };
    if (!formData.title) return;
    const shouldPin = Boolean(formData.formPinned);
    delete formData.formPinned;

    const actionMessage = formatActionMessage(id ? "actionUpdated" : "actionAdded", formData.title);

    if (id) {
      const item = findItem(id);
      if (!item) return;
      const oldType = item.type;
      Object.assign(item, formData);
      if (shouldPin && !isPinned(item)) {
        item.pinned = true;
        item.pinnedAt = nowIso();
        item.sortOrder = getNextSortOrder(item.checklistId || item.tripId || getCurrentChecklist()?.id);
      } else if (!shouldPin && isPinned(item)) {
        item.pinned = false;
        item.pinnedAt = null;
        item.sortOrder = null;
      } else if (shouldPin) {
        item.pinned = true;
        item.pinnedAt = item.pinnedAt || nowIso();
        item.sortOrder = getSortOrder(item) ?? getNextSortOrder(item.checklistId || item.tripId || getCurrentChecklist()?.id);
      }
      if (oldType !== type && isDone(item) === false) item.status = initialStatus(type);
      item.checklistId = item.checklistId || item.tripId || getCurrentChecklist()?.id;
      item.tripId = item.checklistId;
    } else {
      const checklistId = getCurrentChecklist()?.id || appData.settings.currentChecklistId;
      appData.items.push(Object.assign({
        id: uid(),
        checklistId,
        tripId: checklistId,
        status: initialStatus(type),
        createdAt: nowIso(),
        doneAt: null,
        pinned: shouldPin,
        pinnedAt: shouldPin ? nowIso() : null,
        sortOrder: shouldPin ? getNextSortOrder(checklistId) : null,
        deleted: false
      }, formData));
    }
    closeItemModal();
    scheduleSave(actionMessage);
    renderAll();
  }

  function createChecklist(name, type, mode) {
    const text = String(name || "").trim();
    if (!text) { setChecklistStatus(t("checklistRequired"), true); return; }
    const id = uid("checklist");
    const now = nowIso();
    const list = { id, name: nameObject(text), type: type || "travel", status: "active", createdAt: now, updatedAt: now, deleted: false };
    appData.checklists.push(list);

    if (mode === "copy") {
      const sourceId = getCurrentChecklist()?.id;
      getChecklistItems(false, sourceId).forEach(item => {
        const copy = Object.assign({}, item, {
          id: uid(),
          checklistId: id,
          tripId: id,
          status: initialStatus(item.type),
          doneAt: null,
          pinned: false,
          pinnedAt: null,
          deleted: false,
          createdAt: now,
          updatedAt: now
        });
        appData.items.push(copy);
      });
    }

    setCurrentChecklist(id);
    $("#checklistName").val("");
    $("#createMode").val("blank");
    setChecklistStatus(t("checklistCreated"), false);
    scheduleSave();
    renderAll();
  }

  function copyChecklist(id) {
    const source = appData.checklists.find(list => !list.deleted && list.id === id);
    if (!source) return;
    const defaultName = `${localizedName(source, source.id)} ${t("copyNameSuffix")}`;
    const name = window.prompt(t("promptChecklistName"), defaultName);
    if (!name || !name.trim()) return;
    const oldCurrent = getCurrentChecklist()?.id;
    setCurrentChecklist(source.id);
    createChecklist(name, source.type || "travel", "copy");
    if (oldCurrent && oldCurrent !== source.id) {
      // createChecklist switches to the new copy by design.
    }
    setChecklistStatus(t("checklistCopied"), false);
  }

  function renameChecklist(id) {
    const list = appData.checklists.find(entry => !entry.deleted && entry.id === id);
    if (!list) return;
    const name = window.prompt(t("promptChecklistName"), localizedName(list, list.id));
    if (!name || !name.trim()) return;
    list.name = nameObject(name.trim());
    list.updatedAt = nowIso();
    setChecklistStatus(t("checklistRenamed"), false);
    scheduleSave();
    renderAll();
  }

  function archiveChecklist(id) {
    const activeCount = getActiveChecklists().length;
    if (activeCount <= 1) { setChecklistStatus(t("needOneActive"), true); return; }
    if (!window.confirm(t("confirmArchiveChecklist"))) return;
    const list = appData.checklists.find(entry => !entry.deleted && entry.id === id);
    if (!list) return;
    list.status = "archived";
    list.updatedAt = nowIso();
    if (getCurrentChecklist()?.id === id) {
      const next = getActiveChecklists().find(entry => entry.id !== id);
      if (next) setCurrentChecklist(next.id);
    }
    setChecklistStatus(t("checklistArchived"), false);
    scheduleSave();
    renderAll();
  }

  function restoreChecklist(id) {
    const list = appData.checklists.find(entry => !entry.deleted && entry.id === id);
    if (!list) return;
    list.status = "active";
    list.updatedAt = nowIso();
    setCurrentChecklist(id);
    setChecklistStatus(t("checklistRestored"), false);
    scheduleSave();
    renderAll();
  }

  function deleteChecklist(id) {
    const active = getActiveChecklists();
    const target = appData.checklists.find(entry => !entry.deleted && entry.id === id);
    if (!target) return;
    const wasCurrent = appData.settings.currentChecklistId === id || appData.settings.currentTripId === id;
    if (target.status !== "archived" && active.length <= 1) { setChecklistStatus(t("needOneActive"), true); return; }
    if (!window.confirm(t("confirmDeleteChecklist"))) return;
    target.deleted = true;
    target.updatedAt = nowIso();
    appData.items.forEach(item => {
      if ((item.checklistId || item.tripId) === id) {
        item.deleted = true;
        item.updatedAt = nowIso();
      }
    });
    if (wasCurrent) {
      const next = getActiveChecklists().find(entry => entry.id !== id) || appData.checklists.find(entry => !entry.deleted && entry.id !== id);
      if (next) setCurrentChecklist(next.id);
    }
    setChecklistStatus(t("checklistDeleted"), false);
    scheduleSave();
    renderAll();
  }

  function checklistMeta(id) {
    const items = getChecklistItems(false, id);
    const open = items.filter(item => !isDone(item)).length;
    return { total: items.length, open };
  }

  function renderChecklistManager() {
    if (!appData || !$("#activeChecklistList").length) return;
    const active = getActiveChecklists();
    const archived = getArchivedChecklists();
    $("#activeChecklistList").html(active.length ? active.map(renderChecklistRow).join("") : `<p class="empty-mini">${escapeHtml(t("noActive"))}</p>`);
    $("#archivedChecklistList").html(archived.length ? archived.map(renderChecklistRow).join("") : `<p class="empty-mini">${escapeHtml(t("noArchived"))}</p>`);
  }

  function renderChecklistRow(list) {
    const meta = checklistMeta(list.id);
    const current = getCurrentChecklist()?.id === list.id;
    const archived = list.status === "archived";
    const typeLabel = t("checklistType_" + (list.type || "other"));
    const enterButton = !archived ? `<button class="small-ghost checklist-action" type="button" data-action="enter" data-id="${escapeHtml(list.id)}">${escapeHtml(t("enter"))}</button>` : "";
    const archiveOrRestore = archived
      ? `<button class="small-ghost checklist-action" type="button" data-action="restore" data-id="${escapeHtml(list.id)}">${escapeHtml(t("restoreChecklist"))}</button>`
      : `<button class="small-ghost checklist-action" type="button" data-action="archive" data-id="${escapeHtml(list.id)}">${escapeHtml(t("archive"))}</button>`;
    return `
      <article class="checklist-card ${current ? "current" : ""}">
        <div class="checklist-card-main">
          <h3>${escapeHtml(localizedName(list, list.id))}</h3>
          <p>${escapeHtml(typeLabel)} · ${meta.total} ${escapeHtml(t("checklistItems"))} · ${meta.open} ${escapeHtml(t("checklistOpenItems"))}</p>
        </div>
        <div class="checklist-card-actions">
          ${enterButton}
          <button class="small-ghost checklist-action" type="button" data-action="copy" data-id="${escapeHtml(list.id)}">${escapeHtml(t("copy"))}</button>
          <button class="small-ghost checklist-action" type="button" data-action="rename" data-id="${escapeHtml(list.id)}">${escapeHtml(t("rename"))}</button>
          ${archiveOrRestore}
          <button class="small-danger checklist-action" type="button" data-action="delete" data-id="${escapeHtml(list.id)}">${escapeHtml(t("delete"))}</button>
        </div>
      </article>`;
  }

  function loadLocalDataIfAny() {
    const cached = localStorage.getItem(LOCAL_DATA_KEY);
    if (!cached) return false;
    try {
      appData = normalizeData(JSON.parse(cached));
      currentFilter = appData.settings.hideDone === false ? "all" : "active";
      localStorage.setItem("travelChecklist.lang", appData.settings.language);
      showApp();
      renderAll();
      return true;
    } catch (_) { return false; }
  }

  async function loadStaticDataIfAny() {
    try {
      const response = await fetch("data.json?_=" + Date.now(), { cache: "no-store" });
      if (!response.ok) return false;
      appData = normalizeData(await response.json());
      const dataConn = getDataConnection(appData);
      const currentConn = getCurrentConnection();
      if (dataConn.apiBase || dataConn.appPassword) {
        setConnection({ apiBase: currentConn.apiBase || dataConn.apiBase, appPassword: currentConn.appPassword || dataConn.appPassword }, true);
      }
      currentFilter = appData.settings.hideDone === false ? "all" : "active";
      localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(appData));
      localStorage.setItem("travelChecklist.lang", appData.settings.language);
      showApp();
      renderAll();
      return true;
    } catch (_) { return false; }
  }

  function loadEmptyData() {
    appData = normalizeData(null);
    currentFilter = appData.settings.hideDone === false ? "all" : "active";
    showApp();
    renderAll();
  }

  async function bootstrapConnectionFromStaticData() {
    const stored = readStoredConnection();
    if (stored.apiBase && stored.appPassword) { setConnection(stored, true); return; }
    const configConn = normalizeConnection({ apiBase: CONFIG.API_BASE, appPassword: CONFIG.APP_PASSWORD });
    if (configConn.apiBase && configConn.appPassword) { setConnection(configConn, true); return; }
    try {
      const response = await fetch("data.json?_=" + Date.now(), { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      const dataConn = getDataConnection(data);
      if (dataConn.apiBase || dataConn.appPassword) {
        setConnection({ apiBase: stored.apiBase || dataConn.apiBase, appPassword: stored.appPassword || dataConn.appPassword }, true);
      }
    } catch (_) {}
  }

  function readConnectionFromLoginForm() { return normalizeConnection({ apiBase: $("#workerUrlInput").val(), appPassword: $("#passwordInput").val() }); }
  function readConnectionFromSettingsForm() { return normalizeConnection({ apiBase: $("#settingsWorkerUrl").val(), appPassword: $("#settingsPassword").val() }); }

  function connectionErrorMessage(err) {
    if (err.message === "API_BASE_MISSING") return t("apiMissing");
    if (err.message === "PASSWORD_MISSING") return t("passwordMissing");
    if (err.status === 401) return t("loginFailed");
    return t("networkError");
  }

  async function connectAndSync(connection, fromSettings) {
    const clean = setConnection(connection, true);
    if (!clean.apiBase) throw new Error("API_BASE_MISSING");
    if (!clean.appPassword) throw new Error("PASSWORD_MISSING");
    clearToken();
    await login(clean.appPassword);
    await fetchDataWithRelogin({ connectionMode: "save-local" });
    if (persistConnectionToData()) await saveData({ silent: true });
    if (fromSettings) setSaveStatus(formatSaveStatus(t("connectionSaved")), "success");
  }

  function persistVisibleOrderAfterDrag(actionMessage) {
    const checklistId = getCurrentChecklist()?.id;
    if (!checklistId) return;

    const visibleIds = $("#itemList .item-card.is-pinned").map(function () { return String($(this).data("id")); }).get();
    if (visibleIds.length < 2) return;

    const visibleSet = new Set(visibleIds);
    const visibleQueue = visibleIds.slice();
    const currentPinnedItems = getChecklistItems(false, checklistId).filter(isPinned).slice().sort(compareItemsForDisplay);

    const reorderedPinned = currentPinnedItems.map(item => {
      if (!visibleSet.has(item.id)) return item;
      const nextId = visibleQueue.shift();
      return findItem(nextId) || item;
    }).filter(Boolean);

    const now = nowIso();
    reorderedPinned.forEach((item, index) => {
      item.sortOrder = (index + 1) * 1000;
      item.updatedAt = now;
    });

    scheduleSave(actionMessage || t("actionReordered"));
    renderAll();
  }

  function bindRowDragEvents() {
    let dragState = null;

    $("#itemList").on("selectstart contextmenu", ".drag-handle, .drag-handle *", function (event) {
      event.preventDefault();
    });

    function cleanupDrag(saveOrder) {
      if (!dragState) return;
      const state = dragState;
      dragState = null;

      state.card.removeClass("is-dragging").css({
        position: "",
        left: "",
        top: "",
        width: "",
        zIndex: "",
        pointerEvents: ""
      });

      state.placeholder.before(state.card);
      const endIndex = state.placeholder.index();
      state.placeholder.remove();
      $("body").removeClass("row-dragging");

      if (saveOrder && state.startIndex !== endIndex) {
        persistVisibleOrderAfterDrag(t("actionReordered"));
      }
    }

    $("#itemList").on("pointerdown", ".drag-handle", function (event) {
      if (!appData) return;
      if (event.originalEvent.pointerType === "mouse" && event.originalEvent.button !== 0) return;

      const $card = $(this).closest(".item-card");
      if (!$card.length) return;
      const dragItem = findItem(String($card.data("id")));
      if (!isPinned(dragItem)) return;

      event.preventDefault();
      event.stopPropagation();

      closeTransientPanels();

      const rect = $card[0].getBoundingClientRect();
      const $placeholder = $('<div class="drag-placeholder" aria-hidden="true"></div>').height(rect.height);
      $card.after($placeholder);

      dragState = {
        card: $card,
        placeholder: $placeholder,
        pointerId: event.originalEvent.pointerId,
        offsetY: event.originalEvent.clientY - rect.top,
        startIndex: $placeholder.index()
      };

      $("body").addClass("row-dragging");
      $card.addClass("is-dragging").css({
        position: "fixed",
        left: rect.left + "px",
        top: rect.top + "px",
        width: rect.width + "px",
        zIndex: 1500,
        pointerEvents: "none"
      });

      if (this.setPointerCapture) {
        try { this.setPointerCapture(event.originalEvent.pointerId); } catch (_) {}
      }
    });

    $(document).on("pointermove", function (event) {
      if (!dragState) return;
      event.preventDefault();

      const y = event.originalEvent.clientY;
      dragState.card.css("top", (y - dragState.offsetY) + "px");

      let placed = false;
      const pinnedCards = $("#itemList .item-card.is-pinned").not(dragState.card);
      pinnedCards.each(function () {
        const rect = this.getBoundingClientRect();
        if (y < rect.top + rect.height / 2) {
          dragState.placeholder.insertBefore(this);
          placed = true;
          return false;
        }
      });

      if (!placed) {
        if (pinnedCards.length) {
          dragState.placeholder.insertAfter(pinnedCards.last());
        } else {
          $("#itemList").prepend(dragState.placeholder);
        }
      }
    });

    $(document).on("pointerup pointercancel", function (event) {
      if (!dragState) return;
      const shouldSave = event.type === "pointerup";
      cleanupDrag(shouldSave);
    });
  }

  function bindMobileSwipeEvents() {
    let startX = 0;
    let startY = 0;
    let activeCard = null;
    let tracking = false;
    let gestureMode = "none";

    function isMobileSwipeMode() {
      return window.matchMedia("(max-width: 760px)").matches;
    }

    function closeOtherCards(card) {
      $("#itemList .item-card.swiped").not(card || []).removeClass("swiped");
      updateSwipedRowState();
    }

    function resetSwipeTracking() {
      startX = 0;
      startY = 0;
      activeCard = null;
      tracking = false;
      gestureMode = "none";
    }

    $(document).on("click", function (event) {
      if (!$(event.target).closest(".item-card").length) closeOtherCards();
    });

    $("#itemList").on("touchstart", ".item-card", function (event) {
      if (!isMobileSwipeMode()) return;
      if ($(event.target).closest("button, a, input, select, textarea").length) return;
      const touch = event.originalEvent.touches && event.originalEvent.touches[0];
      if (!touch) return;
      startX = touch.clientX;
      startY = touch.clientY;
      activeCard = this;
      tracking = true;
      gestureMode = "none";
    });

    $("#itemList").on("touchmove", ".item-card", function (event) {
      if (!tracking || !activeCard || !isMobileSwipeMode()) return;
      const touch = event.originalEvent.touches && event.originalEvent.touches[0];
      if (!touch) return;

      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (gestureMode === "none") {
        // A vertical gesture must stay fully native, so touching a row can still scroll the page.
        if (absY >= 8 && absY >= absX * 0.9) {
          resetSwipeTracking();
          return;
        }

        // Only a clear horizontal gesture becomes a swipe action.
        if (absX >= 28 && absX >= absY * 1.8) {
          gestureMode = "horizontal";
        }
      }

      if (gestureMode === "horizontal" && event.originalEvent.cancelable) {
        event.preventDefault();
      }
    });

    $("#itemList").on("touchend", ".item-card", function (event) {
      if (!tracking || !activeCard || !isMobileSwipeMode() || gestureMode !== "horizontal") {
        resetSwipeTracking();
        return;
      }

      const touch = (event.originalEvent.changedTouches && event.originalEvent.changedTouches[0]) || null;
      if (!touch) {
        resetSwipeTracking();
        return;
      }

      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (absX > 70 && absX > absY * 1.7 && absY < 42) {
        if (dx < 0) {
          closeOtherCards(activeCard);
          $(activeCard).addClass("swiped");
        } else {
          $(activeCard).removeClass("swiped");
        }
        updateSwipedRowState();
      }

      resetSwipeTracking();
    });

    $("#itemList").on("touchcancel", ".item-card", function () {
      resetSwipeTracking();
    });

    $("#itemList").on("click", ".item-swipe-content", function (event) {
      if ($(event.target).closest("button, a, input, select, textarea").length) return;
      const card = $(this).closest(".item-card");
      if (card.hasClass("swiped") && isMobileSwipeMode()) {
        card.removeClass("swiped");
        updateSwipedRowState();
        return;
      }
      if (card.find(".item-note").length) {
        card.toggleClass("expanded");
      }
    });

    $("#itemList").on("click", ".item-actions button", function () {
      $(this).closest(".item-card").removeClass("swiped");
      updateSwipedRowState();
    });

    $(window).on("scroll", function () {
      if (!isMobileSwipeMode()) return;
      if ($("#itemList .item-card.swiped").length) closeOtherCards();
    });
  }

  function bindEvents() {
    bindMobileSwipeEvents();
    bindRowDragEvents();

    $("#loginForm").on("submit", async function (event) {
      event.preventDefault();
      setLoginStatus("", false);
      try {
        setLoginStatus(t("loading"), false);
        await connectAndSync(readConnectionFromLoginForm(), false);
        setLoginStatus("", false);
      } catch (err) {
        setLoginStatus(connectionErrorMessage(err), true);
        console.error(err);
      }
    });

    $("#syncBtn").on("click", async function () {
      try {
        const conn = getCurrentConnection();
        if (!conn.apiBase || !conn.appPassword) { setSaveStatus(t("configMissingHint"), "error"); return; }
        if (!getToken() && APP_PASSWORD_VALUE) await login(APP_PASSWORD_VALUE);
        await fetchDataWithRelogin();
      } catch (err) {
        setSaveStatus(connectionErrorMessage(err), "error");
        console.error(err);
      }
    });

    $("#actionsMenuBtn").on("click", function (event) { event.stopPropagation(); toggleActionMenu(); });
    $("#actionsMenu").on("click", "button", function () { closeActionMenu(); });
    $(document).on("click", function (event) {
      if (!$(event.target).closest(".action-menu-wrap").length) closeActionMenu();
      if (!$(event.target).closest(".filter-area").length) toggleFilterPanel(false);
    });

    $("#filterToggleBtn").on("click", function (event) { event.stopPropagation(); toggleFilterPanel(); });
    $("#filterPanel").on("click", function (event) { event.stopPropagation(); });

    $("#addItemBtn, #floatingAddBtn").on("click", () => openItemModal(null));
    $("#settingsBtn").on("click", openSettings);
    $("#manageChecklistBtn").on("click", openChecklistModal);
    $(".close-modal").on("click", closeItemModal);
    $(".close-settings").on("click", closeSettings);
    $(".close-checklists").on("click", closeChecklistModal);

    $("#checklistSelect").on("change", function () {
      setCurrentChecklist($(this).val());
      scheduleSave();
      renderAll();
    });

    $("#newChecklistForm").on("submit", function (event) {
      event.preventDefault();
      createChecklist($("#checklistName").val(), $("#checklistType").val(), $("#createMode").val());
    });

    $("#checklistModal").on("click", ".checklist-action", function () {
      const action = $(this).data("action");
      const id = $(this).data("id");
      if (action === "enter") { setCurrentChecklist(id); closeChecklistModal(); scheduleSave(); renderAll(); }
      if (action === "copy") copyChecklist(id);
      if (action === "rename") renameChecklist(id);
      if (action === "archive") archiveChecklist(id);
      if (action === "restore") restoreChecklist(id);
      if (action === "delete") deleteChecklist(id);
    });

    $("#saveConnectionBtn").on("click", async function () {
      const $btn = $(this);
      try {
        $btn.prop("disabled", true);
        setSettingsStatus(t("loading"), false);
        await connectAndSync(readConnectionFromSettingsForm(), true);
        setSettingsStatus(t("connectionSaved"), false);
        setSaveStatus(formatSaveStatus(t("connectionSaved")), "success");
        closeSettings();
      } catch (err) {
        const message = connectionErrorMessage(err);
        setSettingsStatus(message, true);
        setSaveStatus(message, "error");
        console.error(err);
      } finally { $btn.prop("disabled", false); }
    });

    $(".status-row").on("click", ".stat-card", function () {
      currentFilter = $(this).data("stat-filter") || "all";
      currentCategory = "all";
      currentSearch = "";
      $("#searchInput").val("");
      toggleFilterPanel(false);
      renderAll();
    });

    $("#filterTabs").on("click", ".tab", function () { currentFilter = $(this).data("filter"); renderAll(); });
    $("#clearFilterBtn").on("click", function () {
      currentFilter = appData?.settings?.hideDone === false ? "all" : "active";
      currentCategory = "all";
      currentSearch = "";
      $("#searchInput").val("");
      $("#categoryFilter").val("all");
      renderAll();
    });
    $("#categoryFilter").on("change", function () { currentCategory = $(this).val(); renderFilterSummary(); renderItems(); });
    $("#searchInput").on("input", function () { currentSearch = $(this).val(); renderFilterSummary(); renderItems(); });
    $("#itemForm").on("submit", function (event) { event.preventDefault(); saveItemFromForm(); });

    $("#itemList").on("click", ".item-next", function () {
      const id = $(this).data("id");
      const currentItem = findItem(id);
      const next = currentItem ? nextAction(currentItem) : null;
      const actionKey = next && (next.status === "packed" || next.status === "done") ? "actionPacked" : "actionBought";
      mutateItem(id, item => {
        const action = nextAction(item);
        if (!action) return;
        item.status = action.status;
        item.doneAt = action.status === "packed" || action.status === "done" ? nowIso() : null;
      }, currentItem && next ? formatActionMessage(actionKey, currentItem.title) : "");
    });

    $("#itemList").on("click", ".item-restore", function () {
      const id = $(this).data("id");
      const currentItem = findItem(id);
      mutateItem(id, item => { item.status = initialStatus(item.type); item.doneAt = null; item.deleted = false; }, currentItem ? formatActionMessage("actionRestored", currentItem.title) : "");
    });

    $("#itemList").on("click", ".item-pin", function () {
      const id = $(this).data("id");
      const currentItem = findItem(id);
      if (!currentItem) return;
      const willPin = !isPinned(currentItem);
      mutateItem(id, item => {
        item.pinned = willPin;
        item.pinnedAt = willPin ? (item.pinnedAt || nowIso()) : null;
        item.sortOrder = willPin ? (getSortOrder(item) ?? getNextSortOrder(item.checklistId || item.tripId || getCurrentChecklist()?.id)) : null;
      }, formatActionMessage(willPin ? "actionPinned" : "actionUnpinned", currentItem.title));
    });

    $("#itemList").on("click", ".item-edit", function () { openItemModal(findItem($(this).data("id"))); });
    $("#itemList").on("click", ".item-delete", function () {
      const id = $(this).data("id");
      if (!window.confirm(t("confirmDelete"))) return;
      const currentItem = findItem(id);
      mutateItem(id, item => { item.deleted = true; }, currentItem ? formatActionMessage("actionDeleted", currentItem.title) : "");
    });

    $("#langToggleBtn").on("click", function () {
      if (!appData) return;
      appData.settings.language = getLang() === "zh-CN" ? "en-US" : "zh-CN";
      localStorage.setItem("travelChecklist.lang", appData.settings.language);
      scheduleSave();
      renderAll();
    });


    $("#hideDoneSwitch").on("change", function () {
      if (!appData) return;
      appData.settings.hideDone = $(this).is(":checked");
      currentFilter = appData.settings.hideDone ? "active" : "all";
      scheduleSave();
      renderAll();
    });

    $("#showCategoryOnMainSwitch").on("change", function () {
      if (!appData) return;
      appData.settings.showCategoryOnMain = $(this).is(":checked");
      if (!appData.settings.showCategoryOnMain) currentCategory = "all";
      scheduleSave();
      renderAll();
    });

    $("#showCategoryInEditorSwitch").on("change", function () {
      if (!appData) return;
      appData.settings.showCategoryInEditor = $(this).is(":checked");
      scheduleSave();
      renderAll();
    });

    $("#pageZoomRange, #pageZoomValue").on("input change", function () {
      if (!appData) return;
      const scale = clampPageScale($(this).val());
      appData.settings.pageScale = scale;
      applyPageScale(scale);
      scheduleSave();
    });

    $("#itemModal, #settingsModal, #checklistModal").on("click", function (event) {
      if (event.target === this) closeModal($(this));
    });
  }

  async function init() {
    bindEvents();
    applyI18n();
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
    $("#itemModal, #settingsModal, #checklistModal").prop("hidden", true);
    $("body").removeClass("modal-open");

    await bootstrapConnectionFromStaticData();
    applyConnectionToForms();

    // Refresh should show the last synced local data first.
    // Otherwise an older static data.json may render briefly before Cloudflare sync completes.
    const loadedLocal = loadLocalDataIfAny();
    const loadedStatic = loadedLocal ? true : await loadStaticDataIfAny();
    if (!loadedLocal && !loadedStatic) loadEmptyData();

    const conn = getCurrentConnection();
    if (!conn.apiBase || !conn.appPassword) { setSaveStatus(t("configMissingHint"), "error"); return; }

    try {
      setSaveStatus(t("autoSyncing"), "warning");
      if (!getToken() && conn.appPassword) await login(conn.appPassword);
      await fetchDataWithRelogin();
    } catch (err) {
      console.error(err);
      setSaveStatus(connectionErrorMessage(err), "error");
    }
  }

  $(init);
})();

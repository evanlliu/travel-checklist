/* v1.0.0 */
(function () {
  const CONFIG = window.CHECKLIST_CONFIG || {};
  const API_BASE = (CONFIG.API_BASE || "").replace(/\/$/, "");
  const TOKEN_KEY = "travelChecklist.authToken.v1";
  const LOCAL_DATA_KEY = "travelChecklist.localData.v1";
  const APP_VERSION = CONFIG.APP_VERSION || "v1.0.0";

  const I18N = {
    "zh-CN": {
      loginTitle: "旅行清单",
      loginSubtitle: "输入 Cloudflare Worker 密码后开始同步数据。",
      password: "密码",
      login: "登录",
      loginTip: "首次部署后，请先在 js/config.js 填写 Worker 地址。",
      appEyebrow: "Travel Checklist",
      sync: "同步",
      settings: "设置",
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
      logout: "退出登录",
      edit: "编辑",
      delete: "删除",
      restore: "恢复",
      boughtAction: "已购买",
      packedAction: "已打包",
      completeAction: "完成",
      confirmDelete: "确定删除这个物品吗？",
      saving: "正在保存...",
      saved: "已同步",
      loading: "正在同步数据...",
      conflict: "数据已被其他设备修改，是否重新加载最新数据？",
      loginFailed: "登录失败，请检查密码。",
      apiMissing: "请先在 js/config.js 配置 Cloudflare Worker 地址。",
      networkError: "网络或接口错误，请检查 Worker 地址和 Cloudflare 配置。",
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
      cat_other: "其他"
    },
    "en-US": {
      loginTitle: "Travel Checklist",
      loginSubtitle: "Enter your Cloudflare Worker password to sync data.",
      password: "Password",
      login: "Log in",
      loginTip: "After deployment, set your Worker URL in js/config.js first.",
      appEyebrow: "Travel Checklist",
      sync: "Sync",
      settings: "Settings",
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
      logout: "Log out",
      edit: "Edit",
      delete: "Delete",
      restore: "Restore",
      boughtAction: "Bought",
      packedAction: "Packed",
      completeAction: "Complete",
      confirmDelete: "Delete this item?",
      saving: "Saving...",
      saved: "Synced",
      loading: "Syncing data...",
      conflict: "Data was changed on another device. Reload the latest data?",
      loginFailed: "Login failed. Please check the password.",
      apiMissing: "Please configure your Cloudflare Worker URL in js/config.js first.",
      networkError: "Network or API error. Please check the Worker URL and Cloudflare settings.",
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
      cat_other: "Other"
    }
  };

  const CATEGORIES = [
    "documents", "money", "electronics", "clothes", "toiletries",
    "medicine", "work", "food", "gifts", "other"
  ];
  const TYPES = ["carry", "buy", "buy_and_carry"];
  const PRIORITIES = ["must", "optional"];
  const COMPLETED_STATUSES = ["packed", "done"];

  let appData = null;
  let currentFilter = "active";
  let currentCategory = "all";
  let currentSearch = "";
  let saveTimer = null;
  let isSaving = false;

  function t(key) {
    const lang = getLang();
    return (I18N[lang] && I18N[lang][key]) || I18N["zh-CN"][key] || key;
  }

  function getLang() {
    return appData?.settings?.language || localStorage.getItem("travelChecklist.lang") || "zh-CN";
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  function uid() {
    return "item_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizeData(data) {
    const fallback = {
      appVersion: APP_VERSION,
      schemaVersion: 1,
      revision: 0,
      updatedAt: nowIso(),
      settings: { language: "zh-CN", hideDone: true, currentTripId: "mexico-2026" },
      trips: [{ id: "mexico-2026", name: { "zh-CN": "墨西哥出行清单", "en-US": "Mexico Travel Checklist" }, createdAt: nowIso() }],
      items: []
    };
    const result = Object.assign({}, fallback, data || {});
    result.settings = Object.assign({}, fallback.settings, result.settings || {});
    result.trips = Array.isArray(result.trips) ? result.trips : fallback.trips;
    result.items = Array.isArray(result.items) ? result.items : [];
    result.items = result.items.map(item => Object.assign({
      id: uid(),
      tripId: result.settings.currentTripId,
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
      deleted: false
    }, item));
    return result;
  }

  async function apiFetch(path, options = {}) {
    if (!API_BASE) throw new Error("API_BASE_MISSING");
    const headers = Object.assign({ "Content-Type": "application/json" }, options.headers || {});
    const token = getToken();
    if (token) headers.Authorization = "Bearer " + token;
    const response = await fetch(API_BASE + path, Object.assign({}, options, { headers }));
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
    const payload = await apiFetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ password })
    });
    setToken(payload.token);
  }

  async function fetchData() {
    setSaveStatus(t("loading"));
    const payload = await apiFetch("/api/data", { method: "GET" });
    appData = normalizeData(payload.data);
    currentFilter = appData.settings.hideDone === false ? "all" : "active";
    localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(appData));
    localStorage.setItem("travelChecklist.lang", appData.settings.language);
    setSaveStatus(t("saved"));
    showApp();
    renderAll();
  }

  async function saveData() {
    if (!appData || isSaving) return;
    isSaving = true;
    setSaveStatus(t("saving"));
    try {
      const payload = await apiFetch("/api/data", {
        method: "PUT",
        body: JSON.stringify({
          baseRevision: appData.revision || 0,
          data: appData
        })
      });
      appData = normalizeData(payload.data);
      localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(appData));
      setSaveStatus(t("saved"));
      renderAll();
    } catch (err) {
      if (err.status === 409) {
        const reload = window.confirm(t("conflict"));
        if (reload) await fetchData();
      } else {
        setSaveStatus(t("networkError"));
        console.error(err);
      }
    } finally {
      isSaving = false;
    }
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveData, 250);
  }

  function setSaveStatus(text) {
    $("#saveStatus").text(text || "");
  }

  function showLogin() {
    $("#loginScreen").prop("hidden", false);
    $("#appShell").prop("hidden", true);
    applyI18n();
  }

  function showApp() {
    $("#loginScreen").prop("hidden", true);
    $("#appShell").prop("hidden", false);
  }

  function applyI18n() {
    const lang = getLang();
    document.documentElement.lang = lang;
    $("[data-i18n]").each(function () {
      const key = $(this).data("i18n");
      $(this).text(t(key));
    });
    $("[data-i18n-placeholder]").each(function () {
      const key = $(this).data("i18n-placeholder");
      $(this).attr("placeholder", t(key));
    });
    $("#langToggleBtn").text(lang === "zh-CN" ? "EN" : "中");
    populateSelects();
  }

  function populateSelects() {
    const categoryOptions = [`<option value="all">${escapeHtml(t("cat_all"))}</option>`]
      .concat(CATEGORIES.map(c => `<option value="${c}">${escapeHtml(t("cat_" + c))}</option>`));
    $("#categoryFilter").html(categoryOptions.join("")).val(currentCategory);
    $("#itemCategory").html(CATEGORIES.map(c => `<option value="${c}">${escapeHtml(t("cat_" + c))}</option>`).join(""));
    $("#itemType").html(TYPES.map(type => `<option value="${type}">${escapeHtml(t("type_" + type))}</option>`).join(""));
    $("#itemPriority").html(PRIORITIES.map(p => `<option value="${p}">${escapeHtml(t(p))}</option>`).join(""));
    $("#languageSelect").val(getLang());
  }

  function getCurrentTrip() {
    const tripId = appData?.settings?.currentTripId;
    return appData?.trips?.find(trip => trip.id === tripId) || appData?.trips?.[0];
  }

  function getTripItems(includeDeleted = false) {
    const tripId = getCurrentTrip()?.id;
    return (appData?.items || []).filter(item => item.tripId === tripId && (includeDeleted || !item.deleted));
  }

  function isDone(item) {
    return COMPLETED_STATUSES.includes(item.status);
  }

  function getStats(items) {
    return {
      needBuy: items.filter(item => item.status === "need_buy").length,
      toPack: items.filter(item => item.status === "to_pack" || item.status === "bought").length,
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

  function renderAll() {
    if (!appData) return;
    applyI18n();
    const trip = getCurrentTrip();
    const title = trip?.name?.[getLang()] || trip?.name?.["zh-CN"] || "Travel Checklist";
    $("#tripTitle").text(title);
    $("#hideDoneSwitch").prop("checked", Boolean(appData.settings.hideDone));
    renderStats();
    renderTabs();
    renderItems();
  }

  function renderStats() {
    const stats = getStats(getTripItems());
    $("#statNeedBuy").text(stats.needBuy);
    $("#statToPack").text(stats.toPack);
    $("#statMustOpen").text(stats.mustOpen);
    $("#statDone").text(stats.done);
  }

  function renderTabs() {
    $("#filterTabs .tab").removeClass("active");
    $(`#filterTabs .tab[data-filter="${currentFilter}"]`).addClass("active");
  }

  function renderItems() {
    const items = filterItems(getTripItems()).sort((a, b) => {
      const rank = { must: 0, optional: 1 };
      const statusRank = { need_buy: 0, bought: 1, to_pack: 2, packed: 3, done: 4 };
      return (statusRank[a.status] ?? 9) - (statusRank[b.status] ?? 9)
        || (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9)
        || String(a.title).localeCompare(String(b.title));
    });

    $("#itemList").empty();
    $("#emptyState").prop("hidden", items.length > 0);

    items.forEach(item => $("#itemList").append(renderItemCard(item)));
  }

  function renderItemCard(item) {
    const doneClass = isDone(item) ? " done-card" : "";
    const noteHtml = item.note ? `<p class="item-note">${escapeHtml(item.note)}</p>` : "";
    const next = nextAction(item);
    const primaryAction = next ? `<button class="primary-btn item-next" type="button" data-id="${item.id}">${escapeHtml(next.label)}</button>` : "";
    const restoreAction = isDone(item) ? `<button class="small-ghost item-restore" type="button" data-id="${item.id}">${escapeHtml(t("restore"))}</button>` : "";

    return `
      <article class="item-card${doneClass}" data-id="${item.id}">
        <div class="item-head">
          <h2 class="item-title">${escapeHtml(item.title)}</h2>
          <div class="item-qty">× ${Number(item.quantity || 1)}</div>
        </div>
        <div class="chip-row">
          <span class="chip ${item.priority === "must" ? "must" : ""}">${escapeHtml(t(item.priority))}</span>
          <span class="chip">${escapeHtml(t("cat_" + item.category))}</span>
          <span class="chip">${escapeHtml(t("type_" + item.type))}</span>
          <span class="chip status-${item.status}">${escapeHtml(t("status_" + item.status))}</span>
        </div>
        ${noteHtml}
        <div class="item-actions">
          ${primaryAction}
          ${restoreAction}
          <button class="small-ghost item-edit" type="button" data-id="${item.id}">${escapeHtml(t("edit"))}</button>
          <button class="small-danger item-delete" type="button" data-id="${item.id}">${escapeHtml(t("delete"))}</button>
        </div>
      </article>`;
  }

  function nextAction(item) {
    if (item.status === "need_buy") {
      return { label: t("boughtAction"), status: item.type === "buy" ? "done" : "bought" };
    }
    if (item.status === "bought") return { label: t("packedAction"), status: "packed" };
    if (item.status === "to_pack") return { label: t("packedAction"), status: "packed" };
    return null;
  }

  function findItem(id) {
    return (appData.items || []).find(item => item.id === id);
  }

  function mutateItem(id, updater) {
    const item = findItem(id);
    if (!item) return;
    updater(item);
    item.updatedAt = nowIso();
    scheduleSave();
    renderAll();
  }

  function openItemModal(item) {
    populateSelects();
    if (item) {
      $("#modalTitle").text(t("edit"));
      $("#editingItemId").val(item.id);
      $("#itemTitle").val(item.title);
      $("#itemType").val(item.type);
      $("#itemCategory").val(item.category);
      $("#itemPriority").val(item.priority);
      $("#itemQuantity").val(item.quantity || 1);
      $("#itemNote").val(item.note || "");
    } else {
      $("#modalTitle").text(t("addItem"));
      $("#editingItemId").val("");
      $("#itemTitle").val("");
      $("#itemType").val("carry");
      $("#itemCategory").val("documents");
      $("#itemPriority").val("must");
      $("#itemQuantity").val(1);
      $("#itemNote").val("");
    }
    $("#itemModal").prop("hidden", false);
    setTimeout(() => $("#itemTitle").trigger("focus"), 60);
  }

  function closeItemModal() {
    $("#itemModal").prop("hidden", true);
  }

  function openSettings() {
    $("#languageSelect").val(getLang());
    $("#hideDoneSwitch").prop("checked", Boolean(appData?.settings?.hideDone));
    $("#settingsModal").prop("hidden", false);
  }

  function closeSettings() {
    $("#settingsModal").prop("hidden", true);
  }

  function initialStatus(type) {
    return type === "carry" ? "to_pack" : "need_buy";
  }

  function saveItemFromForm() {
    const id = $("#editingItemId").val();
    const type = $("#itemType").val();
    const formData = {
      title: $("#itemTitle").val().trim(),
      type,
      category: $("#itemCategory").val(),
      priority: $("#itemPriority").val(),
      quantity: Math.max(1, parseInt($("#itemQuantity").val(), 10) || 1),
      note: $("#itemNote").val().trim(),
      updatedAt: nowIso()
    };
    if (!formData.title) return;

    if (id) {
      const item = findItem(id);
      if (!item) return;
      const oldType = item.type;
      Object.assign(item, formData);
      if (oldType !== type && isDone(item) === false) {
        item.status = initialStatus(type);
      }
    } else {
      appData.items.push(Object.assign({
        id: uid(),
        tripId: getCurrentTrip()?.id || appData.settings.currentTripId,
        status: initialStatus(type),
        createdAt: nowIso(),
        doneAt: null,
        deleted: false
      }, formData));
    }
    closeItemModal();
    scheduleSave();
    renderAll();
  }

  function loadLocalDataIfAny() {
    const cached = localStorage.getItem(LOCAL_DATA_KEY);
    if (!cached) return false;
    try {
      appData = normalizeData(JSON.parse(cached));
      currentFilter = appData.settings.hideDone === false ? "all" : "active";
      showApp();
      renderAll();
      return true;
    } catch (_) {
      return false;
    }
  }

  function bindEvents() {
    $("#loginForm").on("submit", async function (event) {
      event.preventDefault();
      $("#loginError").prop("hidden", true).text("");
      try {
        if (!API_BASE) throw new Error("API_BASE_MISSING");
        await login($("#passwordInput").val());
        await fetchData();
      } catch (err) {
        const message = err.message === "API_BASE_MISSING" ? t("apiMissing") : (err.status === 401 ? t("loginFailed") : t("networkError"));
        $("#loginError").prop("hidden", false).text(message);
        console.error(err);
      }
    });

    $("#syncBtn").on("click", fetchData);
    $("#addItemBtn, #mobileAddBtn").on("click", () => openItemModal(null));
    $("#settingsBtn").on("click", openSettings);
    $(".close-modal").on("click", closeItemModal);
    $(".close-settings").on("click", closeSettings);

    $("#filterTabs").on("click", ".tab", function () {
      currentFilter = $(this).data("filter");
      renderAll();
    });

    $(".mobile-bottom-nav").on("click", "[data-mobile-filter]", function () {
      currentFilter = $(this).data("mobile-filter");
      renderAll();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    $("#categoryFilter").on("change", function () {
      currentCategory = $(this).val();
      renderItems();
    });

    $("#searchInput").on("input", function () {
      currentSearch = $(this).val();
      renderItems();
    });

    $("#itemForm").on("submit", function (event) {
      event.preventDefault();
      saveItemFromForm();
    });

    $("#itemList").on("click", ".item-next", function () {
      const id = $(this).data("id");
      mutateItem(id, item => {
        const action = nextAction(item);
        if (!action) return;
        item.status = action.status;
        item.doneAt = isDone(item) || action.status === "packed" || action.status === "done" ? nowIso() : null;
      });
    });

    $("#itemList").on("click", ".item-restore", function () {
      const id = $(this).data("id");
      mutateItem(id, item => {
        item.status = initialStatus(item.type);
        item.doneAt = null;
        item.deleted = false;
      });
    });

    $("#itemList").on("click", ".item-edit", function () {
      openItemModal(findItem($(this).data("id")));
    });

    $("#itemList").on("click", ".item-delete", function () {
      const id = $(this).data("id");
      if (!window.confirm(t("confirmDelete"))) return;
      mutateItem(id, item => { item.deleted = true; });
    });

    $("#langToggleBtn").on("click", function () {
      if (!appData) return;
      appData.settings.language = getLang() === "zh-CN" ? "en-US" : "zh-CN";
      localStorage.setItem("travelChecklist.lang", appData.settings.language);
      scheduleSave();
      renderAll();
    });

    $("#languageSelect").on("change", function () {
      if (!appData) return;
      appData.settings.language = $(this).val();
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

    $("#logoutBtn").on("click", function () {
      clearToken();
      closeSettings();
      showLogin();
    });

    $("#itemModal, #settingsModal").on("click", function (event) {
      if (event.target === this) {
        $(this).prop("hidden", true);
      }
    });
  }

  async function init() {
    bindEvents();
    applyI18n();
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
    if (!getToken()) {
      showLogin();
      return;
    }
    const showedCached = loadLocalDataIfAny();
    try {
      await fetchData();
    } catch (err) {
      console.error(err);
      if (!showedCached) showLogin();
      else setSaveStatus(t("networkError"));
    }
  }

  $(init);
})();

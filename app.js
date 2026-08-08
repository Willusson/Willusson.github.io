const state = { currentId: null };

const screens = Array.from(document.querySelectorAll("[data-screen]"));
const screenById = new Map(screens.map(s => [s.id, s]));

function showScreen(id) {
  for (const s of screens) s.classList.remove("is-active");
  const el = screenById.get(id);
  if (!el) return;
  el.classList.add("is-active");
  state.currentId = id;
}

function transitionTo(nextId) {
  const next = screenById.get(nextId);
  if (!next) return;

  showScreen(nextId);

  next.classList.remove("transition-fade");
  void next.offsetWidth;
  next.classList.add("transition-fade");

  if (nextId !== "screen-16") {
    setReasonMenuState("menu");
  }
}

/* Тексты в меню причин (более убедительные, но без новых “деталей”) */
const REASONS = {
  help: "Я готов выполнять абсолютно всё что вы скажете с первого раза. Также буду сам замечать, когда нужна помощь, и проявлять инициативу первым.",
  study: "Я готов ходить к репетиторам и делать то, что вы скажете по учебе. Я хочу показать результат и спокойствие по оценкам.",
  pc: "Помимо того что после покупки я буду тратить на компьютер меньше времени, я также готов к любым ограничениям по времени за ПК — чтобы дома всем было комфортно.",
  safety: "Я буду кататься аккуратно и только в полном комплекте экипировки. И я буду строго держаться выбранных маршрутов, которые вы одобрите.",
  price: "Я понимаю, что сейчас может быть тяжело по бюджету. Я готов обсудить условия и согласовать удобный вариант, чтобы не было ощущения спешки или давления."
};

const reasonsList = document.getElementById("reasonsList");
const reasonDetail = document.getElementById("reasonDetail");
const reasonText = document.getElementById("reasonText");
const backToReasons = document.getElementById("backToReasons");

const finishBtn = document.getElementById("finishBtn");
const backToTalk = document.getElementById("backToTalk");

function setReasonMenuState(mode) {
  if (mode === "menu") {
    reasonsList.classList.remove("hidden");
    reasonDetail.classList.add("hidden");
    const first = reasonsList.querySelector("button");
    if (first) first.focus?.();
  } else {
    reasonsList.classList.add("hidden");
    reasonDetail.classList.remove("hidden");
  }
}

/* Клики */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const next = btn.getAttribute("data-next");
  if (next) {
    transitionTo(`screen-${next}`);
    return;
  }

  const parentChoice = btn.getAttribute("data-parent-choice");
  if (parentChoice) {
    if (parentChoice === "agree") transitionTo("screen-15");
    if (parentChoice === "discuss") transitionTo("screen-16");
    return;
  }

  if (btn.hasAttribute("data-nothanks")) {
    transitionTo("screen-17");
    return;
  }

  const reasonKey = btn.getAttribute("data-reason");
  if (reasonKey && REASONS[reasonKey]) {
    setReasonMenuState("detail");
    reasonText.textContent = REASONS[reasonKey];
    return;
  }
});

backToReasons.addEventListener("click", () => {
  setReasonMenuState("menu");
});

backToTalk.addEventListener("click", () => {
  transitionTo("screen-16");
  setReasonMenuState("menu");
});

finishBtn.addEventListener("click", () => {
  transitionTo("screen-1");
  setReasonMenuState("menu");
});

/* Заглушки для изображений */
function setupImageFallback() {
  const imgs = document.querySelectorAll("img[data-fallback]");
  imgs.forEach(img => {
    const key = img.getAttribute("data-fallback");
    const fallbackEl = document.querySelector(`[data-fallback-el="${CSS.escape(key)}"]`);
    if (!fallbackEl) return;

    const show = () => fallbackEl.classList.add("is-visible");
    const hide = () => fallbackEl.classList.remove("is-visible");

    // Мягко показываем заглушку, если не успело загрузиться / пришла ошибка
    show();

    if (img.complete && img.naturalWidth > 0) {
      hide();
    } else {
      img.addEventListener("load", hide, { once: true });
      img.addEventListener("error", show, { once: true });
    }
  });
}

setupImageFallback();

/* Старт */
(function init(){
  showScreen("screen-1");
  setReasonMenuState("menu");
})();

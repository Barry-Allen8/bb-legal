"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".main-nav");
  const navToggle = document.querySelector(".mobile-nav-toggle");
  const langButton = document.querySelector(".lang-toggle-btn");
  const langMenu = document.querySelector(".lang-menu");

  const closeLanguageMenu = () => {
    if (!langMenu || !langButton) return;
    langMenu.hidden = true;
    langButton.setAttribute("aria-expanded", "false");
  };

  const closeMobileMenu = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", navToggle.dataset.openLabel);
    document.body.classList.remove("menu-open");
  };

  langButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    langMenu.hidden = !langMenu.hidden;
    langButton.setAttribute("aria-expanded", String(!langMenu.hidden));
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".lang-control")) closeLanguageMenu();
  });

  navToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? navToggle.dataset.closeLabel : navToggle.dataset.openLabel);
    document.body.classList.toggle("menu-open", open);
  });
  nav?.querySelectorAll("a").forEach((item) => item.addEventListener("click", closeMobileMenu));

  document.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      const willOpen = button.getAttribute("aria-expanded") !== "true";
      document.querySelectorAll(".faq-item button").forEach((otherButton) => {
        const otherPanel = document.getElementById(otherButton.getAttribute("aria-controls"));
        otherButton.setAttribute("aria-expanded", "false");
        otherPanel?.classList.remove("is-open");
        otherPanel?.setAttribute("aria-hidden", "true");
      });
      button.setAttribute("aria-expanded", String(willOpen));
      panel?.classList.toggle("is-open", willOpen);
      panel?.setAttribute("aria-hidden", String(!willOpen));
    });
  });

  const goal = document.getElementById("calc-goal");
  const years = document.getElementById("calc-years");
  const b1 = document.getElementById("calc-b1");
  const yearsValue = document.getElementById("calc-years-value");
  const qualificationResult = document.getElementById("qualification-result");
  const locale = document.body.dataset.locale || "pl";
  const results = {
    pl: { temporary: "Sprawdź dokumenty pracodawcy i podstawę legalnego pobytu.", appeal: "Sprawdź pouczenie i datę doręczenia — termin może już biec.", residentReady: "Możliwa kwalifikacja do analizy statusu rezydenta UE.", residentWait: "Zweryfikuj okresy zaliczane do wymaganych 5 lat i dokument językowy." },
    ua: { temporary: "Перевірте документи роботодавця й підставу легального перебування.", appeal: "Перевірте роз’яснення та дату вручення — строк може вже тривати.", residentReady: "Можлива кваліфікація для аналізу статусу резидента ЄС.", residentWait: "Перевірте періоди, що зараховуються до 5 років, і мовний документ." },
    ru: { temporary: "Проверьте документы работодателя и основание легального пребывания.", appeal: "Проверьте разъяснение и дату вручения — срок может уже идти.", residentReady: "Возможна квалификация для анализа статуса резидента ЕС.", residentWait: "Проверьте периоды, засчитываемые в 5 лет, и языковой документ." },
    en: { temporary: "Check the employer documents and your basis for legal stay.", appeal: "Check the instructions and service date — the deadline may be running.", residentReady: "You may qualify for an EU long-term resident assessment.", residentWait: "Check which periods count towards 5 years and the language evidence." }
  };

  const updateQualification = () => {
    if (!goal || !years || !b1 || !qualificationResult) return;
    yearsValue.value = years.value;
    if (goal.value === "resident") qualificationResult.textContent = Number(years.value) >= 5 && b1.checked ? results[locale].residentReady : results[locale].residentWait;
    else qualificationResult.textContent = results[locale][goal.value];
  };
  [goal, years, b1].forEach((control) => control?.addEventListener("input", updateQualification));
  updateQualification();

  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submit = form.querySelector("button[type='submit']");
      const status = form.querySelector("[data-form-status]");
      if (submit.disabled) return;
      if (!form.checkValidity()) {
        form.reportValidity();
        status.textContent = status.dataset.required;
        status.dataset.state = "error";
        return;
      }
      submit.disabled = true;
      submit.textContent = submit.dataset.sendingLabel;
      status.textContent = "";
      status.dataset.state = "loading";
      try {
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());
        const response = await fetch(form.action, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.success) {
          throw new Error(result.message || result.error || status.dataset.error);
        }
        if (typeof fbq === "function") {
          fbq("track", "Lead");
        }
        form.reset();
        status.textContent = status.dataset.success;
        status.dataset.state = "success";
      } catch (error) {
        status.textContent = status.dataset.error;
        status.dataset.state = "error";
      } finally {
        submit.disabled = false;
        submit.textContent = submit.dataset.idleLabel;
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeLanguageMenu();
    closeMobileMenu();
  });
});

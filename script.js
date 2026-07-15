"use strict";

const TRANSLATIONS = {
  uk: {
    skip_link: "Перейти до вмісту", home_aria: "B&B Legal — головна", nav_aria: "Головна навігація", language_aria: "Вибір мови", menu_aria: "Відкрити меню", menu_close: "Закрити меню", benefits_aria: "Основні переваги", policies_aria: "Юридичні документи", close_aria: "Закрити",
    nav_home: "Головна", nav_services: "Послуги", nav_about: "Про нас", nav_process: "Етапи роботи", nav_faq: "FAQ", nav_contact: "Контакти",
    hero_badge: "Представництво клієнтів у воєводських управліннях",
    hero_title: "Легалізація перебування та роботи з B&B Legal", hero_title_accent: "Безпечно та професійно",
    hero_desc: "Допомагаємо підготувати документи, пройти адміністративні процедури та вести офіційне листування на підставі довіреності.",
    cta_consult: "Записатися на консультацію", cta_services: "Переглянути послуги",
    benefit_1: "Індивідуальний аналіз справи", benefit_2: "Перевірка комплектності документів", benefit_3: "Представництво на підставі довіреності",
    widget_tag: "Попередня перевірка", widget_title: "Дізнайтеся, з чого почати", calc_goal: "Тип справи",
    calc_opt_temporary: "Тимчасове перебування та робота", calc_opt_resident: "Довгостроковий резидент ЄС", calc_opt_work: "Дозвіл на роботу", calc_opt_appeal: "Оскарження або нагадування",
    calc_years: "Роки легального перебування в Польщі", calc_b1: "Маю мовний сертифікат B1 або польський диплом", calc_result_label: "Попередній результат",
    calc_disclaimer: "Результат орієнтовний і не є юридичною консультацією чи гарантією отримання дозволу.",
    result_temporary: "Потрібен індивідуальний аналіз підстави перебування.", result_resident_ready: "Основні формальні критерії можуть бути виконані.", result_resident_b1: "Потрібно підтвердити знання польської мови на рівні B1.", result_resident_years: "Для цього статусу зазвичай потрібно щонайменше 5 років безперервного легального перебування.", result_work: "Потрібна перевірка документів роботодавця та умов працевлаштування.", result_appeal: "Потрібно терміново перевірити рішення і строк оскарження.",
    services_tag: "Сфера підтримки", services_title: "Чим ми можемо допомогти?", services_desc: "Підтримка приватних осіб і роботодавців по всій Польщі.",
    service_1_title: "Карта перебування", service_1_desc: "Тимчасове й постійне перебування, возз’єднання сім’ї та навчання.",
    service_2_title: "Довгостроковий резидент ЄС", service_2_desc: "Аналіз безперервності перебування, доходу та вимоги рівня B1.",
    service_3_title: "Дозволи на роботу", service_3_desc: "Документи для роботодавців, дозволи типу A та повідомлення про працевлаштування.",
    service_4_title: "MOS 2.0 і Довірений профіль", service_4_desc: "Допомога з формами, додатками та електронним супроводом справи.",
    service_5_title: "Оскарження та нагадування", service_5_desc: "Дії у випадку відмови, бездіяльності або затягування з боку органу.",
    service_6_title: "Документи й довіреність", service_6_desc: "Перевірка формальних вимог, листування та представництво в органах.", service_cta: "Обговорити справу",
    about_tag: "Команда", about_title: "Про нас", about_desc: "Справи ведуть фахівці з практичним досвідом в імміграційних процедурах.",
    founder_1_role: "Співзасновник, консультант з легалізації перебування", founder_1_desc: "Аналіз заяв, безперервності перебування, координація оскаржень і нагадувань.",
    founder_2_role: "Співзасновник, фахівець з роботи з клієнтами", founder_2_desc: "Перевірка документів роботодавців і реєстрація в офіційних системах.",
    process_tag: "Співпраця", process_title: "Чотири зрозумілі етапи",
    step_1_title: "Консультація", step_1_desc: "З’ясовуємо ситуацію та оцінюємо можливі рішення.", step_2_title: "Документи", step_2_desc: "Перевіряємо документи та готуємо заяву.", step_3_title: "Подання справи", step_3_desc: "Допомагаємо подати заяву та ведемо листування.", step_4_title: "Рішення", step_4_desc: "Стежимо за розглядом і допомагаємо отримати карту.",
    faq_tag: "Питання та відповіді", faq_title: "Поширені запитання",
    faq_q1: "Скільки триває розгляд заяви?", faq_a1: "Термін залежить від органу та складності справи. У разі бездіяльності органу можна подати нагадування.",
    faq_q2: "Чи потрібно особисто з’являтися до управління?", faq_a2: "Особиста присутність потрібна, зокрема, для здачі відбитків пальців і зазвичай для отримання карти.",
    faq_q3: "Чим тимчасове перебування відрізняється від статусу резидента ЄС?", faq_a3: "Тимчасове перебування надається на визначений строк. Статус резидента ЄС є безстроковим, але має додаткові умови.",
    faq_q4: "Що робити після відмови?", faq_a4: "Треба негайно перевірити підстави та строк оскарження. У типовій справі він становить 14 днів від отримання рішення.",
    contact_tag: "Контакти", contact_title: "Запишіться на аналіз справи", contact_desc: "Напишіть або зателефонуйте. Ми визначимо, які відомості й документи потрібні для першої розмови.",
    form_title: "Контактна форма", form_name: "Ім’я та прізвище", form_phone: "Номер телефону", form_email: "Електронна пошта", form_service: "Тип справи", form_select: "Оберіть послугу", form_message: "Коротко опишіть ситуацію",
    form_consent: "Я ознайомився/ознайомилася з правилами обробки даних у", privacy_link: "Політиці конфіденційності", form_submit: "Надіслати запит", form_notice: "Надсилання форми не означає укладення договору чи прийняття справи до ведення.",
    footer_disclaimer: "Ми не є державним органом. Надаємо консультаційні послуги та допомагаємо готувати документи.", privacy_title: "Політика конфіденційності", terms_title: "Умови надання послуг", cookies_title: "Інформація про cookies"
  },
  ru: {
    skip_link: "Перейти к содержанию", home_aria: "B&B Legal — главная", nav_aria: "Главная навигация", language_aria: "Выбор языка", menu_aria: "Открыть меню", menu_close: "Закрыть меню", benefits_aria: "Основные преимущества", policies_aria: "Юридические документы", close_aria: "Закрыть",
    nav_home: "Главная", nav_services: "Услуги", nav_about: "О нас", nav_process: "Этапы работы", nav_faq: "FAQ", nav_contact: "Контакты",
    hero_badge: "Представительство клиентов в воеводских управлениях",
    hero_title: "Легализация пребывания и работы с B&B Legal", hero_title_accent: "Безопасно и профессионально",
    hero_desc: "Помогаем подготовить документы, пройти административные процедуры и вести официальную переписку на основании доверенности.",
    cta_consult: "Записаться на консультацию", cta_services: "Посмотреть услуги",
    benefit_1: "Индивидуальный анализ дела", benefit_2: "Проверка комплектности документов", benefit_3: "Представительство по доверенности",
    widget_tag: "Предварительная проверка", widget_title: "Узнайте, с чего начать", calc_goal: "Тип дела",
    calc_opt_temporary: "Временное пребывание и работа", calc_opt_resident: "Долгосрочный резидент ЕС", calc_opt_work: "Разрешение на работу", calc_opt_appeal: "Обжалование или понукание",
    calc_years: "Годы легального пребывания в Польше", calc_b1: "У меня есть сертификат B1 или польский диплом", calc_result_label: "Предварительный результат",
    calc_disclaimer: "Результат ориентировочный и не является юридической консультацией или гарантией получения разрешения.",
    result_temporary: "Нужен индивидуальный анализ основания пребывания.", result_resident_ready: "Основные формальные критерии могут быть выполнены.", result_resident_b1: "Необходимо подтвердить знание польского языка на уровне B1.", result_resident_years: "Для этого статуса обычно требуется не менее 5 лет непрерывного легального пребывания.", result_work: "Нужно проверить документы работодателя и условия трудоустройства.", result_appeal: "Необходимо срочно проверить решение и срок обжалования.",
    services_tag: "Сфера поддержки", services_title: "Чем мы можем помочь?", services_desc: "Поддержка частных лиц и работодателей по всей Польше.",
    service_1_title: "Карта пребывания", service_1_desc: "Временное и постоянное пребывание, воссоединение семьи и учеба.",
    service_2_title: "Долгосрочный резидент ЕС", service_2_desc: "Анализ непрерывности пребывания, дохода и требования уровня B1.",
    service_3_title: "Разрешения на работу", service_3_desc: "Документы для работодателей, разрешения типа A и уведомления о трудоустройстве.",
    service_4_title: "MOS 2.0 и Доверенный профиль", service_4_desc: "Помощь с формами, приложениями и электронным сопровождением дела.",
    service_5_title: "Обжалования и понукания", service_5_desc: "Действия при отказе, бездействии или затягивании со стороны органа.",
    service_6_title: "Документы и доверенность", service_6_desc: "Проверка формальных требований, переписка и представительство в органах.", service_cta: "Обсудить дело",
    about_tag: "Команда", about_title: "О нас", about_desc: "Дела ведут специалисты с практическим опытом в иммиграционных процедурах.",
    founder_1_role: "Сооснователь, консультант по легализации пребывания", founder_1_desc: "Анализ заявлений, непрерывности пребывания, координация обжалований и понуканий.",
    founder_2_role: "Сооснователь, специалист по работе с клиентами", founder_2_desc: "Проверка документов работодателей и регистрация в официальных системах.",
    process_tag: "Сотрудничество", process_title: "Четыре понятных этапа",
    step_1_title: "Консультация", step_1_desc: "Изучаем ситуацию и оцениваем возможные решения.", step_2_title: "Документы", step_2_desc: "Проверяем документы и готовим заявление.", step_3_title: "Подача дела", step_3_desc: "Помогаем подать заявление и ведем переписку.", step_4_title: "Решение", step_4_desc: "Следим за рассмотрением и помогаем получить карту.",
    faq_tag: "Вопросы и ответы", faq_title: "Часто задаваемые вопросы",
    faq_q1: "Сколько длится рассмотрение заявления?", faq_a1: "Срок зависит от органа и сложности дела. При бездействии органа можно подать понукание.",
    faq_q2: "Нужно ли лично являться в управление?", faq_a2: "Личное присутствие необходимо, в частности, для сдачи отпечатков пальцев и обычно для получения карты.",
    faq_q3: "Чем временное пребывание отличается от статуса резидента ЕС?", faq_a3: "Временное пребывание предоставляется на определенный срок. Статус резидента ЕС бессрочный, но требует дополнительных условий.",
    faq_q4: "Что делать после отказа?", faq_a4: "Нужно срочно проверить основания и срок обжалования. В типичном деле он составляет 14 дней с момента получения решения.",
    contact_tag: "Контакты", contact_title: "Запишитесь на анализ дела", contact_desc: "Напишите или позвоните. Мы определим, какие сведения и документы нужны для первого разговора.",
    form_title: "Контактная форма", form_name: "Имя и фамилия", form_phone: "Номер телефона", form_email: "Электронная почта", form_service: "Тип дела", form_select: "Выберите услугу", form_message: "Кратко опишите ситуацию",
    form_consent: "Я ознакомился/ознакомилась с правилами обработки данных в", privacy_link: "Политике конфиденциальности", form_submit: "Отправить запрос", form_notice: "Отправка формы не означает заключения договора или принятия дела к ведению.",
    footer_disclaimer: "Мы не являемся государственным органом. Оказываем консультационные услуги и помогаем готовить документы.", privacy_title: "Политика конфиденциальности", terms_title: "Условия оказания услуг", cookies_title: "Информация о cookies"
  },
  en: {
    skip_link: "Skip to content", home_aria: "B&B Legal — home", nav_aria: "Main navigation", language_aria: "Choose language", menu_aria: "Open menu", menu_close: "Close menu", benefits_aria: "Key benefits", policies_aria: "Legal documents", close_aria: "Close",
    nav_home: "Home", nav_services: "Services", nav_about: "About us", nav_process: "Process", nav_faq: "FAQ", nav_contact: "Contact",
    hero_badge: "Representation before voivodeship offices",
    hero_title: "Legalize your stay and work with B&B Legal", hero_title_accent: "Safely and professionally",
    hero_desc: "We help prepare documents, navigate administrative procedures, and handle official correspondence under a power of attorney.",
    cta_consult: "Book a consultation", cta_services: "View services",
    benefit_1: "Individual case review", benefit_2: "Document completeness check", benefit_3: "Representation under a power of attorney",
    widget_tag: "Initial check", widget_title: "Find out where to start", calc_goal: "Case type",
    calc_opt_temporary: "Temporary stay and work", calc_opt_resident: "EU long-term resident", calc_opt_work: "Work permit", calc_opt_appeal: "Appeal or reminder",
    calc_years: "Years of legal residence in Poland", calc_b1: "I have a B1 certificate or a Polish diploma", calc_result_label: "Initial result",
    calc_disclaimer: "This result is indicative and is not legal advice or a guarantee that a permit will be granted.",
    result_temporary: "Your basis for residence requires an individual review.", result_resident_ready: "The main formal criteria may be met.", result_resident_b1: "Polish language proficiency at B1 level must be documented.", result_resident_years: "This status generally requires at least 5 years of continuous legal residence.", result_work: "The employer's documents and employment terms need to be reviewed.", result_appeal: "The decision and appeal deadline need to be reviewed urgently.",
    services_tag: "Scope of support", services_title: "How can we help?", services_desc: "Support for individuals and employers throughout Poland.",
    service_1_title: "Residence card", service_1_desc: "Temporary and permanent residence, family reunification, and studies.",
    service_2_title: "EU long-term resident", service_2_desc: "Review of residence continuity, income, and the B1 language requirement.",
    service_3_title: "Work permits", service_3_desc: "Employer documents, type A permits, and employment notifications.",
    service_4_title: "MOS 2.0 and Trusted Profile", service_4_desc: "Help with forms, attachments, and electronic case handling.",
    service_5_title: "Appeals and reminders", service_5_desc: "Action in cases of refusal, inactivity, or excessive delay by an authority.",
    service_6_title: "Documents and power of attorney", service_6_desc: "Formal checks, correspondence, and representation before authorities.", service_cta: "Discuss your case",
    about_tag: "Team", about_title: "About us", about_desc: "Cases are handled by specialists with practical experience in immigration procedures.",
    founder_1_role: "Co-founder, residence legalization consultant", founder_1_desc: "Application and residence-continuity reviews, plus coordination of appeals and reminders.",
    founder_2_role: "Co-founder, client service specialist", founder_2_desc: "Employer document checks and registrations in official systems.",
    process_tag: "Working together", process_title: "Four clear stages",
    step_1_title: "Consultation", step_1_desc: "We learn about your situation and assess possible solutions.", step_2_title: "Documents", step_2_desc: "We review documents and prepare the application.", step_3_title: "Filing", step_3_desc: "We help file the application and handle correspondence.", step_4_title: "Decision", step_4_desc: "We monitor the proceedings and assist with card collection.",
    faq_tag: "Questions and answers", faq_title: "Frequently asked questions",
    faq_q1: "How long does an application take?", faq_a1: "Timing depends on the authority and case complexity. A formal reminder may be available if the authority remains inactive.",
    faq_q2: "Do I need to appear at the office in person?", faq_a2: "A personal appearance is required for matters such as fingerprinting and usually for collecting the card.",
    faq_q3: "How does temporary residence differ from EU resident status?", faq_a3: "Temporary residence is granted for a defined period. EU long-term resident status is indefinite but has additional eligibility conditions.",
    faq_q4: "What should I do after a refusal?", faq_a4: "The grounds and appeal deadline should be checked immediately. In a typical case, the deadline is 14 days from delivery of the decision.",
    contact_tag: "Contact", contact_title: "Book a case review", contact_desc: "Write or call us. We will identify what information and documents are needed for the first conversation.",
    form_title: "Contact form", form_name: "Full name", form_phone: "Phone number", form_email: "Email address", form_service: "Case type", form_select: "Choose a service", form_message: "Briefly describe your situation",
    form_consent: "I have read the data-processing rules in the", privacy_link: "Privacy policy", form_submit: "Send inquiry", form_notice: "Submitting the form does not create a contract or mean that the case has been accepted.",
    footer_disclaimer: "We are not a government authority. We provide consulting services and help prepare documents.", privacy_title: "Privacy policy", terms_title: "Terms of service", cookies_title: "Cookie information"
  }
};

const POLICY_DOCS = {
  pl: {
    privacy: ["Polityka prywatności", [
      ["Administrator danych", "Administratorem danych przekazanych przez formularz jest B&B Legal Advisory, ul. Gimnazjalna 2A/213, 85-007 Bydgoszcz. Kontakt: kontakt@bb-legal.dev."],
      ["Cel i podstawa", "Dane wykorzystujemy, aby odpowiedzieć na zapytanie i — jeśli strony tak ustalą — wykonać usługę. Podstawą przetwarzania jest prawnie uzasadniony interes administratora lub działania zmierzające do zawarcia umowy."],
      ["Twoje prawa", "Możesz żądać dostępu do danych, ich sprostowania, usunięcia lub ograniczenia przetwarzania, wnieść sprzeciw oraz skargę do Prezesa Urzędu Ochrony Danych Osobowych."]
    ]],
    terms: ["Regulamin usług", [["Zakres", "B&B Legal Advisory świadczy usługi doradcze, pomaga przygotować formularze i może reprezentować klienta na podstawie pełnomocnictwa."], ["Zapytanie", "Wysłanie formularza jest niezobowiązujące. Zakres, termin i wynagrodzenie wymagają odrębnego uzgodnienia."], ["Odpowiedzialność", "Informacje na stronie mają charakter ogólny i nie gwarantują określonego wyniku postępowania."]]],
    cookies: ["Informacja o plikach cookies", [["Ustawienia strony", "Serwis nie instaluje własnych analitycznych ani marketingowych plików cookies. Wybrany język może być zapisany lokalnie w przeglądarce (localStorage). Możesz usunąć tę informację w ustawieniach przeglądarki."]]]
  },
  uk: {
    privacy: ["Політика конфіденційності", [["Адміністратор даних", "Адміністратором даних із форми є B&B Legal Advisory, ul. Gimnazjalna 2A/213, 85-007 Bydgoszcz. Контакт: kontakt@bb-legal.dev."], ["Мета та підстава", "Ми використовуємо дані, щоб відповісти на запит і, якщо сторони домовляться, надати послугу. Підставою є законний інтерес адміністратора або дії до укладення договору."], ["Ваші права", "Ви можете вимагати доступу, виправлення, видалення чи обмеження обробки даних, подати заперечення або скаргу до польського органу із захисту даних."]]],
    terms: ["Умови надання послуг", [["Обсяг", "B&B Legal Advisory надає консультаційні послуги, допомагає готувати форми та може представляти клієнта за довіреністю."], ["Запит", "Надсилання форми ні до чого не зобов’язує. Обсяг, строк і оплата послуги погоджуються окремо."], ["Відповідальність", "Інформація на сайті є загальною і не гарантує певного результату провадження."]]],
    cookies: ["Інформація про cookies", [["Налаштування сайту", "Сайт не встановлює власних аналітичних або маркетингових cookies. Обрана мова може зберігатися локально у браузері (localStorage), звідки її можна видалити."]]]
  },
  ru: {
    privacy: ["Политика конфиденциальности", [["Администратор данных", "Администратором данных из формы является B&B Legal Advisory, ul. Gimnazjalna 2A/213, 85-007 Bydgoszcz. Контакт: kontakt@bb-legal.dev."], ["Цель и основание", "Мы используем данные, чтобы ответить на запрос и, если стороны договорятся, оказать услугу. Основанием служит законный интерес администратора или действия до заключения договора."], ["Ваши права", "Вы можете потребовать доступ, исправление, удаление или ограничение обработки данных, подать возражение или жалобу в польский орган по защите данных."]]],
    terms: ["Условия оказания услуг", [["Объем", "B&B Legal Advisory оказывает консультационные услуги, помогает готовить формы и может представлять клиента по доверенности."], ["Запрос", "Отправка формы ни к чему не обязывает. Объем, срок и оплата услуги согласовываются отдельно."], ["Ответственность", "Информация на сайте носит общий характер и не гарантирует определенного результата производства."]]],
    cookies: ["Информация о cookies", [["Настройки сайта", "Сайт не устанавливает собственные аналитические или маркетинговые cookies. Выбранный язык может храниться локально в браузере (localStorage), откуда его можно удалить."]]]
  },
  en: {
    privacy: ["Privacy policy", [["Data controller", "The controller of data submitted through the form is B&B Legal Advisory, ul. Gimnazjalna 2A/213, 85-007 Bydgoszcz. Contact: kontakt@bb-legal.dev."], ["Purpose and basis", "We use the data to answer your inquiry and, if agreed, provide a service. Processing is based on the controller's legitimate interests or steps taken before entering a contract."], ["Your rights", "You may request access, correction, deletion, or restriction of your data, object to processing, or lodge a complaint with the Polish data-protection authority."]]],
    terms: ["Terms of service", [["Scope", "B&B Legal Advisory provides consulting services, helps prepare forms, and may represent a client under a power of attorney."], ["Inquiry", "Submitting the form is non-binding. Scope, timing, and fees must be agreed separately."], ["Liability", "Information on this website is general and does not guarantee any particular outcome in proceedings."]]],
    cookies: ["Cookie information", [["Site settings", "The site does not set its own analytics or marketing cookies. Your language selection may be stored locally in the browser (localStorage), where you can remove it."]]]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const translatable = [...document.querySelectorAll("[data-i18n]")];
  const translatableLabels = [...document.querySelectorAll("[data-i18n-aria-label]")];
  const polish = Object.fromEntries(translatable.map((element) => [element.dataset.i18n, element.textContent.trim()]));
  translatableLabels.forEach((element) => { polish[element.dataset.i18nAriaLabel] = element.getAttribute("aria-label"); });
  polish.result_temporary = "Potrzebna jest indywidualna analiza podstawy pobytu.";
  polish.result_resident_ready = "Podstawowe kryteria formalne mogą być spełnione.";
  polish.result_resident_b1 = "Należy potwierdzić znajomość języka polskiego na poziomie B1.";
  polish.result_resident_years = "Ten status zwykle wymaga co najmniej 5 lat nieprzerwanego legalnego pobytu.";
  polish.result_work = "Potrzebna jest analiza dokumentów pracodawcy i warunków zatrudnienia.";
  polish.result_appeal = "Trzeba pilnie sprawdzić decyzję i termin wniesienia odwołania.";
  polish.menu_close = "Zamknij menu";

  let language = "pl";
  let lastFocused = null;

  const langButton = document.querySelector(".lang-toggle-btn");
  const langMenu = document.getElementById("langMenu");
  const langItems = [...document.querySelectorAll(".lang-item")];
  const langLabel = document.getElementById("activeLangLabel");
  const nav = document.getElementById("mainNav");
  const navToggle = document.querySelector(".mobile-nav-toggle");
  const modal = document.getElementById("policyModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.querySelector(".modal-close");
  const goal = document.getElementById("calcGoal");
  const years = document.getElementById("calcYears");
  const yearsValue = document.getElementById("calcYearsValue");
  const b1 = document.getElementById("calcB1");
  const result = document.getElementById("qualificationResult");

  const dictionary = () => language === "pl" ? polish : TRANSLATIONS[language];
  const translate = (key) => dictionary()[key] || polish[key] || key;

  function updateQualification() {
    const yearCount = Number(years.value);
    yearsValue.value = yearCount;
    let key = "result_temporary";
    if (goal.value === "resident") key = yearCount < 5 ? "result_resident_years" : b1.checked ? "result_resident_ready" : "result_resident_b1";
    if (goal.value === "work") key = "result_work";
    if (goal.value === "appeal") key = "result_appeal";
    result.textContent = translate(key);
  }

  function closeLanguageMenu() {
    langMenu.hidden = true;
    langButton.setAttribute("aria-expanded", "false");
  }

  function setLanguage(nextLanguage) {
    language = nextLanguage in TRANSLATIONS || nextLanguage === "pl" ? nextLanguage : "pl";
    document.documentElement.lang = language;
    translatable.forEach((element) => {
      const value = translate(element.dataset.i18n);
      if (value) element.textContent = value;
    });
    translatableLabels.forEach((element) => element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel)));
    if (nav.classList.contains("open")) navToggle.setAttribute("aria-label", translate("menu_close"));
    langLabel.textContent = language.toUpperCase();
    langItems.forEach((item) => item.classList.toggle("active", item.dataset.lang === language));
    try { localStorage.setItem("bb-legal-language", language); } catch (_) { /* Storage may be disabled. */ }
    closeLanguageMenu();
    updateQualification();
  }

  function closeMobileMenu() {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", translate("menu_aria"));
    document.body.classList.remove("menu-open");
  }

  function openPolicy(key) {
    const [title, sections] = POLICY_DOCS[language][key];
    lastFocused = document.activeElement;
    modalTitle.textContent = title;
    modalBody.replaceChildren();
    sections.forEach(([heading, paragraph]) => {
      const headingElement = document.createElement("h3");
      const paragraphElement = document.createElement("p");
      headingElement.textContent = heading;
      paragraphElement.textContent = paragraph;
      modalBody.append(headingElement, paragraphElement);
    });
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modalClose.focus();
  }

  function closePolicy() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocused) lastFocused.focus();
  }

  langButton.addEventListener("click", (event) => {
    event.stopPropagation();
    langMenu.hidden = !langMenu.hidden;
    langButton.setAttribute("aria-expanded", String(!langMenu.hidden));
  });
  langItems.forEach((item) => item.addEventListener("click", () => setLanguage(item.dataset.lang)));
  document.addEventListener("click", (event) => { if (!event.target.closest(".lang-control")) closeLanguageMenu(); });

  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", translate(open ? "menu_close" : "menu_aria"));
    document.body.classList.toggle("menu-open", open);
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileMenu));

  document.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      const willOpen = button.getAttribute("aria-expanded") !== "true";
      document.querySelectorAll(".faq-item button").forEach((otherButton) => {
        otherButton.setAttribute("aria-expanded", "false");
        document.getElementById(otherButton.getAttribute("aria-controls")).hidden = true;
      });
      button.setAttribute("aria-expanded", String(willOpen));
      panel.hidden = !willOpen;
    });
  });

  document.querySelectorAll("[data-policy]").forEach((button) => button.addEventListener("click", () => openPolicy(button.dataset.policy)));
  modalClose.addEventListener("click", closePolicy);
  modal.addEventListener("click", (event) => { if (event.target === modal) closePolicy(); });

  [goal, years, b1].forEach((control) => control.addEventListener("input", updateQualification));

  const navLinks = [...document.querySelectorAll(".nav-item-link")];
  const sections = navLinks.map((link) => document.querySelector(link.hash)).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => link.classList.toggle("active", link.hash === `#${visible.target.id}`));
  }, { rootMargin: "-25% 0px -60%", threshold: [0, 0.25, 0.5] });
  sections.forEach((section) => observer.observe(section));

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeLanguageMenu();
    closeMobileMenu();
    if (!modal.hidden) closePolicy();
  });

  let savedLanguage = "pl";
  try { savedLanguage = localStorage.getItem("bb-legal-language") || "pl"; } catch (_) { /* Storage may be disabled. */ }
  setLanguage(savedLanguage);
});

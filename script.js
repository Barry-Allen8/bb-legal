/**
 * B&B Legal - Dynamic Multi-Language Engine & ScrollSpy Indicator
 */

window.krisnarTranslations = {
  pl: {
    "hero_btn_consult": "Zamów Konsultację",
    "footer_banner_contact_title": "Kontakt",
    "footer_banner_social_title": "Media Społecznościowe",
    "footer_disclaimer": "Nie jesteśmy organem państwowym. Świadczymy usługi doradcze oraz pomoc w przygotowaniu dokumentów."
  },
  ua: {
    "hero_btn_consult": "Замовити Консультацію",
    "footer_banner_contact_title": "Контакт",
    "footer_banner_social_title": "Соцмережі",
    "footer_disclaimer": "Ми не є державним органом. Надаємо консультації та допомогу з підготовкою документів."
  },
  ru: {
    "hero_btn_consult": "Заказать Консультацию",
    "footer_banner_contact_title": "Контакт",
    "footer_banner_social_title": "Соцсети",
    "footer_disclaimer": "Мы не являемся государственным органом. Предоставляем консультации и помощь в подготовке документов."
  },
  en: {
    "hero_btn_consult": "Book a Consultation",
    "footer_banner_contact_title": "Contact",
    "footer_banner_social_title": "Social Media",
    "footer_disclaimer": "We are not a government agency. We provide consulting services and assistance with document preparation."
  }
};

document.addEventListener('DOMContentLoaded', function() {
  var navLinks = document.querySelectorAll('.nav-item-link');
  var sectionIds = ['home', 'services', 'mos', 'process', 'faq', 'contact'];
  var sections = [];

  sectionIds.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) sections.push(el);
  });

  function updateScrollSpy() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var headerOffset = 140;

    var activeId = 'home';
    for (var i = 0; i < sections.length; i++) {
      var sec = sections[i];
      var top = sec.offsetTop - headerOffset;
      var bottom = top + sec.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        activeId = sec.getAttribute('id');
      }
    }

    if ((window.innerHeight + scrollY) >= (document.body.offsetHeight - 50)) {
      activeId = 'contact';
    }

    navLinks.forEach(function(link) {
      var href = link.getAttribute('href');
      if (href === '#' + activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateScrollSpy, { passive: true });
  updateScrollSpy();

  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      navLinks.forEach(function(l) { l.classList.remove('active'); });
      this.classList.add('active');
    });
  });
});

/* ============================================================
   MAIN — Navigation, Animations, Scroll
   ============================================================ */

/* ── Navigation ── */
const nav      = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// Scroll → nav style
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Hamburger toggle
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
}

// Mobile menu links → close on click
document.querySelectorAll('#mobileMenu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ── Scroll Reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('[data-reveal], [data-stagger]').forEach(el => {
  revealObserver.observe(el);
});


/* ── Smooth scroll offset (fixed nav) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── Image fallback ──
   画像ファイルが無い / 読み込めない場合は img を取り除き、
   元のグラデーション背景をそのまま見せる。 */
document.querySelectorAll('img.media').forEach(img => {
  img.addEventListener('error', () => img.remove(), { once: true });
});


/* ── Reservation Form ──
   送信先は form の data-endpoint（= Formspree のエンドポイント）。
   YOUR_FORM_ID のままの間はデモ動作（実送信しない）になります。 */
const form     = document.getElementById('reservationForm');
const thankyou = document.getElementById('formThankyou');
const formErr  = document.getElementById('formError');

if (form) {
  const endpoint = form.dataset.endpoint || '';
  const isDemo   = !endpoint || endpoint.includes('YOUR_FORM_ID');
  // Google フォーム宛ては CORS 上 no-cors でしか投げられない（＝結果を読めない）
  const isGoogle = endpoint.includes('docs.google.com');
  const submitBtn = form.querySelector('button[type="submit"]');
  const btnLabel  = submitBtn ? submitBtn.innerHTML : '';

  // 過去日を選べないようにする
  const dateInput = form.querySelector('#date');
  if (dateInput) {
    const t = new Date();
    dateInput.min = new Date(t.getTime() - t.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 10);
  }

  const RULES = {
    name:  v => v.trim().length >= 1 ? '' : 'お名前を入力してください',
    tel:   v => /^[0-9０-９+\-() 　]{9,}$/.test(v.trim()) ? '' : '電話番号を正しく入力してください',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'メールアドレスを正しく入力してください'
  };

  const clearError = field => {
    field.removeAttribute('aria-invalid');
    const e = field.parentElement.querySelector('.field-error');
    if (e) e.remove();
  };

  const setError = (field, msg) => {
    clearError(field);
    field.setAttribute('aria-invalid', 'true');
    const span = document.createElement('span');
    span.className = 'field-error';
    span.textContent = msg;
    field.parentElement.appendChild(span);
  };

  // 入力し直したらエラー表示を消す
  Object.keys(RULES).forEach(id => {
    const f = form.querySelector('#' + id);
    if (!f) return;
    f.addEventListener('input', () => {
      if (f.getAttribute('aria-invalid') === 'true' && !RULES[id](f.value)) clearError(f);
    });
    f.addEventListener('blur', () => {
      const msg = RULES[id](f.value);
      if (msg && f.value !== '') setError(f, msg); else if (!msg) clearError(f);
    });
  });

  const validate = () => {
    let first = null;
    Object.keys(RULES).forEach(id => {
      const f = form.querySelector('#' + id);
      if (!f) return;
      const msg = RULES[id](f.value);
      if (msg) { setError(f, msg); if (!first) first = f; } else { clearError(f); }
    });
    return first;
  };

  const showThanks = () => {
    form.style.animation = 'fadeUp 0.3s var(--ease-out) reverse forwards';
    setTimeout(() => {
      form.style.display = 'none';
      thankyou.style.display = 'block';
      thankyou.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

  const showFormError = msg => {
    if (!formErr) return;
    formErr.textContent = msg;
    formErr.hidden = false;
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (formErr) formErr.hidden = true;

    const bad = validate();
    if (bad) { bad.focus(); bad.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }

    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<span>送信中…</span>'; }

    if (isDemo) {
      console.warn('[LUMIÈRE] デモ動作です。実際に送信するには reservation.html の data-endpoint / action を Formspree のエンドポイントに置き換えてください。');
      setTimeout(showThanks, 600);
      return;
    }

    // ハニーポットに入力があれば bot とみなし、送らずに完了画面だけ出す
    const trap = form.querySelector('[name="_gotcha"]');
    if (trap && trap.value) { showThanks(); return; }

    if (isGoogle) {
      // entry.xxxx を urlencoded で送る。no-cors のためレスポンスは常に opaque。
      const params = new URLSearchParams();
      new FormData(form).forEach((v, k) => { if (k.startsWith('entry.')) params.append(k, v); });
      try {
        await fetch(endpoint, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString()
        });
        showThanks();
      } catch (err) {
        showFormError('通信エラーが発生しました。電波状況をご確認のうえ、もう一度お試しください。');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = btnLabel; }
      }
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) { showThanks(); return; }
      const data = await res.json().catch(() => ({}));
      showFormError(
        (data.errors && data.errors.map(x => x.message).join(' / ')) ||
        '送信に失敗しました。お手数ですが、お電話（03-0000-0000）にてご連絡ください。'
      );
    } catch (err) {
      showFormError('通信エラーが発生しました。電波状況をご確認のうえ、もう一度お試しください。');
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = btnLabel; }
    }
  });
}


/* ── FAQ Accordion ── */
function initFaq() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      document.querySelectorAll('.faq-question').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('is-open');
      });
      // Open clicked if was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.classList.add('is-open');
      }
    });
  });
}

initFaq();

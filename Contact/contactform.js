document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('contact-status');
  const ACCESS_KEY = 'a8de65f0-1ac4-41ea-b934-23ac8fd8859b';

  if (!form) return;

  const setStatus = (msg, isError = false) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = isError ? 'salmon' : 'lightgreen';
  };

  const validateForm = (f) => {
    const name = f.querySelector('[name="name"]')?.value?.trim() || '';
    const email = f.querySelector('[name="email"]')?.value?.trim() || '';
    const message = f.querySelector('[name="message"]')?.value?.trim() || '';
    if (!name || !email || !message) return 'Please fill out all fields.';
    // basic email pattern
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) return 'Please enter a valid email address.';
    return null;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const validationError = validateForm(form);
    if (validationError) {
      setStatus(validationError, true);
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    setStatus('Sending...');

    const data = new FormData(form);
    data.append('access_key', ACCESS_KEY);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        setStatus('Message sent. Thank you!');
        form.reset();
      } else {
        const msg = json.message || 'Submission failed. Try again later.';
        setStatus(msg, true);
      }
    } catch (err) {
      console.error(err);
      setStatus('Network error. Please try again.', true);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});
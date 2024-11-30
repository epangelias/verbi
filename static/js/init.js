const updateTheme = () => {
  const colorScheme = document.querySelector('meta[name="color-scheme"]')?.getAttribute('content') || 'light';
  const prefersDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
  const hasDark = colorScheme?.includes('dark');
  const hasLight = colorScheme?.includes('light');
  const isDark = (hasDark && hasLight) ? prefersDark : hasDark;

  document.body.classList.remove('theme-light', 'theme-dark');
  document.body.classList.add(`theme-${isDark ? 'dark' : 'light'}`);
};

function initTheme() {
  updateTheme();

  globalThis.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);

  new MutationObserver(updateTheme).observe(
    document.querySelector('meta[name="color-scheme"]'),
    { attributes: true, attributeFilter: ['content'] },
  );
}

initTheme();

// iOS active state
document.addEventListener('touchstart', () => {}, { passive: true });

// Page transition out
globalThis.addEventListener('beforeunload', () => document.body.classList.add('fade-out'));

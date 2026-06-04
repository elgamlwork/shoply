const SCRIPT = `(() => {
  try {
    var stored = JSON.parse(localStorage.getItem('shoply:theme') || 'null');
    var mode = (stored && stored.state && stored.state.mode) || 'system';
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = mode === 'dark' || (mode === 'system' && prefersDark);
    if (dark) document.documentElement.classList.add('dark');
  } catch (_) {}
})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}

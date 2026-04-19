export function ThemeScript() {
  const script = `
    (function () {
      try {
        var storedTheme = localStorage.getItem("theme");
        var theme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
        document.documentElement.dataset.theme = theme;
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch (e) {}
    })();
  `

  return <script dangerouslySetInnerHTML={{ __html: script }} />
}

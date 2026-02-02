export function initializeTheme() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (localStorage.getItem("theme")) {
    document.body.classList.toggle("dark-mode", localStorage.getItem("theme") === "dark");
  } else if (prefersDark) {
    document.body.classList.add("dark-mode");
  }
}

export function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}
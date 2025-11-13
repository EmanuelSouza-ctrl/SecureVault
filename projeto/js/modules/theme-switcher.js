const THEME_KEY = 'app-theme';
const DARK_MODE_CLASS = 'dark-mode';
function updateButtonIcon(isDark) {
    const btn = document.getElementById('theme-toggle-btn');
    const icon = btn ? btn.querySelector('i') : null;
    if (icon) {
        if (isDark) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
}
function applyTheme(theme) {
    const isDark = theme === 'dark';
    if (isDark) {
        document.body.classList.add(DARK_MODE_CLASS);
    } else {
        document.body.classList.remove(DARK_MODE_CLASS);
    }
    
    updateButtonIcon(isDark); 
}
function initializeTheme() {
    let storedTheme = localStorage.getItem(THEME_KEY);

    if (!storedTheme) {
        storedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(storedTheme);
    return storedTheme;
}
export function toggleTheme() {
    const currentTheme = document.body.classList.contains(DARK_MODE_CLASS) ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
}
export default initializeTheme;
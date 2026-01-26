export function notify(message, type = "info") {
  const container = document.createElement("div");
  container.className = `notification ${type}`;
  container.textContent = message;

  document.body.appendChild(container);

  setTimeout(() => {
    container.classList.add("show");
  }, 50);

  setTimeout(() => {
    container.classList.remove("show");
    setTimeout(() => container.remove(), 300);
  }, 3000);
}
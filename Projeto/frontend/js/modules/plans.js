import { getPlans } from "./api.js";
import { notify } from "./notifications.js";

export async function loadPlans() {
  const container = document.getElementById("plans");
  if (!container) return;

  container.innerHTML = '<div class="loading">Carregando planos...</div>';

  try {
    const plans = await getPlans();
    container.innerHTML = "";
    plans.forEach(plan => {
      const div = document.createElement("div");
      div.className = "plan";
      div.innerHTML = `
        <h3>${plan.name}</h3>
        <p>${plan.storage_gb === 0 ? 'Ilimitado' : plan.storage_gb + ' GB'} de armazenamento</p>
        <p>R$ ${plan.price_monthly}/mês</p>
        <button>Selecionar</button>
      `;
      container.appendChild(div);
    });
    notify("Planos carregados", "success");
  } catch (error) {
    notify("Erro ao carregar planos", "error");
    container.innerHTML = "";
  }
}
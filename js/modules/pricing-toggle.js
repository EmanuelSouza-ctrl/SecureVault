export function setupPricingToggle() {
  const toggle = document.getElementById('price-toggle');
  const monthlyPrices = document.querySelectorAll('.price-monthly');
  const annualPrices = document.querySelectorAll('.price-annual');
  const discountText = document.getElementById('annual-discount');
  if (!toggle || monthlyPrices.length === 0) return;

  function handleToggle() {
    const isAnnual = toggle.checked;
    monthlyPrices.forEach(el => el.style.display = isAnnual ? 'none' : 'block');
    annualPrices.forEach(el => el.style.display = isAnnual ? 'block' : 'none');
    if (discountText) {
      discountText.style.visibility = isAnnual ? 'visible' : 'hidden';
      discountText.style.opacity = isAnnual ? '1' : '0';
    }
  }

  handleToggle();
  toggle.addEventListener('change', handleToggle);
}
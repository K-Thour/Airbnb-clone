import { categories, categoryIcons } from "./filters.js";

(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false,
    );
  });
})();

(() => {
  "use strict";

  const filters = document.getElementById("filters");

  // Create category filters
  categories.forEach((category) => {
    const filter = document.createElement("div");
    filter.classList.add("filter");
    filter.dataset.category = category;
    const iconClass = categoryIcons[category] || "fa-solid fa-house";
    filter.innerHTML = `<i class="${iconClass}"></i><p>${category.charAt(0).toUpperCase() + category.slice(1)}</p>`;
    filters.prepend(filter);
  });

  const listingsContainer = document.querySelector(".row.row-cols-1");
  const allListings = Array.from(listingsContainer?.children || []);

  // Create "All" filter
  const allFilter = document.createElement("div");
  allFilter.classList.add("filter", "active");
  allFilter.dataset.category = "all";
  allFilter.innerHTML = `<i class="fa-solid fa-border-all"></i><p>All</p>`;
  filters.prepend(allFilter);

  // Add click functionality
  filters.querySelectorAll(".filter").forEach((filter) => {
    filter.addEventListener("click", () => {
      // Update active state
      filters
        .querySelectorAll(".filter")
        .forEach((f) => f.classList.remove("active"));
      filter.classList.add("active");

      const category = filter.dataset.category;

      // Filter listings
      allListings.forEach((listing) => {
        const listingCard = listing.querySelector(".card");
        const listingCategory = listingCard?.dataset.category;

        if (category === "all" || listingCategory === category) {
          listing.style.display = "";
        } else {
          listing.style.display = "none";
        }
      });
    });
  });
})();

const taxToggle = document.getElementById("flexSwitchCheckDefault");
taxToggle.addEventListener("change", () => {
  const taxInfo = document.querySelectorAll(".tax-info");
  taxInfo.forEach((info) => {
    info.style.display = taxToggle.checked ? "inline" : "none";
  });
});

import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";

// Initialize Bootstrap popovers
function initializePopovers() {
    const popoverTriggerList = document.querySelectorAll(
        '[data-bs-toggle="popover"]'
    );
    [...popoverTriggerList].map(
        (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
    );
}

export { initializePopovers };

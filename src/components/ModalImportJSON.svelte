<script>
    import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";
    import { _ } from "svelte-i18n";

    let { open = $bindable(false), onimport } = $props();

    let text = $state("");
    let isValidJSON = $state(true);

    let modal, modalElement;

    // Show/Hide modal depending on 'open' prop
    $effect(() => {
        modal = new bootstrap.Modal(modalElement);
        modalElement.addEventListener("hidden.bs.modal", handleModalClose);
        if (open) {
            modal.show();
        } else {
            modal.hide();
        }
    });

    // Validate JSON input
    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        try {
            let parsedJSON = JSON.parse(text);
            isValidJSON = true;
            onimport(parsedJSON);
            modal.hide();
        } catch (error) {
            isValidJSON = false;
            console.error("Error importing JSON:", error);
        }
    }

    // Reset form
    function handleReset(event) {
        isValidJSON = true;
    }

    // Allow to reopen modal
    function handleModalClose(event) {
        open = false;
    }
</script>

<div class="modal" tabindex="-1" bind:this={modalElement}>
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{$_("modal.import.title")}</h5>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label={$_("commons.button_close")}
                ></button>
            </div>
            <form
                onsubmit={handleSubmit}
                onreset={handleReset}
                novalidate={!isValidJSON}
            >
                <div class="modal-body">
                    <div class="has-validation">
                        <label for="json">
                            {$_("modal.import.label_json")}:
                        </label>
                        <textarea
                            name="json"
                            id="json"
                            rows="20"
                            class={!isValidJSON
                                ? "is-invalid form-control"
                                : "form-control"}
                            required
                            bind:value={text}
                        ></textarea>
                        {#if !isValidJSON}
                            <div class="invalid-feedback">
                                {$_("modal.import.alert_invalid")}
                            </div>
                        {/if}
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="reset" class="btn btn-secondary">
                        {$_("commons.button_reset")}
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-cloud-upload"></i>
                        {$_("modal.import.button_import")}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

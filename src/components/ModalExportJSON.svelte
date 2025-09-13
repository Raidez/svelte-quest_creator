<script>
    import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";
    import { _ } from "svelte-i18n";
    import toastify from "toastify-js";

    let { open = $bindable(false), text = "" } = $props();

    let modal, modalElement;

    let isValidJSON = $derived(Object.keys(JSON.parse(text)).length > 0);

    // Show/Hide modal depending on 'open' prop
    $effect(() => {
        modal = new bootstrap.Modal(modalElement);
        modalElement.addEventListener("hidden.bs.modal", handleModalClose);
        if (open) {
            modal.show();
        } else {
            modal.hide();
        }

        if (open && !isValidJSON) {
            toastify({
                text: $_("toast.invalid_json"),
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "#dc3545",
                },
                // @ts-ignore
            }).showToast();
        }
    });

    // Allow to reopen modal
    function handleModalClose(event) {
        open = false;
    }

    // Copy text to clipboard
    function copyToClipboard() {
        if (text) {
            navigator.clipboard.writeText(text);
            toastify({
                text: $_("toast.quest_json_copied"),
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "#4fbe87",
                },
                // @ts-ignore
            }).showToast();
        }
    }
</script>

<div class="modal" tabindex="-1" bind:this={modalElement}>
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{$_("modal.export.title")}</h5>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label={$_("commons.button_close")}
                ></button>
            </div>
            <div class="modal-body">
                <textarea
                    name="json"
                    id="json"
                    rows="20"
                    class="form-control"
                    bind:value={text}
                    readonly
                ></textarea>
            </div>
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-primary"
                    onclick={copyToClipboard}
                    disabled={!isValidJSON}
                >
                    <i class="bi bi-clipboard"></i>
                    {$_("modal.export.button_copy")}
                </button>
            </div>
        </div>
    </div>
</div>

<script>
    import { slide } from "svelte/transition";
    import { initializePopovers } from "../utils";
    import { _ } from "svelte-i18n";
    import toastify from "toastify-js";

    let { onAsk } = $props();

    let api_key = $state(sessionStorage.getItem("api_key"));
    let showAPIKeyInput = $state(false);
    let apiKeyInput = $state();
    let isInvalid = $state(false);

    function completeWithAI() {
        if (!api_key) {
            showAPIKeyInput = true;
            return;
        }

        sessionStorage.setItem("api_key", api_key);
        showAPIKeyInput = false;
        onAsk(api_key).catch((error) => {
            toastify({
                text: $_("ai.invalid"),
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "#ff6f61",
                },
                // @ts-ignore
            }).showToast();
            showAPIKeyInput = true;
            isInvalid = true;
            api_key = "";
        });
    }

    function handleInputKeydown(event) {
        if (event.key === "Enter") {
            completeWithAI();
        }
    }
</script>

<div
    style="display: flex; align-items: center; gap: 0.5rem; position: relative;"
    role="toolbar"
    tabindex="0"
>
    <button
        type="button"
        class="btn"
        aria-label={$_("ai.button")}
        title={$_("ai.button")}
        onclick={completeWithAI}
    >
        <i class="bi bi-stars fs-2"></i>
    </button>
    {#if showAPIKeyInput}
        <input
            type="password"
            name="api_key"
            id="api_key"
            class={isInvalid ? "form-control is-invalid" : "form-control"}
            style="max-width: 180px;"
            data-bs-toggle="popover"
            data-bs-trigger="focus"
            data-bs-content={$_("ai.popover")}
            in:slide={{ duration: 250, axis: "x" }}
            out:slide={{ duration: 250, axis: "x" }}
            bind:value={api_key}
            bind:this={apiKeyInput}
            onintroend={() => apiKeyInput && apiKeyInput.focus()}
            onfocus={initializePopovers}
            onblur={() => (showAPIKeyInput = false)}
            onkeydown={handleInputKeydown}
        />
    {/if}
</div>

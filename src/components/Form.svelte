<script>
    import { onMount } from "svelte";
    import { _, locale } from "svelte-i18n";
    import { get } from "svelte/store";
    import toastify from "toastify-js";
    import { askChat } from "../chatbot.js";
    import { Quest } from "../models.svelte.js";
    import { initializePopovers } from "../utils.js";
    import AskAiButton from "./AskAiButton.svelte";
    import CollapseEvents from "./CollapseEvents.svelte";
    import FormQuest from "./FormQuest.svelte";
    import ModalExportJson from "./ModalExportJSON.svelte";
    import ModalImportJson from "./ModalImportJSON.svelte";

    let currentQuest = $state(new Quest());

    let openModalImport = $state(false);
    let importText = $state("");
    let openModalExport = $state(false);
    let exportedJSON = $derived(JSON.stringify(currentQuest.toJSON(), null, 4));

    // Import JSON data to currentQuest
    function importJSON(data) {
        try {
            currentQuest = Quest.fromJSON(data);
        } catch (error) {
            toastify({
                text: $_("toast.invalid_quest_json"),
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "#ff6f61",
                },
                // @ts-ignore
            }).showToast();
            return;
        }
    }

    // Open export modal
    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        openModalExport = true;
    }

    // Reset currentQuest
    function handleReset(event) {
        event.preventDefault();
        event.stopPropagation();

        currentQuest = new Quest();
    }

    // onMount lifecycle hook
    onMount(() => {
        // Initialize Bootstrap popovers
        initializePopovers();
    });

    // When locale changed (update localStorage)
    locale.subscribe(() => {
        localStorage.setItem("locale", get(locale));

        // Wait for DOM update before re-initializing popovers
        setTimeout(() => {
            initializePopovers();
        }, 0);
    });

    // Switch locale
    function switchLocale() {
        switch (get(locale)) {
            case "fr":
                locale.set("en");
                break;
            case "en":
                locale.set("fr");
                break;
        }
    }

    // Handle asking the AI
    function handleAsk(api_key) {
        const prompt = JSON.stringify(currentQuest.toJSON(), null, 4);
        return askChat(api_key, prompt).then((response) => {
            if (typeof response === "string") {
                toastify({
                    text: "AI response received",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "#4BB543",
                    },
                    // @ts-ignore
                }).showToast();

                importText = response;
                openModalImport = true;
            }
        });
    }
</script>

<ModalImportJson
    bind:open={openModalImport}
    validateJSON={Quest.checkJSON}
    text={importText}
    onimport={importJSON}
/>

<ModalExportJson bind:open={openModalExport} text={exportedJSON} />

<main class="bg-light">
    <div class="container py-5">
        <h1 class="mb-4 row justify-content-between align-items-center">
            <div class="col-auto">
                {$_("website_title")}

                <button
                    type="button"
                    class="btn"
                    onclick={switchLocale}
                    aria-label={$_("button_switch_language")}
                    title={$_("button_switch_language")}
                >
                    {#if $locale === "fr"}
                        <i class="fi fi-us"></i>
                    {:else if $locale === "en"}
                        <i class="fi fi-fr"></i>
                    {/if}
                </button>
            </div>
            <div class="col-auto">
                <AskAiButton onAsk={handleAsk} />
            </div>
        </h1>
        <form
            class="card card-body"
            onsubmit={handleSubmit}
            onreset={handleReset}
        >
            <FormQuest bind:quest={currentQuest} />

            <CollapseEvents bind:quest={currentQuest} />

            <div class="d-flex justify-content-between">
                <button type="reset" class="btn btn-danger"
                    >{$_("commons.button_reset")}</button
                >
                <div>
                    <button
                        type="button"
                        class="btn btn-info"
                        onclick={() => (openModalImport = true)}
                        >{$_("form.button_import_json")}</button
                    >
                    <button type="submit" class="btn btn-primary"
                        >{$_("form.button_generate_quest")}</button
                    >
                </div>
            </div>
        </form>
    </div>
</main>

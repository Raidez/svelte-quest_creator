<script>
    import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";
    import { onMount } from "svelte";
    import { _, locale } from "svelte-i18n";
    import { get } from "svelte/store";
    import toastify from "toastify-js";
    import { Quest, QuestEvent } from "../models.svelte";
    import FormEvent from "./FormEvent.svelte";
    import { askChat } from "../chatbot.js";

    let currentQuest = $state(new Quest());
    let textareaImport = $state("");
    let textareaExport = $state("");
    let difficulty = $derived(
        Math.round(
            currentQuest.events
                .map((event) => event.difficulty / 100)
                .reduce((acc, val) => acc * val, 1) * 100,
        ),
    );
    let api_key = $state("");
    let aiResponse = $state("");

    // onMount lifecycle hook
    onMount(() => {
        // Initialize Bootstrap popovers
        initializePopovers();

        // Load saved API key from cookies
        cookieStore.get("api_key").then((item) => {
            if (item) api_key = item.value;
        });
    });

    // Re-initialize popovers when locale changes
    locale.subscribe(() => {
        // Wait for DOM update before re-initializing popovers
        setTimeout(() => {
            initializePopovers();
        }, 0);
        cookieStore.set("locale", get(locale));
    });

    function completeWithAI(event) {
        event.preventDefault();
        if (!api_key) return;
        cookieStore.set("api_key", api_key);

        const prompt = JSON.stringify(currentQuest.toJSON(), null, 4);
        askChat(api_key, prompt).then((response) => {
            if (typeof response === "string") {
                aiResponse = response;
            }
        });
    }

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

    function initializePopovers() {
        const popoverTriggerList = document.querySelectorAll(
            '[data-bs-toggle="popover"]',
        );
        [...popoverTriggerList].map(
            (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl),
        );
    }

    function importJSON() {
        if (textareaImport) {
            let parsed;
            try {
                parsed = JSON.parse(textareaImport);
            } catch (error) {
                toastify({
                    text: $_("toast.invalid_json"),
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

            try {
                currentQuest = Quest.fromJSON(parsed);
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

            textareaImport = "";
            const modal = bootstrap.Modal.getInstance(
                document.getElementById("modalImportJSON"),
            );
            modal.hide();
        }
    }

    function addEvent() {
        const newEvent = new QuestEvent();
        currentQuest.events.push(newEvent);

        let intervalId;
        setTimeout(() => {
            if (intervalId) clearInterval(intervalId);
        }, 5000);

        intervalId = setInterval(() => {
            const eventIndex = currentQuest.events.lastIndexOf(newEvent);
            const element = document.querySelector(
                `#collapse-event-${eventIndex}`,
            );

            if (!element) return;

            const collapseElement =
                bootstrap.Collapse.getOrCreateInstance(element);
            collapseElement.show();
            clearInterval(intervalId);
        }, 100);
    }

    function submitForm(event) {
        event.preventDefault();
        textareaExport = JSON.stringify(currentQuest.toJSON(), null, 4);
        const modal = new bootstrap.Modal(
            document.getElementById("modalExportJSON"),
        );
        modal.show();
    }

    function resetForm(event) {
        event.preventDefault();
        currentQuest = new Quest();
    }

    function removeEvent(index) {
        currentQuest.events.splice(index, 1);
    }

    function copyToClipboard() {
        if (textareaExport) {
            navigator.clipboard.writeText(textareaExport);
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

    function collapseBonus(eventIndex) {
        currentQuest.events[eventIndex].bonus.forEach((_, bonusIndex) => {
            const collapseElement = document.getElementById(
                `collapse-event-${eventIndex}-bonus-${bonusIndex}`,
            );
            const bsCollapse = bootstrap.Collapse.getInstance(collapseElement);
            if (bsCollapse) {
                bsCollapse.hide();
            }
        });
    }
</script>

{#snippet snippetEvent(eventObject, index)}
    <div class="accordion-item">
        <h2 class="accordion-header" id="heading-event-{index}">
            <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapse-event-{index}"
                aria-expanded="true"
                aria-controls="collapse-event-{index}"
                onclick={() => collapseBonus(index)}
            >
                {$_("event.section_title")} #{index + 1}
            </button>
        </h2>
        <div
            id="collapse-event-{index}"
            class="accordion-collapse collapse"
            aria-labelledby="heading-event-{index}"
            data-bs-parent="#accordionEvents"
        >
            <div class="accordion-body">
                <FormEvent
                    {index}
                    bind:name={eventObject.name}
                    bind:desc={eventObject.desc}
                    bind:difficulty={eventObject.difficulty}
                    bind:bonus={eventObject.bonus}
                    remove={() => removeEvent(index)}
                />
            </div>
        </div>
    </div>
{/snippet}

<div id="modalImportJSON" class="modal" tabindex="-1">
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
            <div class="modal-body">
                <textarea
                    name="json"
                    id="json"
                    rows="20"
                    class="form-control"
                    bind:value={textareaImport}
                ></textarea>
            </div>
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">{$_("commons.button_close")}</button
                >
                <button
                    type="button"
                    class="btn btn-primary"
                    onclick={importJSON}
                    >{$_("modal.import.button_import")}</button
                >
            </div>
        </div>
    </div>
</div>

<div id="modalExportJSON" class="modal" tabindex="-1">
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
                    bind:value={textareaExport}
                ></textarea>
            </div>
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">{$_("commons.button_close")}</button
                >
                <button
                    type="button"
                    class="btn btn-primary"
                    onclick={copyToClipboard}
                >
                    <i class="bi bi-clipboard"></i>
                    {$_("modal.export.button_copy")}</button
                >
            </div>
        </div>
    </div>
</div>

<div id="modalAskAI" class="modal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Ask AI</h5>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label={$_("commons.button_close")}
                ></button>
            </div>
            <form onsubmit={completeWithAI}>
                <div class="modal-body">
                    <label for="api_key" class="form-label"> API key: </label>
                    <input
                        type="text"
                        id="api_key"
                        name="api_key"
                        class="form-control"
                        required
                        bind:value={api_key}
                    />

                    {#if aiResponse}
                        <div class="mt-3">
                            <label for="ai_response" class="form-label"
                                >AI Response:</label
                            >
                            <textarea
                                id="ai_response"
                                name="ai_response"
                                class="form-control"
                                rows="10"
                                readonly
                                bind:value={aiResponse}
                            ></textarea>
                        </div>
                    {/if}
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal"
                        >{$_("commons.button_close")}</button
                    >
                    <button type="submit" class="btn btn-success">
                        <i class="bi bi-robot"></i>
                        Complete with AI
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

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
                <button
                    type="button"
                    class="btn"
                    data-bs-toggle="modal"
                    data-bs-target="#modalAskAI"
                    aria-label="Ask AI"
                    title="Ask AI"
                >
                    <i class="bi bi-stars fs-2"></i>
                </button>
            </div>
        </h1>
        <form class="card card-body" onsubmit={submitForm} onreset={resetForm}>
            <div>
                <h2 class="mb-4">{$_("quest.section_title")}</h2>

                <div class="mb-3">
                    <label for="name" class="form-label">
                        {$_("quest.label_name")}:
                    </label>

                    <div class="input-group">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            class="form-control"
                            required
                            bind:value={currentQuest.name}
                            data-bs-toggle="popover"
                            data-bs-trigger="focus"
                            data-bs-content={$_("popover.quest_name")}
                        />
                        <i class="input-group-text bi bi-asterisk text-danger"
                        ></i>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="desc" class="form-label"
                        >{$_("quest.label_desc")}:</label
                    >
                    <textarea
                        name="desc"
                        id="desc"
                        class="form-control"
                        bind:value={currentQuest.desc}
                        data-bs-toggle="popover"
                        data-bs-trigger="focus"
                        data-bs-content={$_("popover.quest_desc")}
                    ></textarea>
                </div>
                <div class="mb-3">
                    <label for="reward" class="form-label"
                        >{$_("quest.label_reward")}:</label
                    >

                    <div class="input-group">
                        <input
                            type="number"
                            name="reward"
                            id="reward"
                            class="form-control"
                            required
                            min="0"
                            bind:value={currentQuest.reward}
                            data-bs-toggle="popover"
                            data-bs-trigger="focus"
                            data-bs-content={$_("popover.quest_reward")}
                        />
                        <i class="input-group-text bi bi-asterisk text-danger"
                        ></i>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="duration" class="form-label"
                        >{$_("quest.label_duration")}:</label
                    >

                    <div class="input-group">
                        <input
                            type="number"
                            name="duration"
                            id="duration"
                            class="form-control"
                            required
                            min="0"
                            bind:value={currentQuest.duration}
                            data-bs-toggle="popover"
                            data-bs-trigger="focus"
                            data-bs-content={$_("popover.quest_duration")}
                        />
                        <i class="input-group-text bi bi-asterisk text-danger"
                        ></i>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="time_limit" class="form-label"
                        >{$_("quest.label_time_limit")}:</label
                    >

                    <div class="input-group">
                        <input
                            type="number"
                            name="time_limit"
                            id="time_limit"
                            class="form-control"
                            required
                            min="0"
                            bind:value={currentQuest.timeLimit}
                            data-bs-toggle="popover"
                            data-bs-trigger="focus"
                            data-bs-content={$_("popover.quest_time_limit")}
                        />
                        <i class="input-group-text bi bi-asterisk text-danger"
                        ></i>
                    </div>
                </div>
            </div>

            <div class="mb-4">
                <h2 class="mb-4">{$_("events.section_title")}</h2>

                <p title={$_("popover.quest_difficulty")}>
                    <strong>{$_("events.label_difficulty")}:</strong>
                    {difficulty}
                </p>
                {#if currentQuest.events.length === 0}
                    <p class="text-muted">{$_("events.text_no_events")}</p>
                {/if}

                <button
                    type="button"
                    class="btn btn-success mb-3"
                    onclick={addEvent}
                >
                    <i class="bi bi-plus-lg"></i>
                    {$_("events.button_add_event")}
                </button>

                <div class="accordion" id="accordionEvents">
                    {#each currentQuest.events as eventObject, index}
                        {@render snippetEvent(eventObject, index)}
                    {/each}
                </div>
            </div>

            <div class="d-flex justify-content-between">
                <button type="reset" class="btn btn-danger"
                    >{$_("form.button_reset")}</button
                >
                <div>
                    <button
                        type="button"
                        class="btn btn-info"
                        data-bs-toggle="modal"
                        data-bs-target="#modalImportJSON"
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

<script>
    import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";
    import { Quest, QuestEvent } from "../models.svelte";
    import FormEvent from "./FormEvent.svelte";
    import toastify from "toastify-js";

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

    function importJSON() {
        if (textareaImport) {
            let parsed;
            try {
                parsed = JSON.parse(textareaImport);
            } catch (error) {
                toastify({
                    text: "Invalid JSON!",
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
                    text: "Invalid Quest JSON structure!",
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
                text: "Quest JSON copied to clipboard!",
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
                Event #{index + 1}
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
                <h5 class="modal-title">Paste your JSON here</h5>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
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
                    data-bs-dismiss="modal">Close</button
                >
                <button
                    type="button"
                    class="btn btn-primary"
                    onclick={importJSON}>Import JSON</button
                >
            </div>
        </div>
    </div>
</div>

<div id="modalExportJSON" class="modal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Your Quest JSON</h5>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
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
                    data-bs-dismiss="modal">Close</button
                >
                <button
                    type="button"
                    class="btn btn-primary"
                    onclick={copyToClipboard}
                >
                    <i class="bi bi-clipboard"></i>
                    Copy to Clipboard</button
                >
            </div>
        </div>
    </div>
</div>

<main class="bg-light">
    <div class="container py-5">
        <h1 class="mb-4">Quest Creator</h1>
        <form class="card card-body" onsubmit={submitForm} onreset={resetForm}>
            <div>
                <h2 class="mb-4">Quest</h2>

                <div class="mb-3">
                    <label for="name" class="form-label">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        class="form-control"
                        required
                        bind:value={currentQuest.name}
                    />
                </div>
                <div class="mb-3">
                    <label for="desc" class="form-label">Description:</label>
                    <textarea
                        name="desc"
                        id="desc"
                        class="form-control"
                        required
                        bind:value={currentQuest.desc}
                    ></textarea>
                </div>
                <div class="mb-3">
                    <label for="reward" class="form-label">Reward:</label>
                    <input
                        type="number"
                        name="reward"
                        id="reward"
                        class="form-control"
                        required
                        min="0"
                        bind:value={currentQuest.reward}
                    />
                </div>
                <div class="mb-3">
                    <label for="duration" class="form-label">Duration:</label>
                    <input
                        type="number"
                        name="duration"
                        id="duration"
                        class="form-control"
                        required
                        min="0"
                        bind:value={currentQuest.duration}
                    />
                </div>
                <div class="mb-3">
                    <label for="time_limit" class="form-label"
                        >Time Limit:</label
                    >
                    <input
                        type="number"
                        name="time_limit"
                        id="time_limit"
                        class="form-control"
                        required
                        min="0"
                        bind:value={currentQuest.timeLimit}
                    />
                </div>
            </div>

            <div class="mb-4">
                <h2 class="mb-4">Events</h2>

                {#if currentQuest.events.length === 0}
                    <p class="text-muted">No events added yet.</p>
                {:else}
                    <p><strong>Difficulty:</strong> {difficulty}</p>
                {/if}

                <button
                    type="button"
                    class="btn btn-success mb-3"
                    onclick={addEvent}
                >
                    <i class="bi bi-plus-lg"></i> Add Event
                </button>

                <div class="accordion" id="accordionEvents">
                    {#each currentQuest.events as eventObject, index}
                        {@render snippetEvent(eventObject, index)}
                    {/each}
                </div>
            </div>

            <div class="d-flex justify-content-between">
                <button type="reset" class="btn btn-danger">Reset</button>
                <div>
                    <button
                        type="button"
                        class="btn btn-info"
                        data-bs-toggle="modal"
                        data-bs-target="#modalImportJSON">Import JSON</button
                    >
                    <button type="submit" class="btn btn-primary"
                        >Generate Quest</button
                    >
                </div>
            </div>
        </form>
    </div>
</main>

<script>
    import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";
    import { _ } from "svelte-i18n";
    import { QuestEvent } from "../models.svelte";
    import FormEvent from "./FormEvent.svelte";

    let { quest = $bindable() } = $props();

    let difficulty = $derived(
        Math.round(
            quest.events
                .map((event) => event.difficulty / 100)
                .reduce((acc, val) => acc * val, 1) * 100,
        ),
    );

    // Add a new event in the collapse
    function addEvent() {
        const newEvent = new QuestEvent();
        quest.events.push(newEvent);

        let intervalId;
        setTimeout(() => {
            if (intervalId) clearInterval(intervalId);
        }, 5000);

        intervalId = setInterval(() => {
            const eventIndex = quest.events.lastIndexOf(newEvent);
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

    // Remove an event from the collapse
    function removeEvent(index) {
        quest.events.splice(index, 1);
    }

    // Show the last bonus of collapse
    function collapseBonus(eventIndex) {
        quest.events[eventIndex].bonus.forEach((_, bonusIndex) => {
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

<main>
    <div class="mb-4">
        <h2 class="mb-4">{$_("events.section_title")}</h2>

        <p title={$_("popover.quest_difficulty")}>
            <strong>{$_("events.label_difficulty")}:</strong>
            {difficulty}
        </p>
        {#if quest.events.length === 0}
            <p class="text-muted">{$_("events.text_no_events")}</p>
        {/if}

        <button type="button" class="btn btn-success mb-3" onclick={addEvent}>
            <i class="bi bi-plus-lg"></i>
            {$_("events.button_add_event")}
        </button>

        <div class="accordion" id="accordionEvents">
            {#each quest.events as eventObject, index}
                {@render snippetEvent(eventObject, index)}
            {/each}
        </div>
    </div>
</main>

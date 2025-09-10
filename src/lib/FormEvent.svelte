<script>
    import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";
    import { EventBonus } from "../models.svelte";
    import FormBonus from "./FormBonus.svelte";

    let {
        index = 0,
        name = $bindable(),
        desc = $bindable(),
        difficulty = $bindable(),
        bonus = $bindable(),
        remove,
    } = $props();

    function addBonus() {
        const newBonus = new EventBonus();
        bonus.push(newBonus);

        let intervalId;
        setTimeout(() => {
            if (intervalId) clearInterval(intervalId);
        }, 5000);

        intervalId = setInterval(() => {
            const bonusIndex = bonus.lastIndexOf(newBonus);
            const element = document.querySelector(
                `#collapse-event-${index}-bonus-${bonusIndex}`,
            );

            if (!element) return;

            const collapseElement =
                bootstrap.Collapse.getOrCreateInstance(element);
            collapseElement.show();
            clearInterval(intervalId);
        }, 100);
    }

    function removeBonus(index) {
        bonus.splice(index, 1);
    }
</script>

{#snippet snippetBonus(bonusObject, eventIndex, bonusIndex)}
    <div class="accordion-item">
        <h2
            class="accordion-header"
            id="heading-event-{eventIndex}-bonus-{bonusIndex}"
        >
            <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapse-event-{eventIndex}-bonus-{bonusIndex}"
                aria-expanded="true"
                aria-controls="collapse-event-{eventIndex}-bonus-{bonusIndex}"
            >
                Bonus #{bonusIndex + 1}
            </button>
        </h2>
        <div
            id="collapse-event-{eventIndex}-bonus-{bonusIndex}"
            class="accordion-collapse collapse"
            aria-labelledby="heading-event-{eventIndex}-bonus-{bonusIndex}"
            data-bs-parent="#accordionEvent{eventIndex}Bonus"
        >
            <div class="accordion-body">
                <FormBonus
                    index={bonusIndex}
                    bind:type={bonusObject.type}
                    bind:name={bonusObject.name}
                    bind:value={bonusObject.value}
                    remove={() => removeBonus(bonusIndex)}
                />
            </div>
        </div>
    </div>
{/snippet}

<main class="mb-4 p-3 border rounded" data-index={index}>
    <div class="d-flex justify-content-between mb-2">
        <h3>Event</h3>
        <button type="button" class="btn btn-danger btn-sm" onclick={remove}>
            <i class="bi bi-trash"></i> Remove
        </button>
    </div>

    <div>
        <label for="event_name-{index}" class="form-label">Name:</label>
        <input
            type="text"
            id="event_name-{index}"
            name="event_name-{index}"
            class="form-control"
            required
            bind:value={name}
        />
    </div>
    <div>
        <label for="event_desc-{index}" class="form-label">Description:</label>
        <textarea
            name="event_desc-{index}"
            id="event_desc-{index}"
            class="form-control"
            required
            bind:value={desc}
        ></textarea>
    </div>
    <div>
        <label for="event_difficulty-{index}" class="form-label"
            >Difficulty:</label
        >
        <input
            type="number"
            name="event_difficulty-{index}"
            id="event_difficulty-{index}"
            class="form-control"
            required
            min="0"
            max="100"
            bind:value={difficulty}
        />
    </div>

    <button
        type="button"
        class="btn btn-warning mt-3 mb-3"
        data-index={index}
        onclick={addBonus}
    >
        <i class="bi bi-plus-lg"></i> Add Bonus
    </button>

    <div class="accordion" id="accordionEvent{index}Bonus">
        {#each bonus as bonusObject, bonusIndex}
            {@render snippetBonus(bonusObject, index, bonusIndex)}
        {/each}
    </div>
</main>

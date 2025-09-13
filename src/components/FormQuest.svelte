<script>
    import { onMount } from "svelte";
    import { _ } from "svelte-i18n";
    import { initializePopovers } from "../utils";

    let { quest = $bindable() } = $props();

    // onMount lifecycle hook
    onMount(() => {
        // Initialize Bootstrap popovers
        initializePopovers();
    });
</script>

<main>
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
                    bind:value={quest.name}
                    data-bs-toggle="popover"
                    data-bs-trigger="focus"
                    data-bs-content={$_("popover.quest_name")}
                />
                <i class="input-group-text bi bi-asterisk text-danger"></i>
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
                bind:value={quest.desc}
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
                    bind:value={quest.reward}
                    data-bs-toggle="popover"
                    data-bs-trigger="focus"
                    data-bs-content={$_("popover.quest_reward")}
                />
                <i class="input-group-text bi bi-asterisk text-danger"></i>
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
                    bind:value={quest.duration}
                    data-bs-toggle="popover"
                    data-bs-trigger="focus"
                    data-bs-content={$_("popover.quest_duration")}
                />
                <i class="input-group-text bi bi-asterisk text-danger"></i>
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
                    bind:value={quest.timeLimit}
                    data-bs-toggle="popover"
                    data-bs-trigger="focus"
                    data-bs-content={$_("popover.quest_time_limit")}
                />
                <i class="input-group-text bi bi-asterisk text-danger"></i>
            </div>
        </div>
    </div>
</main>

<script>
    let {
        index = 0,
        type = $bindable(),
        name = $bindable(),
        value = $bindable(),
        remove,
    } = $props();

    let items = $state([]);
    const jobs = [
        "warrior",
        "paladin",
        "mage",
        "rogue",
        "healer",
        "bard",
        "summoner",
    ];
    let selectedItem = $derived(items.find((item) => item.name === name));

    fetch("/assets/items.json")
        .then((response) => response.json())
        .then((data) => {
            items = data.filter((item) => item._type == "item");
        })
        .catch((error) => {
            console.error("Error fetching items:", error);
        });

    function selectItem(itemName) {
        name = itemName;
    }
</script>

<div id="modalPickItem" class="modal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Pick item</h5>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                ></button>
            </div>
            <div class="modal-body d-flex justify-content-center">
                <div class="d-flex flex-wrap justify-content-center">
                    {#each items as item}
                        <button
                            type="button"
                            class="btn btn-light m-1 col-2"
                            data-bs-dismiss="modal"
                            onclick={() => selectItem(item.name)}
                        >
                            <figure
                                class="d-flex flex-column align-items-center"
                            >
                                <img
                                    class="item-img item-image-scale-3"
                                    src={item.sprite.path}
                                    alt={item.name}
                                    style="object-position: -{item.sprite
                                        .tile_index[0] * 16}px -{item.sprite
                                        .tile_index[1] * 16}px;"
                                />
                                <figcaption class="mt-2 text-center">
                                    {item.name}
                                </figcaption>
                            </figure>
                        </button>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<main class="mb-4 p-3 border rounded">
    <div class="d-flex justify-content-between mb-2">
        <h2>Bonus</h2>
        <button type="button" class="btn btn-danger btn-sm" onclick={remove}>
            <i class="bi bi-trash"></i> Remove
        </button>
    </div>

    <div>
        <label for="bonus_type-{index}" class="form-label">Type:</label>
        <select
            name="type"
            id="bonus_type-{index}"
            class="form-select"
            required
            bind:value={type}
        >
            <option value="item">Item</option>
            <option value="job">Job</option>
        </select>
    </div>
    <div>
        <label for="bonus_name-{index}" class="form-label">
            {#if type === "item"}Item Name{:else}Job Title{/if}:
        </label>
        {#if type === "job"}
            <select
                name="bonus_name-{index}"
                id="bonus_name-{index}"
                class="form-select"
                required
                bind:value={name}
            >
                {#each jobs as job}
                    <option value={job}>{job}</option>
                {/each}
            </select>
        {:else if type === "item"}
            <div class="input-group">
                {#if selectedItem}
                    <span class="input-group-text p-1">
                        <img
                            class="item-img item-image-scale-2"
                            src={selectedItem.sprite.path}
                            alt={selectedItem.name}
                            style="object-position: -{selectedItem.sprite
                                .tile_index[0] * 16}px -{selectedItem.sprite
                                .tile_index[1] * 16}px;"
                        />
                    </span>
                {/if}
                <input
                    type="text"
                    id="bonus_name-{index}"
                    name="bonus_name-{index}"
                    class="form-control"
                    required
                    bind:value={name}
                />
                <button
                    class="btn btn-outline-secondary"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#modalPickItem"
                    aria-label="Pick item"
                    ><i class="bi bi-eyedropper"></i></button
                >
            </div>
        {/if}
    </div>
    <div>
        <label for="bonus_value-{index}" class="form-label">Value:</label>
        <input
            type="number"
            name="bonus_value-{index}"
            id="bonus_value-{index}"
            class="form-control"
            required
            min="0"
            bind:value
        />
    </div>
</main>

<style>
    .item-img {
        width: 16px;
        height: 16px;
        image-rendering: pixelated;
        object-fit: none;
        zoom: 1;
    }
    .item-image-scale-3 {
        zoom: 3;
    }
    .item-image-scale-2 {
        zoom: 2;
    }
</style>

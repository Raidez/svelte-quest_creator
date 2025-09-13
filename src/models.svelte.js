class Quest {
    _type = "quest";
    name = $state();
    desc = $state();
    reward = $state();
    duration = $state();
    timeLimit = $state();
    events = $state();

    constructor(name = "", desc = "", reward = 0, duration = 0, timeLimit = 0, events = []) {
        this.name = name;
        this.desc = desc;
        this.reward = reward;
        this.duration = duration;
        this.timeLimit = timeLimit;
        this.events = events;
    }

    toJSON() {
        return {
            _type: this._type,
            name: this.name,
            desc: this.desc,
            reward: this.reward,
            duration: this.duration,
            "time_limit": this.timeLimit,
            events: this.events.map(event => ({
                _type: event._type,
                name: event.name,
                desc: event.desc,
                difficulty: event.difficulty,
                bonus: event.bonus.map(bonus => ({
                    _type: bonus._type,
                    type: bonus.type,
                    item: bonus.type === "item" ? bonus.item : undefined,
                    job: bonus.type === "job" ? bonus.job : undefined,
                    value: bonus.value,
                })),
            })),
        };
    }

    static checkJSON(json) {
        const jobs = [
            "warrior",
            "paladin",
            "mage",
            "rogue",
            "healer",
            "bard",
            "summoner",
        ];

        if (typeof json !== "object" || json._type !== "quest") return false;
        if (typeof json.name !== "string") return false;
        if (typeof json.desc !== "string") return false;
        if (typeof json.reward !== "number") return false;
        if (typeof json.duration !== "number") return false;
        if (typeof json.time_limit !== "number") return false;
        if (!Array.isArray(json.events)) return false;
        for (const event of json.events) {
            if (typeof event !== "object" || event._type !== "event") return false;
            if (typeof event.name !== "string") return false;
            if (typeof event.desc !== "string") return false;
            if (typeof event.difficulty !== "number") return false;
            if (!Array.isArray(event.bonus)) return false;
            for (const bonus of event.bonus) {
                if (typeof bonus !== "object" || bonus._type !== "bonus") return false;
                if (typeof bonus.type !== "string" || !["item", "job"].includes(bonus.type)) return false;
                if (bonus.type === "item" && typeof bonus.item !== "string") return false;
                if (bonus.type === "job" && typeof bonus.job !== "string") return false;
                if (bonus.type === "job" && !jobs.includes(bonus.job)) return false;
                if (typeof bonus.value !== "number") return false;
            }
        }
        return true;
    }

    static fromJSON(json) {
        const quest = new Quest(json.name, json.desc, json.reward, json.duration, json.time_limit, []);
        quest.events = (json.events || []).map(eventJson => {
            const event = new QuestEvent(eventJson.name, eventJson.desc, eventJson.difficulty, []);
            event.bonus = (eventJson.bonus || []).map(bonusJson => {
                const bonus = new EventBonus(bonusJson.type, bonusJson.item, bonusJson.job, bonusJson.value);
                return bonus;
            });
            return event;
        });
        return quest;
    }
}

class QuestEvent {
    _type = "event";
    name = $state();
    desc = $state();
    difficulty = $state();
    bonus = $state();

    constructor(name = "", desc = "", difficulty = 0, bonus = []) {
        this.name = name;
        this.desc = desc;
        this.difficulty = difficulty;
        this.bonus = bonus;
    }
}

class EventBonus {
    _type = "bonus";
    type = $state();
    item = $state();
    job = $state();
    value = $state();

    constructor(type = "item", item = "", job = "", value = 0) {
        this.type = type;
        this.item = item;
        this.job = job;
        this.value = value;
    }

    get name() {
        return this.type === "item" ? this.item : this.job;
    }

    set name(value) {
        if (this.type === "item") {
            this.item = value;
        }
        if (this.type === "job") {
            this.job = value;
        }
    }
}

export { Quest, QuestEvent, EventBonus };

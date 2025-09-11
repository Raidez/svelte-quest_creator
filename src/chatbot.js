import { Mistral } from '@mistralai/mistralai';

const system = `
==== CONTEXT ====
Quest Creator is a tool for creating quests in a fantasy role-playing game.
It's generate a JSON quest format like this:
{
    "_type": "quest",
    "name": "Save the village",
    "desc": "Help the villagers by defeating the monsters.",
    "reward": 400,
    "duration": 3,
    "time_limit": 5,
    "events": [
        {
            "_type": "event",
            "name": "Travel to the village",
            "desc": "Make your way through the forest to reach the village.",
            "difficulty": 80,
            "bonus": [
                {
                    "_type": "bonus",
                    "type": "item",
                    "item": "compass",
                    "value": 5
                },
                {
                    "_type": "bonus",
                    "type": "item",
                    "item": "torch",
                    "value": 2
                },
                {
                    "_type": "bonus",
                    "type": "job",
                    "job": "summoner",
                    "value": 6
                }
            ]
        },
        {
            "_type": "event",
            "name": "Defeat the monsters",
            "desc": "Fight the monsters threatening the village.",
            "difficulty": 60,
            "bonus": [
                {
                    "_type": "bonus",
                    "type": "item",
                    "item": "health potion",
                    "value": 8
                },
                {
                    "_type": "bonus",
                    "type": "item",
                    "item": "oil",
                    "value": 12
                },
                {
                    "_type": "bonus",
                    "type": "item",
                    "item": "trap",
                    "value": 5
                },
                {
                    "_type": "bonus",
                    "type": "item",
                    "item": "amulet",
                    "value": 8
                }
            ]
        }
    ]
}

A quest has:
- name: The name of the quest
- desc: A description of the quest
- reward: The reward for completing the quest (in gold)
- duration: The estimated time to complete the quest (in days)
- time_limit: The time limit to complete the quest (in days)
- events: A list of events that make up the quest

Each event has:
- name: The name of the event
- desc: A description of the event
- difficulty: The difficulty of the event (0-100 success chance, so the higher the number, the easier it is)
- bonus: A list of bonuses that can help with the event

Each bonus has:
- type: The type of bonus ("item" or "job")
- item: The name of the item (if type is "item")
- job: The name of the job (if type is "job")
- value: The value of the bonus (in percentage points)

Items and Jobs are predefined in the game.
Prefer existing items, but you may invent new ones if needed.
If you invent new items, make sure they fit the fantasy theme.

Existing Items:
- gold: Source of happiness.
- diamond: Bring joy to everyone.
- ration: Keeps heroes fed.
- torch: Provides light in dark areas.
- lamp: Better light source than a torch.
- lockpick: Unlocks chests and doors.
- crowbar: Also unlock chests and doors with more force.
- rope: Useful for climbing and tying things.
- compass: Helps with navigation.
- trap: Catch them all!
- amulet: A magical amulet that grants protection.
- arrows: Ammunition for bows.
- helmet: A helmet that protects the head.
- shield: A sturdy shield for blocking attacks.
- armor: Protective armor that reduces damage.
- bandage: Heal small wounds.
- health potion: A potion that restores health.
- oil: Fire in a bottle.


Jobs:
- warrior
- paladin
- mage
- rogue
- healer
- bard
- summoner


Explanation:
On the quest "Save the village", the event "Travel to the village" has a difficulty of 80,
meaning there is an 80% chance of success.

If the player has a "compass" item, they get a 5% bonus to their success chance.
If they have a "torch" item, they get a 2% bonus.
If they have the "summoner" job, they get a 6% bonus.

To succeed in the quest, the player must succeed in all events.
Without bonuses, the player has a 48% chance of completing the quest (0.8 * 0.6 = 0.48).

==== INSTRUCTIONS ====
Complete the following quest in the same JSON format.
Make sure the JSON is valid.
Do not add any explanations or notes, just the JSON.
Respect the original language (English or French).
`;


async function askChat(apiKey, question) {
    const client = new Mistral({ apiKey: apiKey });

    const chatResponse = await client.chat.complete({
        model: 'mistral-small-latest',
        messages: [
            { role: "system", content: system },
            { role: 'user', content: question }
        ],
    });

    return chatResponse.choices[0].message.content;
}

export { askChat };

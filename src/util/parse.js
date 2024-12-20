import DOMPurify from "dompurify";

function fetchContentByUUID(uuid) {
    const arr = uuid.split('.');
    return `<b>${arr[arr.length - 1]}</b>`;
    const uuidContentMap = {
      "Compendium.pf2e.actionspf2e.Item.Delay": "<b>Delay</b>",
      "Compendium.pf2e.actionspf2e.Item.Ready": "<b>Ready</b>",
      "Compendium.pf2e.actionspf2e.Item.Seek": "<b>Seek</b>",
      "Compendium.pf2e.actionspf2e.Item.Request": "<b>Request</b>",
      "Compendium.pf2e.actionspf2e.Item.Recall Knowledge": "<b>Recall Knowledge</b>",
      "Compendium.pf2e.actionspf2e.Item.Hide": "<b>Hide</b>",
      "Compendium.pf2e.actionspf2e.Item.Sneak": "<b>Sneak</b>",
      "Compendium.pf2e.actionspf2e.Item.Crawl": "<b>Crawl</b>",
      "Compendium.pf2e.actionspf2e.Item.Stand": "<b>Stand</b>",
      "Compendium.pf2e.actionspf2e.Item.Climb": "<b>Climb</b>",
      "Compendium.pf2e.actionspf2e.Item.Swim": "<b>Swim</b>",
      "Compendium.pf2e.actionspf2e.Item.Fly": "<b>Fly</b>",
      "Compendium.pf2e.actionspf2e.Item.Escape": "<b>Escape</b>",
      "Compendium.pf2e.actionspf2e.Item.Force Open": "<b>Force Open</b>",
      "Compendium.pf2e.actionspf2e.Item.Take Cover": "<b>Take Cover</b>",
      "Compendium.pf2e.actionspf2e.Item.Cast a Spell": "<b>Cast a Spell</b>",
      "Compendium.pf2e.actionspf2e.Item.Treat Wounds": "<b>Treat Wounds</b>",
      "Compendium.pf2e.actionspf2e.Item.Interact": "<b>Interact</b>",
      "Compendium.pf2e.conditionitems.Item.Dazzled": "<b>Dazzled</b>",
      "Compendium.pf2e.conditionitems.Item.Observed": "<b>Observed</b>",
      "Compendium.pf2e.conditionitems.Item.Off-Guard": "<b>Off-Guard</b>",
      "Compendium.pf2e.conditionitems.Item.Concealed": "<b>Concealed</b>",
      "Compendium.pf2e.conditionitems.Item.Dying": "<b>Dying</b>",
      "Compendium.pf2e.conditionitems.Item.Unconscious": "<b>Unconscious</b>",
      "Compendium.pf2e.conditionitems.Item.Wounded": "<b>Wounded</b>",
      "Compendium.pf2e.conditionitems.Item.Clumsy": "<b>Clumsy</b>",
      "Compendium.pf2e.conditionitems.Item.Immobilized": "<b>Immobilized</b>", 
      "Compendium.pf2e.conditionitems.Item.Undetected": "<b>Undetected</b>",
      "Compendium.pf2e.conditionitems.Item.Hidden": "<b>Hidden</b>",
      "Compendium.pf2e.conditionitems.Item.Grabbed": "<b>Grabbed</b>",
      "Compendium.pf2e.conditionitems.Item.Slowed": "<b>Slowed</b>",
      "Compendium.pf2e.conditionitems.Item.Blinded": "<b>Blinded</b>",
      "Compendium.pf2e.conditionitems.Item.Prone": "<b>Prone</b>",
      "Compendium.pf2e.conditionitems.Item.Stunned": "<b>Stunned</b>",
      "Compendium.pf2e.conditionitems.Item.Fatigued": "<b>Fatigued</b>",
      "Compendium.pf2e.conditionitems.Item.Invisible": "<b>Invisible</b>",

    };
    
    return uuidContentMap[uuid];
}

function fetchContentByCheck(check) {
  const checkContentMap = {
    "flat|showDC:all|dc:11": "<b>DC 11 Flat Check</b>",
    "flat|showDC:all|dc:5": "<b>DC 5 Flat Check</b>",
    "flat|showDC:all|dc:15": "<b>DC 15 Flat Check</b>",
    "flat|showDC:all|dc:resolve(5+@item.badge.value)" : "<b>Flat Check</b>",
    "flat|showDC:all|dc:11|traits:secret" : "<b>DC 11 Flat Check</b>",
    "will|dc:28" : "<b>DC 28 Will Check</b>",
    "reflex|dc:17|basic" : "<b>DC 17 basic Reflex</b>",
    "reflex": "<b>Reflex Check</b>",
    "fortitude": "<b>Fortitude Check</b>",
    "will": "<b>Will Check</b>",
    "flat|dc:5": "<b>DC 5 Flat Check</b>"
  };
  
  return checkContentMap[check];
}

function fetchContentByDamage(damage) {
  const arr = damage.split("[").join(' ').split(']').join('');
  console.log(arr)
  return arr;
  // const checkDamageMap = {
  //     "3d6[electricity]": "3d6 electricity",
  // };
  
  // return checkDamageMap[damage];
}

function fetchContentByTemplate(template) {

  const checkTemplateMap = {
      "emanation|distance:10": "10-foot emanation",
  };
  
  return checkTemplateMap[template];
}

async function fetchLocalizedContent(localizeKey) {
  console.log(localizeKey)
  const ref = {
    'PF2E.PersistentDamage.Bleed1.success': '<strong>1 persistent bleed damage</strong>',
    'PF2E.NPC.Abilities.Glossary.AttackOfOpportunity': 'actions/reactive-strike.json',
    'PF2E.NPC.Abilities.Glossary.Rend': '<p><strong>Requirements</strong> The monster hit the same enemy with two consecutive Strikes of the listed type in the same round; <strong>Effect</strong> The monster automatically deals that Strike\'s damage again to the enemy.</p>'
  }
  if(ref[localizeKey][0] === '<') return ref[localizeKey];

  try {
    // Make an API request to fetch the localized content based on the key
    // This is a placeholder and needs to be replaced with your actual API fetch logic
    const response = await fetch(`https://taylormusolf.com/pf2e/packs/${ref[localizeKey]}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    //return replaceReferences(data.description.value)
    console.log(data.system.description.value)
    return data.system.description.value; // Assuming the response contains the text under a 'content' key
  } catch (error) {
    console.error("Error fetching localized content:", error);
    return null; // Return null if there's an error
  }
}

export const replaceReferences = async (string) => {
    const purified = DOMPurify.sanitize(string);
    const replacements = [];

    purified.replace(/@UUID\[(.*?)\](?:{(.*?)})?|@Localize\[(.*?)\]|@Check\[(.*?)\]|@Damage\[([^\[\]]*(?:\[[^\[\]]*\])?[^\[\]]*)\]|@Template\[(.*?)\]/g, (match, uuid, displayText, localizeKey, check, damage, template) => {
      let replacementPromise;
      if (localizeKey) {
        // Handle @Localize references by making an API fetch
        replacementPromise = fetchLocalizedContent(localizeKey).then(localizedText => ({
          match,
          replacement: localizedText || match,
        }));
      } else if(uuid){
        if (displayText) {
          // If there is display text, return the display text
          replacementPromise = Promise.resolve({
            match,
            replacement: displayText,
          });
        } else {
          replacementPromise = Promise.resolve({
            match,
            replacement: fetchContentByUUID(uuid) || match,
          });
        }
      } else if(check){
        replacementPromise = Promise.resolve({
          match,
          replacement: fetchContentByCheck(check) || match,
        });
      } else if(damage){

        replacementPromise = Promise.resolve({
          match,
          replacement: fetchContentByDamage(damage) || match,
        });
      } else if(template){
        replacementPromise = Promise.resolve({
          match,
          replacement: fetchContentByTemplate(template) || match,
        });
      }
      if (replacementPromise) {
        replacements.push(replacementPromise);
      }
    });

  // Await all replacements to be processed
  const resolvedReplacements = await Promise.all(replacements);
  // Reconstruct the string with replacements
  let result = string;
  for (const { match, replacement } of resolvedReplacements) {
    result = result.replace(match, replacement);
  }

  return result;

}

export const ptagParse = (str) => {
  return str.replace(/<\/?p>/g, '');
}


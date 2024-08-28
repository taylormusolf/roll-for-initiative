function fetchContentByUUID(uuid) {
    const uuidContentMap = {
      "Compendium.pf2e.actionspf2e.Item.Delay": "<b>Delay</b>",
      "Compendium.pf2e.actionspf2e.Item.Ready": "<b>Ready</b>"
    };
    
    return uuidContentMap[uuid];
}

export const replaceUUIDs = (string) => {
    return string.replace(/@UUID\[(.*?)\]/g, (match, uuid) => {
      // Fetch or retrieve content based on the UUID
      // Here, you would replace this with the actual content fetching logic
      const fetchedContent = fetchContentByUUID(uuid); // Replace with actual function
      return fetchedContent ? fetchedContent : match; // Replace with fetched content or leave as is if not found
    });
}

export const ptagParse = (str) => {
  return str.replace(/<\/?p>/g, '');
}


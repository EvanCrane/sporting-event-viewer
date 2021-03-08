
export default class EventService {
    /**
     * Call API endpoint for upcoming event data and returns relevant event data
     * @param {*} stateAssocKey 
     * @param {*} dateFrom 
     * @param {*} dateTo 
     * @param {*} size 
     * @returns Promise resolving to [] or null
     */
    async fetchEventData(stateAssocKey, dateFrom, dateTo, size) {
        try {
            let baseUrl = 'https://challenge.nfhsnetwork.com/v2/search/events/upcoming';
            baseUrl += `?state_association_key=${stateAssocKey}&from=${dateFrom}&to=${dateTo}&size=${size}`;
            console.log('Making GET request to ' + baseUrl);

            const response = await fetch(baseUrl);
            const jsonData = await response.json();
            return await this.filterJsonData(jsonData);
        } catch (e) {
            console.log(`Error in fetchEventData: ${e}`);
            return null;
        }
    }

    /**
     * Filter data by key, headline, subheadline, start_time
     * Returns a promise in case there is a massive amount of json data to process
     * @param {Object} jsonObject 
     * @returns Promise
     */
    filterJsonData(jsonObject) {
        return new Promise((resolve) => {
            const requiredKeys = ['key', 'headline', 'subheadline', 'start_time'];
            let filteredData = [];

            filterHelper(jsonObject);
            resolve(filteredData);

            // Recursively search for the required keys on the json object
            function filterHelper(node) {
                if (!node || node === {} || node === []) { // Check if current node is not truthy, empty object/array
                    return;
                } else if (Array.isArray(node)) { // Check if node is an array and recursively search each item in the array
                    node.forEach(item => {
                        filterHelper(item);
                    });
                } else if (typeof node == 'object') { // Check if node is an object
                    // We will check if required keys exist in this object and add them to the data list
                    // Otherwise we'll need to recursively search the values for nested arrays/objects
                    // This is based on the assumption that an event has all required keys and will not have a child/sub event
                    const keys = Object.keys(node);
                    if (requiredKeys.every(element => keys.includes(element))) {
                        let tempObj = {};
                        requiredKeys.forEach(e => {
                            tempObj[e] = node[e];
                        });
                        filteredData.push(tempObj);
                    } else {
                        Object.entries(node).forEach(entry => {
                            if (typeof entry == 'object' || Array.isArray(entry)) {
                                filterHelper(entry);
                            }
                        });
                    }
                }
            }
        });
    }
}
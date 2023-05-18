const axios = require("axios");

const baseUrl = "https://api.potterdb.com/v1/spells";

module.exports = {
    getSpells: () => {
        return axios.get(baseUrl);
    },
    // createSpell: (spell) => {
    //     return axios.post(baseUrl, spell);
    // },
    // updateSpell: () => {
        
    // }
}
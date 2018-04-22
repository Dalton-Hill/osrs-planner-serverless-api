// Inserts some basic data to the DB in order to test the application

const axios = require('axios');


const magicPayload = {
  name: "Magic Tree",
  log: {
    name: "Magic Logs",
    firemaking_xp: 303.8,
    woodcutting_xp: 250,
    fletching_products: [
      {
        name: "Magic Longbow (u)",
        xp_reward: 91.5,
        next_product: {
          name: "Magic Longbow",
          xp_reward: 91.5,
          requires_bowstring: true,
          high_alchemy_value: 1536
        }
      }
    ]
  }
};

const yewPayload = {
  name: "Yew Tree",
  log: {
    name: "Yew Logs",
    firemaking_xp: 202.5,
    woodcutting_xp: 175,
    fletching_products: [
      {
        name: "Yew Longbow (u)",
        xp_reward: 75,
        next_product: {
          name: "Yew Longbow",
          xp_reward: 75,
          requires_bowstring: true,
          high_alchemy_value: 768
        }
      }
    ]
  }
};

axios.post('http://localhost:3000/tree', magicPayload)
  .then(res => { console.log(res) })
  .catch(err => { console.log(err) });

axios.post('http://localhost:3000/tree', yewPayload)
  .then(res => { console.log(res) })
  .catch(err => { console.log(err) });
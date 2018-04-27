// Inserts some basic data to the DB in order to test the application

const axios = require('axios');

const prod_url = 'https://8y35tqer0g.execute-api.us-east-1.amazonaws.com/dev/tree';
const dev_url = 'http://localhost:3000/tree';


const magicPayload = {
  name: "Magic Tree",
  log: {
    name: "Magic Logs",
    firemaking_xp: 303.8,
    woodcutting_xp: 250,
    image_url: 'https://vignette.wikia.nocookie.net/2007scape/images/b/b6/Magic_pyre_logs_animated.gif/revision/latest?cb=20180203063258',
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
    image_url: 'https://vignette.wikia.nocookie.net/2007scape/images/b/b1/Yew_pyre_logs.png/revision/latest?cb=20140811074047',
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

axios.post(prod_url, magicPayload)
  .then(res => { console.log(res) })
  .catch(err => { console.log(err) });

axios.post(prod_url, yewPayload)
  .then(res => { console.log(res) })
  .catch(err => { console.log(err) });
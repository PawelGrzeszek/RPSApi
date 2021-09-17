const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const Round = require("../models/Round");

module.exports = router;

// arrays of choices and result for randomizer
const choice = ["paper", "rock", "scissors"];
const result = ["player one wins", "draw", "player two wins"];

//GET player with rounds
// id of requested player
router.get("/:id", getPlayer, async (req, res) => {
  res.json(res.player);
});

//POST player
router.post("/", async (req, res) => {
  // create new player
  const player = new Player({});

  try {
    // save results
    const newPlayer = await player.save();
    res.status(201).json(newPlayer);
  } catch (err) {
    res.status(400).json({ message: error.message });
  }
});

//POST round for player
// id of player
router.post("/:id", getPlayer, async (req, res) => {
  // randomize choice of first player
  let random = Math.floor(Math.random() * choice.length);

  // creeate new round with randomized choice and corresponding result
  const round = new Round({
    firstPlayer: choice[random],
    result: result[random],
  });
  // add round to player
  res.player.rounds.push(round._id);
  // reset randomizer
  random = 0;

  try {
    // save results
    await round.save();
    await res.player.save();
    res.status(201).json(res.player);
  } catch (err) {
    res.status(400).json({ message: error.message });
  }
});

//DELETE one player
// id of player to delete
router.delete("/:id", getPlayer, async (req, res) => {
  try {
    // delete rounds of given player
    await Round.collection.deleteMany({ _id: { $in: res.player.rounds } });
    // delete player
    await Player.collection.deleteMany(res.player);
    res.json({ message: "Deleted player" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//DELETE all rounds of one player
// id of player
router.delete("/:id/rounds", getPlayer, async (req, res) => {
  try {
    // delete rounds of given player
    await Round.collection.deleteMany({
      _id: { $in: res.player.rounds },
    });
    res.json(res.player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware responsible for getting player with its rounds
async function getPlayer(req, res, next) {
  let player;
  try {
    // find requested player by id
    player = await Player.findById(req.params.id).populate("rounds").exec();
    if (player === null) {
      return res.status(404).json({ message: "Cannot find player" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  res.player = player;
  next();
}

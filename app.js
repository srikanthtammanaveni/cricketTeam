const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

app.use(express.json());

const getIntializeDBAndServer = async () => {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`Server is running at http://localhost:3000/`);
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
getIntializeDBAndServer();

//return list of players

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
         SELECT 
          *
          FROM 
          cricket_team
      ;`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

//creates new player
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `insert into  cricket_team (player_name,jersey_number,role)
                              values('${playerName}',${jerseyNumber},'${role}');`;
  const dbResponse = await db.run(addPlayerQuery);

  response.send("Player Added to Team");
});

//get single player details based on playerid
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `select * from cricket_team where player_id=${playerId};`;
  const playerData = await db.get(getPlayerQuery);
  response.send(playerData);
});

//update playerdetails

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const updatePlayerDetails = request.body;
  const { playerName, jerseyNumber, role } = updatePlayerDetails;
  const updatePlayerQuery = `update cricket_team set player_name='${playerName}',jersey_number=${jerseyNumber},role='${role}'
      where player_id=${playerId};`;
  await db.run(updatePlayerDetails);
  response.send("Player Details Updated");
});

//delete playerdetails

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `delete from cricket_team where player_id=${playerId};`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});
module.exports = app;

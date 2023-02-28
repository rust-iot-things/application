import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

import Grid from "@mui/material/Grid";
import Things from "./Things";
import ThingCard from "./ThingCard";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";

function App() {
  const [response, setResponse] = useState<Things>();
  const [devices, setDevices] = useState<Array<string>>();
  const [url, setUrl] = useState(
    "https://nqku66ut4d.execute-api.eu-central-1.amazonaws.com/items"
  );
  const itemList = ["Item1", "Item2", "Item3", "Item4", "Item5"];

  const [loading, setLoading] = useState(false);
  const [loadingDevices, setLoadingDevices] = useState(false);

  async function request() {
    try {
      setLoading(true);
      console.log("loading");
      setResponse(await invoke("request", { url }));
      console.log("finished");
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }

  async function discoverDevices() {
    try {
      console.log("called discoverDevices");
      setLoadingDevices(true);
      setDevices([]);
      setDevices(await invoke("discover_devices"));
      console.log("devices: {}", devices);
    } catch (e) {
      console.log(e);
    }
    setLoadingDevices(false);
  }

  return (
    <div className="container">
      <h1>Rust IoT Things</h1>

      <div className="row">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            request();
          }}
        >
          <input
            id="request-input"
            onChange={(e) => {
              setUrl(e.currentTarget.value);
            }}
            placeholder="https//..."
          />
          <button type="submit">Display</button>
        </form>
      </div>
      <p></p>
      <div>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {" "}
            {response?.Items.map((thing, index) => (
              <Grid key={index} id={thing.id} item xs={100}>
                <ThingCard thing={thing} />
              </Grid>
            ))}
          </Grid>
        )}
      </div>
      <p></p>
      <Divider sx={{ bgcolor: "white" }} />
      <p></p>
      <Box display="flex" justifyContent="center" alignItems="center">
        {loadingDevices ? (
          <CircularProgress />
        ) : (
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => {
              discoverDevices();
            }}
          >
            <SensorsOutlinedIcon />
          </Fab>
        )}
      </Box>
      <div>
        {devices?.map((device) => (
          <ul>{device}</ul>
        ))}
      </div>
    </div>
  );
}

export default App;

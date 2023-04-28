import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

import Grid from "@mui/material/Grid";
import Things from "./components/things/Things";
import ThingCard from "./components/things/ThingCard";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import INetworkManager from "./components/networkmanager/INetworkManager";
import ManagerFactory from "./components/ManagerFactory";

function App() {
  const networkManager: INetworkManager = ManagerFactory.getNetworkManager();

  const [things, setThings] = useState<Things>();
  const [devices, setDevices] = useState<Array<string>>();
  const [url, setUrl] = useState(
    "https://5et5nk2vi2.execute-api.eu-central-1.amazonaws.com/things"
  );

  const [loading, setLoading] = useState(false);
  const [loadingDevices, setLoadingDevices] = useState(false);

  useEffect(() => {
    getThings();
  }, []);

  const getThings = () => {
    setLoading(true);

    networkManager
      .getThings()
      .then((response) => {
        setThings(response);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => setLoading(false));
  };

  const customRequest = () => {
    console.log("this is the url: ", url);
    networkManager
      .useRequestFromURL(url)
      .then((response) => {
        console.log(response);
      })
      .catch((e) => console.log(e));
  };

  async function discoverDevices() {
    try {
      setLoadingDevices(true);
      setDevices([]);
      setDevices(await invoke("discover_devices"));
    } catch (e) {
      console.log(e);
    }
    setLoadingDevices(false);
  }

  return (
    <div className="container">
      <h1>{"Rust IoT Things"}</h1>

      <div className="row">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            customRequest();
          }}
        >
          <input
            id="request-input"
            onChange={(e) => {
              setUrl(e.currentTarget.value);
            }}
            placeholder="https//..."
          />
          <button type="submit">{"Submit"}</button>
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
            {things?.Items.map((thing, index) => (
              <Grid key={index} id={thing.id} item xs={100}>
                <ThingCard thing={thing} url={url} />
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

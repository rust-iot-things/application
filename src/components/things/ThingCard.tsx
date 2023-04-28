import "../../App.css";

import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import ColorPicker from "../led/ColorPicker";
import IThingCard from "./IThingCard";
import { Measurements } from "../temperature/Temperatures";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import INetworkManager from "../networkmanager/INetworkManager";
import ManagerFactory from "../ManagerFactory";
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ThingCard(props: IThingCard) {
  const networkManager: INetworkManager = ManagerFactory.getNetworkManager();

  const [clicked, setClicked] = useState<boolean>(false);
  const [temperatures, setTemperatures] = useState<Measurements[]>();
  const [humidity, setHumidity] = useState<number>(0.0);
  const handleOnClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (clicked === false) {
      getTemperature();
    }
    setClicked(!clicked);
  };

  const getTemperature = () => {
    networkManager
      .getTemperatures(props.thing.id)
      .then((temperatures) => {
        setTemperatures(temperatures.Item.Measurements);
      })
      .catch((e) => {
        console.log("getTemperature error!", e);
      });
  };

  async function getHumiditiy() {
    let url: string = props.url + "/" + props.thing.id + "/Humidities";
    setHumidity(await invoke("request_humidity", { url }));
  }

  useEffect(() => {
    getTemperature();
    getHumiditiy();
  }, []);

  const getTemperatureDataToDisplay = (): Measurements[] | undefined => {
    // show the last 10 measurements for now
    return temperatures !== undefined
      ? temperatures.length > 10
        ? temperatures.slice(-10)
        : temperatures
      : undefined;
  };

  return (
    <Card sx={{ minWidth: 275, padding: 1 }}>
      <CardHeader
        avatar={<Avatar aria-label="thing">{"ESP"}</Avatar>}
        title={props.thing.name}
        subheader={props.thing.id}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
      ></CardHeader>
      <CardContent>
        <Typography component="div">
          {`Temperature: ${temperatures?.at(-1)?.Value}°C`}
        </Typography>
        <Typography component="div">{`Humidity: ${humidity}%`}</Typography>
        <Typography component="div"></Typography>
      </CardContent>
      <CardActions
        disableSpacing
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></CardActions>
      <ExpandMore
        expand={clicked}
        onClick={(event) => handleOnClick(event)}
        aria-expanded={clicked}
        aria-label="show more"
      >
        <ExpandMoreIcon />
      </ExpandMore>
      <Collapse in={clicked} timeout="auto" unmountOnExit>
        <CardContent>
          <ColorPicker thing={props.thing} url={props.url} />
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getTemperatureDataToDisplay()}>
                <CartesianGrid strokeDasharray="2 2" />
                <XAxis
                  dataKey="Timestamp"
                  tickFormatter={(timeStr) =>
                    moment(timeStr).utc().format("HH:mm:ss")
                  }
                />
                <YAxis />
                <Line type="monotone" dataKey="Value" stroke="#8884d8" />
                <Tooltip
                  content={(a) => {
                    return a.active && a.payload && a.payload.length ? (
                      <div>
                        {"Temperature: " +
                          a.payload.at(0)?.value?.toString().slice(0, 5)}
                      </div>
                    ) : (
                      <></>
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Collapse>
    </Card>
  );
}

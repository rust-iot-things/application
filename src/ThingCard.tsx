import "./App.css";

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
import ColorPicker from "./ColorPicker";
import IThingCard from "./IThingCard";
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
  const [clicked, setClicked] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<number>(0.0);
  const [humidity, setHumidity] = useState<number>(0.0);
  const handleOnClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setClicked(!clicked);
  };

  async function getTemperature() {
    let url: string = props.url + "/" + props.thing.id + "/Temperatures";
    setTemperature(await invoke("request_temperature", { url }));
  }

  async function getHumiditiy() {
    let url: string = props.url + "/" + props.thing.id + "/Humidities";
    setHumidity(await invoke("request_humidity", { url }));
  }

  useEffect(() => {
    getTemperature();
    getHumiditiy();
  }, []);

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
        <Typography component="div">Temperature: {temperature}°C</Typography>
        <Typography component="div">Humidity: {humidity}%</Typography>
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
          <Typography paragraph>TBD: Temperature/Humidity Graph</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

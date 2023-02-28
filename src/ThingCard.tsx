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
import Items from "./Items";
import { useState, useEffect } from "react";

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

interface IThingCard {
  thing: Items
}

export default function ThingCard(props: IThingCard) {
  const [clicked, setClicked] = useState<boolean>(false);

  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setClicked(!clicked);
  }

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
        <Typography component="div">Temperature: 22.2°C</Typography>
        <Typography component="div">Humidity: 50%</Typography>
      </CardContent>
      <CardActions disableSpacing></CardActions>
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
          <Typography paragraph>TBD: Temperature/Humidity Graph</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

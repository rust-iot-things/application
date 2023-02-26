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

type RevisedHook = NonNullable<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>]
>;

export default function ThingCard(
  thing: Items,
  h: [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
) {
  if (h === undefined) {
    return <div></div>;
  }
  let hook: RevisedHook = h;
  const handleExpandClick = () => {
    hook?.[1](!hook?.[0]);
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardHeader
        avatar={<Avatar aria-label="thing">{"ESP"}</Avatar>}
        title={thing.name}
        subheader={thing.id}
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
        expand={hook?.[0]}
        onClick={handleExpandClick}
        aria-expanded={hook?.[0]}
        aria-label="show more"
      >
        <ExpandMoreIcon />
      </ExpandMore>
      <Collapse in={hook?.[0]} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>TBD: Temperature/Humidity Graph</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

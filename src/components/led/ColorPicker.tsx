import React from "react";
import { HuePicker } from "react-color";
import Fab from "@mui/material/Fab";
import { useState, useEffect } from "react";
import { TungstenOutlined } from "@mui/icons-material";
import { invoke } from "@tauri-apps/api/tauri";
import IThingCard from "../things/IThingCard";

export default function ColorPicker(props: IThingCard) {
  const [lampState, setLampState] = useState(false);
  const [color, setColor] = useState("#fff");

  async function request(state: boolean) {
    try {
      let url = props.url + "/" + props.thing.id + "/lamp?state=" + state;
      await invoke("put", { url });
    } catch (e) {
      console.log(e);
    }
  }

  async function sendColor(color: string) {
    try {
      // https://5et5nk2vi2.execute-api.eu-central-1.amazonaws.com/things/67564007518124132871400922612758296546/rgb?r=40&g=33&b=0
      let red = Number("0x" + color.substring(1, 3));
      let green = Number("0x" + color.substring(3, 5));
      let blue = Number("0x" + color.substring(5, 7));
      let url =
        props.url +
        "/" +
        props.thing.id +
        "/rgb?r=" +
        red +
        "&g=" +
        green +
        "&b=" +
        blue;
      console.log(`send color: ${url}`);
      await invoke("put", { url });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <HuePicker
        color={color}
        onChange={(color: { hex: any }) => {
          setColor(color.hex);
        }}
        onChangeComplete={(color: { hex: any }) => {
          sendColor(color.hex);
        }}
      />
      {lampState ? (
        <Fab
          color="primary"
          onClick={() => {
            console.log(`lampState ${lampState}`);
            setLampState(!lampState);
            request(!lampState);
          }}
        >
          <TungstenOutlined />
        </Fab>
      ) : (
        <Fab
          onClick={() => {
            console.log(`lampState ${lampState}`);
            setLampState(!lampState);
            request(!lampState);
          }}
        >
          <TungstenOutlined />
        </Fab>
      )}{" "}
    </div>
  );
}

// export class ColorPicker2 extends React.Component {
//   state = {
//     background: "#fff",
//   };

//   handleChangeComplete = (color: { hex: any }) => {
//     this.setState({ background: color.hex });
//   };

//   render() {
//     // const [lampState, setLampState] = useState(false);
//     return (
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <HuePicker
//           color={this.state.background}
//           onChange={this.handleChangeComplete}
//         />

// {/* {lampState ? (
//   <Fab
//     color="primary"
//     onClick={() => {
//       console.log(`lampState ${lampState}`);
//       setLampState(!lampState);
//     }}
//   >
//     <TungstenOutlined />
//   </Fab>
// ) : (
//   <Fab
//     onClick={() => {
//       console.log(`lampState ${lampState}`);
//       setLampState(!lampState);
//     }}
//   >
//     <TungstenOutlined />
//   </Fab>
//         )} */}
//       </div>
//     );
//   }
// }

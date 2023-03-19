import React from "react";
import { HuePicker } from "react-color";
import Fab from "@mui/material/Fab";
import { useState, useEffect } from "react";
import { TungstenOutlined } from "@mui/icons-material";
import { invoke } from "@tauri-apps/api/tauri";
import IThingCard from "./IThingCard";

export default function ColorPicker(props: IThingCard) {
  const [lampState, setLampState] = useState(false);
  const [color, setColor] = useState("#fff");
  props.url;
  async function request(state: boolean) {
    try {
      let url = props.url + "/" + props.thing.id + "/lamp?state=" + state;
      console.log(`let's invoke ${url} with ${state}`);
      await invoke("set_lamp_state", { url });
    } catch (e) {
      console.log(e);
    }
  }
  function sendColor(color: string) {
    console.log(`send color: ${color}`);
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

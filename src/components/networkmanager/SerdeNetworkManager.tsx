import Temperatures from "../temperature/Temperatures";
import Things from "../things/Things";
import INetworkManager from "./INetworkManager";
import { invoke } from "@tauri-apps/api/tauri";
const baseURL = "https://5et5nk2vi2.execute-api.eu-central-1.amazonaws.com";

export default class SerdeNetworkManager implements INetworkManager {
  private Endpoints = {
    things: `${baseURL}/things`,
    temperature: `/Temperatures`,
  };

  public async useRequestFromURL(url_: string): Promise<void> {
    console.log("SerdeNetworkManager: useRequestFromURL called!");
    return invoke<any>("request", {
      url: `${url_}`,
    }).then((response) => {
      return response;
    });
  }

  public async getTemperatures(
    thingsId: string
  ): Promise<{ Item: Temperatures }> {
    // should return more than one temperature and all information
    console.log("SerdeNetworkManager: getTemperatures called!");
    return invoke<any>("request_temperature", {
      url: `${this.Endpoints.things}/${thingsId}${this.Endpoints.temperature}`,
    }).then((response: number) => {
      let tmp: { Item: Temperatures } = {
        Item: {
          id: 0xff,
          Measurements: [
            {
              Value: response,
              Timestamp: "2023-03-19T20:07:21.071057716+00:00",
            },
          ],
        },
      };
      return tmp;
    });
  }

  public async getThings(): Promise<Things> {
    console.log("SerdeNetworkManager: getThings called!");
    return invoke<any>("request", {
      url: `${this.Endpoints.things}`,
    }).then((response: Things) => {
      return response;
    });
  }
}

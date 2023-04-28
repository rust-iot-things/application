import Temperatures from "../temperature/Temperatures";
import Things from "../things/Things";
import INetworkManager from "./INetworkManager";

const useSerde = false;

const baseURL = "https://5et5nk2vi2.execute-api.eu-central-1.amazonaws.com";

enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export const ApiUtils = {
  checkStatus(response: Response) {
    console.log(
      "\nResponse from: " +
        response.url +
        (response.ok ? "\n✅ Response Success: " : "\n⛔️ Response Failed: ") +
        response.status +
        "\n"
    );
    console.log("Response: ");
    console.log(response);
    if (response.ok) {
      console.log("response ok in ApiUtils!");
      return response;
    } else {
      console.log("response error in ApiUtils!");
      throw new Error(response.status.toString());
    }
  },
};

export default class NetworkManager implements INetworkManager {
  private requestHeader = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  private Endpoints = {
    things: `${baseURL}/things`,
    temperature: `/Temperatures`,
  };

  public async useRequestFromURL(url: string): Promise<any> {
    // non blocking api call
    return fetch(`${url}`, {
      method: RequestMethod.GET,
      headers: {
        ...this.requestHeader,
      },
    })
      .then(ApiUtils.checkStatus)
      .then((response) => {
        // todo parsing
        return response.json();
      });
  }

  public async getTemperatures(
    thingsId: string
  ): Promise<{ Item: Temperatures }> {
    // non blocking api call
    return fetch(
      `${this.Endpoints.things}/${thingsId}${this.Endpoints.temperature}`,
      {
        method: RequestMethod.GET,
        headers: {
          ...this.requestHeader,
        },
      }
    )
      .then(ApiUtils.checkStatus)
      .then((response) => {
        // todo parsing
        return response.json();
      });
  }

  public async getThings(): Promise<Things> {
    // non blocking api call
    return fetch(`${this.Endpoints.things}`, {
      method: RequestMethod.GET,
      headers: {
        ...this.requestHeader,
      },
    })
      .then(ApiUtils.checkStatus)
      .then((response) => {
        // todo parsing
        return response.json();
      });
  }
}

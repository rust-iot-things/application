import Temperatures from "../temperature/Temperatures";
import Things from "../things/Things";

export default interface INetworkManager {
  useRequestFromURL(url: string): Promise<any>;
  getThings(): Promise<Things>;
  getTemperatures(thingsId: string): Promise<{ Item: Temperatures }>;
}

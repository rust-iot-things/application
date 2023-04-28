import NetworkManager from "./networkmanager/NetworkManager";
import INetworkManager from "./networkmanager/INetworkManager";
import SerdeNetworkManager from "./networkmanager/SerdeNetworkManager";

const USE_SERDE = true;

export default class ManagerFactory {
  private static networkManager: INetworkManager | null = null;

  public static getNetworkManager(): INetworkManager {
    if (ManagerFactory.networkManager === null) {
      USE_SERDE
        ? (ManagerFactory.networkManager = new SerdeNetworkManager())
        : (ManagerFactory.networkManager = new NetworkManager());
    }
    return ManagerFactory.networkManager;
  }
}

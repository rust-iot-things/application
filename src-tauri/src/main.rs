// #![cfg_attr(
//     all(not(debug_assertions), target_os = "windows"),
//     windows_subsystem = "windows"
// )]

pub mod humidities;
pub mod temperatures;

use btleplug::api::{Central, Manager as _, Peripheral, ScanFilter};
use btleplug::platform::Manager;
use serde::{Deserialize, Serialize};
use std::thread;
use std::time::Duration;

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "PascalCase")]
struct Things {
    pub items: Vec<Items>,
}

#[derive(Deserialize, Serialize, Debug)]
struct Items {
    pub id: String,
    pub name: String,
}

#[tauri::command]
async fn discover_devices() -> Result<Vec<String>, String> {
    let mut devices: Vec<String> = vec![];
    let manager = Manager::new().await.unwrap();
    let adapter_list = manager.adapters().await.unwrap();
    if adapter_list.is_empty() {
        println!("No bluetooth adapter available");
        return Err("No bluetooth adapter available".into());
    }
    for adapter in adapter_list.iter() {
        adapter
            .start_scan(ScanFilter::default())
            .await
            .expect("Can't scan BLE adapter for connectsed devices...");
        thread::sleep(Duration::from_secs(3));
        let peripherals = adapter.peripherals().await.unwrap();
        for peripheral in peripherals.iter() {
            let properties = peripheral.properties().await.unwrap();
            if properties.is_some() {
                let local_name = properties.unwrap().local_name;
                if local_name.is_some() {
                    devices.push(local_name.unwrap());
                }
            }
        }
    }
    println!("devices: {:?}", devices);
    Ok(devices)
}

#[tauri::command]
async fn request(url: &str) -> Result<Things, String> {
    let resp = reqwest::get(url).await;
    match resp {
        Ok(response) => match response.text().await {
            Ok(payload) => {
                let deserialized: Things = serde_json::from_str(&payload).unwrap();
                println!("things {:?}", deserialized);
                return Ok(deserialized);
            }
            Err(e) => return Err(format!("{}", e)),
        },
        Err(e) => return Err(format!("{}", e)),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            discover_devices,
            request,
            temperatures::request_temperature,
            humidities::request_humidity
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "PascalCase")]
pub struct Temperatures {
    pub item: Item,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Item {
    pub id: String,
    #[serde(rename = "Measurements")]
    pub measurements: Vec<Measurements>,
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "PascalCase")]
pub struct Measurements {
    pub value: f64,
    pub timestamp: String,
}

#[tauri::command]
pub async fn request_temperature(url: &str) -> Result<f64, String> {
    let resp = reqwest::get(url).await;
    match resp {
        Ok(response) => match response.text().await {
            Ok(payload) => {
                let deserialized: Temperatures = serde_json::from_str(&payload).unwrap();
                match deserialized.item.measurements.last() {
                    Some(measuerement) => Ok(measuerement.value),
                    None => Err("no measurements".into()),
                }
            }
            Err(e) => return Err(format!("{}", e)),
        },
        Err(e) => return Err(format!("{}", e)),
    }
}

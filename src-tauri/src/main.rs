#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

pub fn main() {
    // Change demo_mobile_app to the name of your app!
    application::AppBuilder::new().run();
}

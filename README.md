# Rust IoT Tauri App for Linux + Mac + Windows & IoS + Android

## Required Stuff
### NPM
```
npm install
```

### Tauri
```
cargo install create-tauri-app
```
### Tauri Mobile
```
cargo install tauri-cli --version "^2.0.0-alpha"
```

## Desktop
### Run Desktop Application 
```
npm run tauri dev
```

### Build Desktop Application 

```
npm run tauri build
```

## Mobile
Replace `android` with `ios` for building for IoS.
### Initialize Mobile

```
cargo tauri android init
```
## Run Mobile
```
cargo tauri android dev
```
Requires an Android SDK and emulator.

### Util
## Kill Port
```
fuser -k 5173/tcp
```
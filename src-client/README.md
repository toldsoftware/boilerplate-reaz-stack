# Boilerplate for ReactXP App

Based on ReactXP Hello World Sample. 

## Improvements

- Improved Build (Webpack)
    - Split Vendor Code (Reload changes quicker)
    - Browser Sync (Browser Testing)
    - Preact (Tiny Build Size)
    - Bundle Visualizer (Visualize Bundle Library Size)

## How To

- View Visualizer
    - Enable in webpack
        - `const enableBundleVisualizer = false;`
    - Run webpack
        - `webpack`

- Run in Browser with Live Reload
    - `webpack -w`

- Change Sample App 
    - Modify the path in `index.tsx`
    - Restart webpack

- Run in Android
    - Start `tsc -w`
    - Start `npm start`
    - Open in Android Studio
        - Start Android Studio
        - Load Project `./android/build.gradle`
        - Run App (Play Button)
        - Fix Errors:
            - Upgrade to latest build tools version in plugin files
                - change `23.0.1` to `25.0.0` in indicated plugin files




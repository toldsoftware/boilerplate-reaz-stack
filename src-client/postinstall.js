const exec = require('child_process').exec;

// For Android
const  replace  = require("replace");

// For Ios
const request = require('request');
const fs = require('fs');
const path = require('path');
const  mkdirp  =  require('mkdirp');
const extractZip = require('extract-zip')

function processAndroidFiles(files) {
    replace({  
        regex: "buildToolsVersion '23\\.0\\.1'",
        replacement: "buildToolsVersion '25.0.0'",
        paths: files,
        recursive: false,
        silent: false,
    });

    replace({  
        regex: "buildToolsVersion \"23\\.0\\.1\"",
        replacement: "buildToolsVersion \"25.0.0\"",
        paths: files,
        recursive: false,
        silent: false,
    });

    // FIX for Facebook Android SDK
    replace({  
        regex: "com\\.facebook\\.android:facebook-android-sdk:4\\.\\+",
        replacement: "com.facebook.android:facebook-android-sdk:4.22.1",
        paths: files,
        recursive: false,
        silent: false,
    });

    // replace({  
    //     regex: "compile \"com.android.support:appcompat-v7:23.0.1\"",
    //     replacement: "compile \"com.android.support:appcompat-v7:25.0.0\"",
    //     paths: files,
    //     recursive: false,
    //     silent: false,
    // });
}

// Update Android Build Files
function updateAndroidBuildFiles() {
    console.log('START updateAndroidBuildFiles');

    const files = [
        './android/app/build.gradle',
        './node_modules/react-native-svg/android/build.gradle',
        './node_modules/react-native-video/android/build.gradle',
        './node_modules/mobile-center-crashes/android/build.gradle',
        './node_modules/mobile-center-analytics/android/build.gradle',
        './node_modules/react-native-fbsdk/android/build.gradle',
    ];

    processAndroidFiles(files);

    console.log('END updateAndroidBuildFiles');
}

function download(sourceUrl, targetPath, onDone, onError) {
    console.log('START download', sourceUrl, targetPath);

    const zipFile = fs.createWriteStream(targetPath);
    const result = request(sourceUrl).pipe(zipFile);

    result.on('error', (err) => {
        console.error('FAIL download', err, sourceUrl, targetPath);
        onError && onError();
    });

    result.on('finish', () => {
        if (!fs.existsSync(targetPath)) {
            console.error('FAIL download File not found', sourceUrl, targetPath);
            onError && onError();
            return;
        }

        console.log('END download', sourceUrl, targetPath, fs.statSync(targetPath).size);
        onDone && onDone();
    });
}

function unzip(zipPath, targetPath, onDone, onError) {
    console.log('START unzip', zipPath, targetPath);

    extractZip(zipPath, {
        dir: targetPath,
    }, function (err) {
        // handle err
        if (err) {
            console.error('FAIL unzip', err, zipPath, targetPath);
            onError && onError();
        } else {
            onDone && onDone();
        }
    });

    console.log('START unzip', zipPath, targetPath);
}

function downloadAndUnzip(zipUrl, targetPath, onDone) {
    console.log('START downloadAndUnzip', zipUrl, targetPath);

    targetPath = path.resolve(targetPath);
    const zipPath = path.resolve(targetPath + '_source.zip');
    mkdirp.sync(targetPath);

    download(zipUrl, zipPath, () => {
        unzip(zipPath, targetPath, () => {
            console.log('END downloadAndUnzip', zipUrl, targetPath);
            onDone && onDone();
        });
    });
}

function processIosFiles(files) {
    // ~/Documents/FacebookSDK
    // $(PROJECT_DIR)/../../../ios/Frameworks
    replace({  
        regex: "\\.\\./\\.\\./\\.\\./\\.\\./\\.\\./\\.\\./Documents/FacebookSDK",
        replacement: "../../../ios/Libs/FacebookSDK",
        paths: files,
        recursive: false,
        silent: false,
    });

    replace({  
        regex: "~/Documents/FacebookSDK",
        replacement: "$(PROJECT_DIR)/../../../ios/Libs/FacebookSDK",
        paths: files,
        recursive: false,
        silent: false,
    });
}

function updateIosBuildFiles() {
    console.log('START updateIosBuildFiles');

    // Error: Facebook Doesn't allow download
    //    downloadAndUnzip('https://origincache.facebook.com/developers/resources/?id=FacebookSDKs-iOS-4.22.1.zip', './ios/Libs/FacebookSDK');
    // Error: ~/Documents/ does not work with node
    // downloadAndUnzip('https://NAME_LOWER.blob.core.windows.net/build-files/FacebookSDKs-iOS-4.22.1.zip', '~/Documents/FacebookSDK', () => {

    const files = [
        './ios/ProjNamePascal.xcodeproj/project.pbxproj',
        './node_modules/react-native-fbsdk/ios/RCTFBSDK.xcodeproj/project.pbxproj',
    ];

    processIosFiles(files);

    downloadAndUnzip('https://projnamelower.blob.core.windows.net/build-files/FacebookSDKs-iOS-4.22.1.zip', './ios/Libs/FacebookSDK', () => {
        console.log('END updateIosBuildFiles');
    });
}

function runTsc() {
    console.log('START tsc');
    exec('tsc');
    console.log('END tsc');
}

function listEnvVars() {
    console.log('START listEnvVars');

    const env = process.env;
    for (var k in env) {
        if (env.hasOwnProperty(k)) {
            console.log('process.env.' + k + ':' + env[k]);

        }
    }

    console.log('END listEnvVars');
}


// Main
function main() {
    // Detect Environment
    const sonomaTags = ',' + process.env.SONOMA_TAGS + ',';
    const isAndroid = !!sonomaTags.match(',android,');
    const isIos = !!sonomaTags.match(',xcode,');

    console.log('sonomaTags:', sonomaTags);
    console.log('isAndroid:', isAndroid);
    console.log('isIos:', isIos);

    listEnvVars();

    if (isAndroid) {
        updateAndroidBuildFiles();
    }

    if (isIos) {
        updateIosBuildFiles();
    }

    runTsc();
}

function testProcessAndroidFiles() {

    const files = [
        './src-client/postinstall-test.txt',
    ];

    processAndroidFiles(files);
}

function testUpdateIosFiles() {

    process.chdir('./src-client');
    updateIosBuildFiles();
}


main();
// testProcessAndroidFiles();
// testUpdateIosFiles();
# Reaz Stack

React
	Web
	Native
Azure
	Functions
	Storage
	Cdn

## Setup

- Rename Files, Folders, and Contents
	- Rename `ProjNamePascal` to project name in PascalCase
	- Rename `projNameCamel` to project name in camelCase
	- Rename `projnamelower` to project name in lowercase
	- Rename `proj-name-kabob` to project name in kabob-case
 	- Known Files:
		- `_deploy/proxies.json`
		- `src-client/postinstall.js`
		- `src-server/package.js`
		- `src-client/package.js`

- Upload FacebookSDK .zip for Azure Mobile Center
	- Default Path in `src-client/postinstall.js` is `https://NAME_LOWER.blob.core.windows.net/build-files/FacebookSDKs-iOS-4.22.1.zip`


## Build, Run, & Deploy

### Build 

- Server
	- `cd src-server`
	- `webpack -w`
- Client
	- `cd src-client`
	- `webpack -w`

### Run

- Server
	- Open File
		- Example: `_endpoints/api/_test.ts`
	- Hit F5 (in VsCode)

- Client
	- Just Build and a browser window will open

### Deploy

- Setup (One Time)
	- Copy `_deploy-template` to `_deploy`
	- Modify Paths in `_deploy/proxies.json` to point to actual function (Replace FUNCTION with correct sub domain)
	- Setup the _deploy folder as a seperate git repo with online service (Github, Bitbucket, etc.)
	- Create an Azure Functions Instance and setup git deploy to point to online _deploy repo

- Server & Client
	- Build
	- `cd _deploy`
	- `git push`

### Run in Production

- Server
	- Call Web Api at https://FUNCTION.azurewebsites.net/api/PATH
- Client
	- Open Web App at https://FUNCTION.azurewebsites.net

### Run Native App

- Setup (One Time)
	- Create App at http://mobile.azure.com
	- Add Native App Settings in App for Analytics, Crash, etc.
	- Setup Git Deploy
	- Setup Automated Build

- Deploy
	- Build to _deploy-app Folder
	- `git push` _deploy-app Folder
	- Distribute in Mobile Center (can be done automatically after build)
	- Receive Distribution Email
	- Follow Instructions to Install App


## Technologies

- ReactXP (Web App and Native App)
	- React Native
	- React
- Resub (App Data Store)
- Azure Functions (Serverless Web Server)
	- Node.js Express Http Function (Web Api)
	- Node.js Express Static Http Function (Static Build Files)
	- Proxy (Routing)
	- Timer Functions (Data Processing, Data Generation, Server Side Rendering)
	- Git Deploy
	- Pure Pay Per Usage with 1 Million Free Executions Per Month Per Deployment
- Azure CDN w/ Custom Domain (Global CDN)
	- Main Entry Point for Custom Domain
	- Free Https
	- Static Files CDN
	- Blob File CDN
	- Query String Pass Through for Web Api (Using Custom Domain) 
- (Optional) Azure Traffic Manager (Global Web Api)
	- Point CDN to Traffic Manager
	- Point Traffic Manager to Multiple Azure Function Instances
	- Support Global Web Api for Improved Latency Response
	- Use Master & Slave Azure Function Projects
	- Requires Custom Data Syncing Strategy
	- Dual Master Syncing Can Offer Master Outage Redundancy
- Azure Mobile Center (Native App Build Server)
	- Git Deploy 
	- Automated Build (iOS, Android, Windows Phone)
	- Test User Distribution
	- Analytics
- Azure Storage
	- Blobs (Generated Content)
	- Tables (No-SQL Primary Data)
	- Queues (Data Transfer Messages/Triggers)
 
## Qualities

- ~Infinite Scalability (Auto Scaling with no Cap)
- Global Availability (CDN Content & Optional Global Web Api)
- Extreme Productivity (1 Second Build Time, Git Deploy, Browser Testing, Local Server Testing w/ VSCode)
- Minimal Costs (< $1 Million Users, Pure Pay Per Use)
- Outage Redundancy (Automatic Fail-over to Secondary Data Center)
- Small Web App Build Size (<250kb w/ Server-Side Rendering Support)




## TODO

Add Android and iOS Folders
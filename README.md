# Letter Frequency Analyzer

This project is a React + Vite web application that analyzes the letter frequency in all JavaScript and TypeScript files from the GitHub repository lodash/lodash. 
It uses the GitHub API to fetch the repository's JavaScript and TypeScript file contents to calculate the frequency of each letter.

## Prerequisites

To set up and run this project, ensure you have the following installed on your machine:

* Node.js (v16 or later recommended)
* npm (comes with Node.js)
* Preferably a GitHub Personal Access Token for API authentication.

## Setup Instructions

### Clone the Repository
```
git clone https://github.com/Mirak42/GitHubLetterFrequency.Web.git
cd GitHubLetterFrequency.Web
```
### Install Dependencies
```
npm install
```
### Create a GitHub Personal Access Token
The GitHub API has rate limits for requests, depending on the type of authentication.
Only 60 requests per hour for unauthenticated calls, this is why a personal access token is recommended.

* Go to your GitHub account settings: [GitHub Personal Access Tokens](https://github.com/settings/tokens).
* Generate a new token with read-only access to public repositories.
* Copy and keep the generated token.

### Setup the Environment Variable
* Create a .env file in the root of the project:
```
touch .env
```
* Add the following line to your .env file, replacing **your_token_here** with your actual token:
```
REACT_APP_GITHUB_TOKEN=your_token_here
```
### Start the Development Server
* Run the following command to start the application:
```
npm run dev
```
* This will start a development server, and you can view the application in your browser at:
```
http://localhost:5173
```




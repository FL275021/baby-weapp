# Child Routine Tracker

A mobile web app that helps parents track a baby's daily routine — bottles, diaper changes, and other events — throughout the day. Built with vanilla JavaScript and Ionic web components, packaged as a hybrid mobile app with Capacitor.

## Features

- **Accounts** — register with a username, password, and location (department/city), then log in / log out
- **Log events** — add an event (category, optional detail, date) for the logged-in user; defaults to the current date/time if none is given
- **Today's events** — view events logged today, each with a category icon, and delete any of them
- **History** — view all past events (everything not logged today)
- **Map** — shows the user's current location and nearby public spaces, flagging which are wheelchair-accessible and which allow pets
- **Daily report** — total bottles given today and time since the last one; total diaper changes today and time since the last one

## Tech stack

- Vanilla JavaScript (ES6), no framework or bundler
- [Ionic](https://ionicframework.com/) web components (loaded via CDN) for UI and client-side routing
- [Leaflet](https://leafletjs.com/) for the map
- [Capacitor](https://capacitorjs.com/) to package the web app as an Android APK
- A remote REST API (PHP backend) for data — see `www/req.txt` for the original API spec

## Project structure

```
www/
  index.html       # App shell: routes, screens (login, register, events, history, add event, report)
  js/codigo.js      # All app logic: API calls, rendering, navigation, geolocation
  req.txt           # Original functional spec for the API this app talks to
```

## Running locally

This is a static site with no build step — serve the `www/` folder with any static file server and open it in a browser:

```bash
npx serve www
```

For the map and geolocation features, your browser will need to grant location permissions, and the app talks to a live API at `https://babytracker.develotion.com` — there's no local mock backend included.

## Building the Android app

The APK isn't committed to this repo (binaries don't belong in git — see `.gitignore`). To build it yourself, wrap `www/` with Capacitor:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init
npx cap add android
npx cap sync
npx cap open android   # opens Android Studio to build/run
```


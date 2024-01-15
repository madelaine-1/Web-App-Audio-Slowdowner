# WEB APP AUDIO SLOWDOWNER

This project is a web app that allows you to slow down, change the pitch and create loops of audio files. This is useful for musicians who want to learn a song by ear. It uses Tone.js to manipulate the audio and React to create the UI. I am currently working on adding a backend to allow users to save their audio files.

## Prerequisites

### Frontend

In order to run this project on your local machine, you will need to download the dependancies using npm for the frontend. To do this, cd into the project directory and run the following commands:

```cd slowdowner-frontend```

```npm install```

This should give you all the dependancies you need to run the project in its current state. To view the project in your browser, run the following command:

```npm start```

and navigate to [http://localhost:3000/](http://localhost:3000/) in your browser.

### Backend

The backend is currently in development. To run the backend, cd into the project directory and run the following commands:

```cd slowdowner-backend```

```pip install -r requirements.txt```

Now, to run the backend, run the following command:

```uvicorn main:app --reload```

## Build with

* [React](https://reactjs.org/) - A JavaScript library for building user interfaces
* [Tone.js](https://tonejs.github.io/) - A Web Audio framework for creating interactive music in the browser
* [styled-components](https://styled-components.com/) - A CSS-in-JS library for React
* [FastAPI](https://fastapi.tiangolo.com/) - A modern, fast (high-performance), web framework for building APIs with Python 3.6+ based on standard Python type hints

## License

This project is licensed under the MIT License - see the LICENSE.md file for details

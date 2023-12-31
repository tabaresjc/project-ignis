# Project Ignis

## Structure

### App Projects

- `ignis-api`: Backend API project powered by Nest JS.

## Getting started

### Requirements

- Install Node.js v18. 
    - If you have `asdf` installed you can simply run `asdf install` at the root of the project to install the correct node environment.
- Install Docker.
- Globally install `nx` with `npm install --global nx@latest`.
- Run `yarn install` in the root of this folder.


Notes:
- `asdf`: [getting started & install](https://asdf-vm.com/guide/getting-started.html#_3-install-asdf)

### Build

To build any of the project, just simply specify the name of the project (see Structure):

```shell
nx build ignis-api
```

### Test

To run unit test for any of the project, just simply specify the name of the project (see Structure):
```shell
nx test ignis-api
```

## Run test application with Docker

The test application is intended to be executed for demonstration.

The application will read the environment variables in `env.test` file, in order to provision a new `mysql` database & the API application.

There are certain elements that are worth mentioning:
- `env.test`: this is the config file that will be read by `nx` to setup the application & database. Is already there, so you don't need to change it.
- `tmp/audio-data-test`: storage location of the audio files.
- `tmp/mysql-test`: location of the mysql data files. This will ensure data is permanent even after the container is rebooted. 
- If you ever need to have a fresh installation, you can just remove anything under this folder to start anew.
- There are some sample files located in `samples` folder. To make it easy to test certain endpoints.

- Build image

This step generates an image derived from Ubuntu 20.08 which contains FFMPEG as well as other dependencies to execute the service.

```bash
npm run docker:test:build
```

- Start application & db

```bash
npm run docker:test:start
```

API application should be listening on `http://localhost`, you can change the API port at `env.test` by assigning a different value. In this case the API will be listening with the assigned port number `http://localhost:${PORT}`.

- Testing application:

Once the application has started, the database should have been created & seeded with the tables & data needed to run the following tests.

  - Upload phrase audio file

```bash
curl --request POST http://localhost/audio/user/1/phrase/1 --form 'audio_file=@"samples/sample-3s.mp3"'
```

For noew the supported format audio files are: [`mp3`]

  - Retrieve phrase audio file

```bash
curl --request GET http://localhost/audio/user/1/phrase/1/{format} -o './tmp/test_response_file_1_1_1.mp3'
```

For now the supported `{format}` audio files are: [`mp3`]


## Swagger doc (AKA Open API)

Swagger documentation of the `ignis-api` is available at {apiUrl}/docs.

Assouming `PORT` in `env.test` file is set with `80`, then you can expect to find the Open API doc at `http://localhost/docs``


![Open API](images/open-api.png)

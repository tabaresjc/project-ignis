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
nx build <project>
```

### Test

To run unit test for any of the project, just simply specify the name of the project (see Structure):
```shell
nx build <project>
```

## Run test application with Docker

The test application is intended to be executed for demonstration.

The application will read the environment variables in `env.test` file, in order to provision a new `mysql` database & the API application.

There are certain elements that are worth mentioning:
- `env.test`: the config file read by `nx` to load the application & database.
- `tmp/audio-data-test`: storage location of the audio files.
- `tmp/mysql-test`: location of the mysql data files. This will ensure data is permanent even after the container is rebooted. 

- Build image

This step generates an image derived from Ubuntu 20.08 which contains FFMPEG as well as other dependencies to execute the service.

```bash
npm run docker:test:build
```

- Build local image

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

For noew the supported `{format}` audio files are: [`mp3`]
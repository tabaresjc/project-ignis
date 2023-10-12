#!/bin/sh

DOCKER_COMPOSE=./docker-compose.dev.yml
ENV_FILE="./.env.${ENVIRONMENT:-local}"
PROJ_NAME="ignis-${ENVIRONMENT:-local}"

# set env variables to be consumed by docker compose
export APP_HOME=$PWD

commands() {
    case "$1" in
        'build')
            build_docker_image
        ;;
        'start')
            start
        ;;
        'start_database')
            start_database
        ;;
        'shell')
            start_app_shell
        ;;
        'stop')
            stop_docker
        ;;
        'down')
            down_docker
        ;;
        *) echo 'Unknown command, please check README for details and try again!';;
    esac
}

build_docker_image() {
    docker-compose -f $DOCKER_COMPOSE \
        --env-file $ENV_FILE \
        --project-name $PROJ_NAME \
        build
}

start() {
    docker-compose -f $DOCKER_COMPOSE \
        --env-file $ENV_FILE \
        --project-name $PROJ_NAME \
        up --detach --remove-orphans \
        app
}

start_database() {
    docker-compose -f $DOCKER_COMPOSE \
        --env-file $ENV_FILE \
        --project-name $PROJ_NAME \
        up --detach --remove-orphans \
        mysql
}

start_app_shell() {
    docker stop app_bash || 0
    docker rm app_bash || 0
    docker-compose -f $DOCKER_COMPOSE \
        --env-file $ENV_FILE \
        --project-name $PROJ_NAME \
        run --name app_bash \
        app /bin/bash
}

stop_docker() {
    docker-compose -f $DOCKER_COMPOSE \
        --env-file $ENV_FILE \
        --project-name $PROJ_NAME \
        stop
}

down_docker() {
    docker-compose -f $DOCKER_COMPOSE \
        --env-file $ENV_FILE \
        --project-name $PROJ_NAME \
        down
}

## Execute selected command
commands "$1"

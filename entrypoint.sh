#!/bin/sh
http-server --proxy "${FFMPEGLAB_HOST-http://localhost:8080/webapp/?}" .
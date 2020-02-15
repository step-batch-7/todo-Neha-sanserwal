#! /bin/zsh

mkdir test/resource;
touch test/resource/data.json;
echo '{"john":{"username":"john","password":"123","todo":"{}"}}' > test/resource/data.json;
export data_store=$(pwd)/test/resource/data.json;
nyc mocha;
rm -rf test/resource;

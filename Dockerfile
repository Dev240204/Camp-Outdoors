FROM node:20-alpine

ENV MONGO_DB_USERNAME=camping \
    MONGO_DB_PWD=password \
    CLOUD_NAME=dchlc6jte \
    CLOUD_KEY=372263951999738 \
    CLOUD_SECRET=uNXP7r57F9NXEM0FiGw34enCpJ4 \
    MAP_KEY=E23PLaNZ4ebkNeRNNQlZ \
    DB_URL=mongodb+srv://camping:xe5RYNiMhEsp2uHl@cluster0.vgoq7t7.mongodb.net/?retryWrites=true&w=majority

RUN mkdir -p /home/app

COPY . /home/app

CMD [ "node","/home/app/index.js" ]
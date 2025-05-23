FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci

# Bundle app source
COPY . .

# transpile typescript
RUN npx tsc -p tsconfig.build.json

EXPOSE 4000
CMD [ "node", "src/server.js" ]

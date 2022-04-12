FROM node:latest
# Set working directory
WORKDIR /pbr

COPY package*.json ./
# install node modules and build assets - continuous integration
RUN npm ci
# Copy all files from current directory to working dir in image
COPY . .

CMD ["npm", "start"]
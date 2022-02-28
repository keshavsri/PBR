FROM node:latest
# Set working directory
WORKDIR /pbr
# Copy all files from current directory to working dir in image
COPY . .
# install node modules and build assets
RUN npm install

CMD ["npm", "start"]
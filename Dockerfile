FROM vaijab/nodejs:0.12.7

RUN npm install -g nodemon
RUN useradd -d /app app
USER app

WORKDIR /app
COPY package.json /app/package.json
COPY assets /app/assets
RUN npm install
COPY . /app

USER root
RUN chown -R app:app .

USER app
RUN npm run hof-transpile

USER root
EXPOSE 8080
CMD /app/run.sh

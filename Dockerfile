FROM node:8.1.4

RUN apt-get update -y && apt-get install -y ruby-full

WORKDIR /app
ADD . /app

RUN gem install bundler
RUN bundle install --deployment --without development

RUN yarn install

EXPOSE 3000

# Set the timezone
RUN echo "America/New_York" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

HEALTHCHECK --interval=10s --timeout=3s CMD curl --fail http://localhost:3000/ping || exit 1

CMD ["yarn", "run", "start"]

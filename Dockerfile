FROM ruby:3-alpine

WORKDIR /app

RUN gem install kramdown

CMD ["./processor.rb"]

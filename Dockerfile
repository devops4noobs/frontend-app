#Stage 1
FROM node:alpine AS builder

WORKDIR /app
COPY . /app/

RUN npm install
RUN npm install react-scripts@5.0.1 -g
COPY . .
RUN npm run build
CMD ["npm", "start"]

# Prepare nginx
#FROM nginx

# ENV CURL_VERSION=8.2.1

# RUN apk -U upgrade && apk add -f wget build-base libcurl4 && \
#     wget https://curl.se/download/curl-${CURL_VERSION}.tar.gz && \
#     tar -xvf curl-${CURL_VERSION}.tar.gz && cd curl-${CURL_VERSION} && ./configure --without-ssl && make && make install

#RUN adduser -D cip-fe
#RUN rm /etc/nginx/conf.d/default.conf
#COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# RUN  chown -R cip-fe /var/cache/nginx && \
#     chown -R cip-fe /var/log/nginx && \
#     chown -R cip-fe /etc/nginx/conf.d/nginx.conf && \
#     chown -R cip-fe /usr/share/nginx/html

# RUN touch /var/run/nginx.pid && \
#     chown -R cip-fe /var/run/nginx.pid

#COPY --from=builder /app/build /usr/share/nginx/html
#RUN rm /etc/nginx/conf.d/default.conf
#COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Fire up nginx
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
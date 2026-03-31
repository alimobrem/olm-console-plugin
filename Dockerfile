FROM registry.access.redhat.com/ubi9/nodejs-22:latest AS build
USER 0
WORKDIR /opt/app-root/src
COPY . .
RUN corepack enable && yarn install && yarn build

FROM registry.access.redhat.com/ubi9/nginx-122:latest
COPY --from=build /opt/app-root/src/dist /opt/app-root/src
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]

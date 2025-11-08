FROM alpine:latest AS base
ARG ARCH
ARG NODE_VERSION=22

RUN <<EOF
addgroup -S appgroup -g 1001
addgroup -S sudo
getent group sudo
adduser -S appuser -u 1001 -G sudo -G appgroup  -h /home/appuser -D

mkdir -p /app 

apk update
apk -U --no-cache add util-linux sudo \
  curl nano jq xz gzip nodejs-current npm tzdata su-exec envsubst caddy

echo "%sudo ALL = (ALL) NOPASSWD: ALL " >/etc/sudoers.d/nopasswd
echo "Defaults exempt_group = sudo " >>/etc/sudoers.d/nopasswd

sed -i '/getty/d' /etc/inittab

npm install -g typescript ts-node tslib @types/node pm2

ln -f -s "/usr/share/zoneinfo/$TZ" '/etc/localtime'
echo "$TZ" | tee /etc/timezone
EOF

COPY . .
RUN npm i
RUN npm run dev

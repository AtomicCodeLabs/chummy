FROM node:12.19.0

# Copy environment files from jenkins host to build container
COPY /var/jenkins_home/.env.development /data/.env.development
COPY /var/jenkins_home/.env.production /data/.env.production

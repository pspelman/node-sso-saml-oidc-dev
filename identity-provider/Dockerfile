######################
#### DEPENDENCIES ####
######################

FROM node:16 as dependencies

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json yarn.lock /usr/src/app/

RUN yarn install --frozen-lockfile --network-timeout 100000


#####################
###### BUILDER ######
#####################

FROM node:16 as builder
WORKDIR /usr/src/app
COPY . .
COPY --chown=node:node --from=dependencies /usr/src/app/node_modules /usr/src/app/node_modules
# NOTE: Skip for backend
# RUN yarn build


#######################
##### APPLICATION #####
#######################

FROM node:16 as application
WORKDIR /usr/src/app

# Set the environment -- should get from kubernetes / host
ENV NODE_ENV dev

# Copy everything for DEV
COPY --from=builder /usr/src/app/ ./

# Copy only items needed for production
#ENV NODE_ENV production
# custom-config requires the following line
#COPY --from=builder /usr/src/app/next.config.js ./
#COPY --from=builder /usr/src/app/public ./public
#COPY --from=builder /usr/src/app/.next ./.next
#COPY --from=builder /usr/src/app/node_modules ./node_modules
#COPY --from=builder /usr/src/app/package.json ./package.json

EXPOSE 8080

# Running the app -- this will be overridden by the docker-compose cmd
CMD ["yarn", "start"]
#ENTRYPOINT ['user/src/app/entrypoint.dev.sh']


# FROM node:16
# WORKDIR /app
# COPY package.json .
# ARG NODE_ENV
# RUN if [ "$NODE_ENV" = "development" ]; \
#         then npm install; \
#         else npm install --only=production; \
#         fi
# COPY . .
# RUN npx prisma generate
# EXPOSE 4000
# CMD [ "npm", "run", "start" ]
FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY npm-lock.yaml ./

RUN npm install

COPY . .

RUN npm run build


FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY npm-lock.yaml ./

RUN npm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
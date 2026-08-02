FROM node:22-alpine
WORKDIR /app

COPY .output ./.output

EXPOSE 3000

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

CMD ["node", ".output/server/index.mjs"]

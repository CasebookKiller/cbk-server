# cbk-server

{
  "name": "cbk-server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "npx tsc",
    "start": "node dist/index.js",
    "web": "cd ../wetothemoon-web && vite",
    "server": "npx tsc && nodemon -q dist/index.js",
    "dev": "concurrently \"npm run server\" \"npm run web\""
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "@grpc/grpc-js": "^1.14.3",
    "@supabase/supabase-js": "^2.86.0",
    "@typescript-eslint/eslint-plugin": "^8.52.0",
    "@typescript-eslint/parser": "^8.52.0",
    "cors": "^2.8.5",
    "eslint": "^9.39.2",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-prettier": "^5.5.4",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.3",
    "long": "^5.3.2",
    "nice-grpc": "^2.1.14",
    "prettier": "^3.7.4",
    "protobufjs": "^8.0.0",
    "tinkoff-invest-api": "^7.0.1",
    "ts-proto": "^2.10.1"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/debug": "^4.1.12",
    "@types/express": "^5.0.5",
    "@types/google-protobuf": "^3.15.12",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/node": "^24.10.1",
    "concurrently": "^9.2.1",
    "dotenv": "^17.2.3",
    "node-fetch": "^3.3.2",
    "nodemon": "^3.1.11",
    "ts-node": "^10.9.2",
    "typescript": "^5.9.3"
  }
}

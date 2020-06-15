npx prisma migrate save --name first --experimental
yes | npx prisma migrate up --experimental --create-db
npx prisma generate
npm start
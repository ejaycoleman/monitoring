npx prisma migrate save --name first --experimental
npx prisma migrate up --experimental --create-db
npx prisma generate
npm start
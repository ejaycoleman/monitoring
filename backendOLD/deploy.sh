r=1
while [ $r == 1 ]
do
    prisma deploy
    r=$?
done
npm start
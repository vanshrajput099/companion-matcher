'use server'
import { interests } from '@/data';
import { encryptPassword } from '@/utils/passwordCrypter';
import { db } from '@/utils/prisma';
import { faker } from '@faker-js/faker';

export const seedUsers = async () => {
    try {
        const usersData = [];

        for (let i = 0; i < 100; i++) {
            const name = faker.person.fullName();
            const username = faker.internet.userName({ firstName: name.split(" ")[0] });
            const password = await encryptPassword('password123'); // default password
            const age = faker.number.int({ min: 18, max: 40 });

            // Select 1 to 5 random interests
            const shuffled = interests.sort(() => 0.5 - Math.random());
            const selectedInterests = shuffled.slice(0, faker.number.int({ min: 1, max: 5 }));

            usersData.push({
                username,
                name,
                password,
                age,
                interests: selectedInterests
            });
        }

        await db.user.createMany({
            data: usersData,
            skipDuplicates: true,
        });

        return { success: true, message: "100 users seeded successfully" };
    } catch (err) {
        console.error("Seeding error:", err);
        return { success: false, message: "Seeding failed", error: err };
    }
};

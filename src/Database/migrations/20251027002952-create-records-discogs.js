'use strict';

/**
 * @type {import('sequelize-cli').Migration}
 */
export default {
    async up(queryInterface, Sequelize) {
        const discogsToken = process.env.DISCOGS_API_TOKEN;
        const discogsUrl = process.env.DISCOGS_API_URL;
        const migrationAmount = process.env.DISCOGS_INITIAL_MIGRATION_AMOUNT;

        const fetchOptions = {
            headers: {
                'User-Agent': 'CourseFinalProject/1.0',
                'Authorization': `Discogs token=${discogsToken}`,
            },
        };

        try {
            const searchResult = await fetch(
                `${discogsUrl}/database/search?q=vinyl&type=release&per_page=${migrationAmount}&page=1-+`,
                fetchOptions
            );
            const searchData = await searchResult.json();

            const records = [];

            for (const item of searchData.results.slice(0, migrationAmount)) {
                try {
                    const releaseRes = await fetch(
                        `${discogsUrl}/releases/${item.id}?USD`,
                        fetchOptions
                    );
                    const release = await releaseRes.json();

                    const discogsId = release.id;
                    const name = release.title;
                    const authorName = release.artists_sort || 'Unknown';
                    const description = 'No description';
                    const price = release.lowest_price || 300;

                    records.push({
                        discogsId,
                        name,
                        authorName,
                        description,
                        price,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                } catch (error) {
                    console.error(`Failed to fetch release ${item.id}: ${error.message}`);
                }
            }
            
            await queryInterface.bulkInsert('records', records);
        } catch (error) {
            console.error('Migration failed:', error.message);
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('records', null, {});
    },
};

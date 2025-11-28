/**
 * Migration script to update image URLs from /uploads/ to /api/uploads/
 * Run this once to fix existing database entries
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:ASHbPZnQl7hAocSkxsXSIe28spzqltpV0fsfsygdj1m6n2vjhqDmpj7HR5ibI0KP@46.202.154.149:27017/svelte?directConnection=true&authSource=admin';

async function migrateImageUrls() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    // Update Services collection
    const servicesResult = await db.collection('services').updateMany(
      { imageUrl: { $regex: '^/uploads/' } },
      [{ $set: { imageUrl: { $replaceOne: { input: '$imageUrl', find: '/uploads/', replacement: '/api/uploads/' } } } }]
    );
    console.log(`Updated ${servicesResult.modifiedCount} service records`);

    // Update Blogs collection
    const blogsResult = await db.collection('blogs').updateMany(
      { imageUrl: { $regex: '^/uploads/' } },
      [{ $set: { imageUrl: { $replaceOne: { input: '$imageUrl', find: '/uploads/', replacement: '/api/uploads/' } } } }]
    );
    console.log(`Updated ${blogsResult.modifiedCount} blog records`);

    // Update Pages collection (for any sections with imageUrl)
    const pagesResult = await db.collection('pages').updateMany(
      { 'sections.imageUrl': { $regex: '^/uploads/' } },
      [{ 
        $set: { 
          sections: {
            $map: {
              input: '$sections',
              as: 'section',
              in: {
                $mergeObjects: [
                  '$$section',
                  {
                    imageUrl: {
                      $cond: {
                        if: { $regexMatch: { input: '$$section.imageUrl', regex: '^/uploads/' } },
                        then: { $replaceOne: { input: '$$section.imageUrl', find: '/uploads/', replacement: '/api/uploads/' } },
                        else: '$$section.imageUrl'
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }]
    );
    console.log(`Updated ${pagesResult.modifiedCount} page records`);

    console.log('Migration completed successfully!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateImageUrls();


'use client';

import { db } from '@/app/lib/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import productData from '../product_data.json';

/**
 * Utility function to migrate product data from JSON to Firebase
 * Run this function once to populate the database
 */
export async function migrateProductsToFirebase() {
  try {
    // Process products in batches of 500 (Firestore batch limit)
    const BATCH_SIZE = 500;
    const productsRef = collection(db, 'products');
    
    for (let i = 0; i < productData.length; i += BATCH_SIZE) {
      // Create a new batch for each chunk
      const currentBatch = writeBatch(db);
      const chunk = productData.slice(i, i + BATCH_SIZE);
      
      chunk.forEach((product) => {
        const docRef = doc(productsRef, product.sku); // Use SKU as document ID
        currentBatch.set(docRef, {
          ...product,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });

      // Commit the current batch
      await currentBatch.commit();
      console.log(`Migrated products ${i + 1} to ${i + chunk.length}`);
    }

    console.log('Migration completed successfully');
    return true;
  } catch (error) {
    console.error('Error migrating products:', error);
    throw error;
  }
} 